"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const compute_1 = tslib_1.__importDefault(require("@google-cloud/compute"));
const init_1 = require("../init");
const script_loader_service_1 = require("../services/script-loader.service");
init_1.notify();
class InstanceManager {
    constructor(projectId, keyFilePath, zoneName, region) {
        if (!projectId || !keyFilePath) {
            console.error('ProjectId & KeyFileName are mandatory parameters.');
        }
        this._computeClient = new compute_1.default({
            projectId,
            keyFilename: keyFilePath
        });
        this._zone = this._computeClient.zone(zoneName);
        this._region = this._computeClient.region(region);
    }
    async createInstance(configuration) {
        const virtualMachineLabel = configuration.instanceLabel.toLowerCase();
        const virtualMachineName = virtualMachineLabel + '-' + new Date().getTime();
        let startupScript = await script_loader_service_1.ScriptLoaderService.loadScript(configuration.startupScriptPath);
        startupScript = startupScript.replace(/\r\n/g, '\n');
        const machineConfiguration = {
            os: configuration.os,
            machineType: configuration.machineType,
            http: configuration.externalIP,
            "networkInterfaces": configuration.networkInterfaces,
            tags: [virtualMachineLabel.toLowerCase()].concat(configuration.tags),
            labels: Object.assign({
                // eslint-disable-next-line @typescript-eslint/camelcase
                belongs_to: virtualMachineLabel
            }, configuration.labels),
        };
        machineConfiguration.metadata = configuration.metadata || {};
        machineConfiguration.metadata.items = (machineConfiguration.metadata.items) ? machineConfiguration.metadata.items.concat({
            key: 'startup-script',
            value: startupScript
        }) : [{
                key: 'startup-script',
                value: startupScript
            }];
        const [vm, operation] = await this._zone.createVM(virtualMachineName, machineConfiguration);
        // console.log(vm);
        await operation.promise();
        const [metadata] = await vm.getMetadata();
        const ip = metadata.networkInterfaces[0].accessConfigs[0].natIP;
        // const newMetadata = {};
        // await vm.setMetadata(newMetadata);
        console.log(`Virtual Machine: ${virtualMachineName} was created. IP: ${ip}`);
        return {
            machineName: virtualMachineLabel,
            machineIP: ip
        };
    }
    // @ts-ignore
    async deleteInstanceByName(instanceName) {
        const vm = this._zone.vm(instanceName);
        const [operation] = await vm.delete();
        await operation.promise();
        console.log(`Instance ${instanceName} successfully deleted`);
    }
    getVM(VMName) {
        try {
            return this._zone.vm(VMName);
        }
        catch (e) {
            console.error(`${VMName} was not found. Please check name.`);
            return null;
        }
    }
    async updateMetaData(VMName, metaData) {
        const VM = this._zone.vm(VMName);
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [operation, _apiResponse] = await VM.setMetadata(metaData);
        await operation.promise();
    }
    async deleteAccessConfig(virtualMachineName) {
        const virtualMachine = this.getVM(virtualMachineName);
        // const [metadata] = await virtualMachine.getMetadata();
        // const ip = metadata.networkInterfaces[0].accessConfigs[0].natIP;
        // const fingerprint = metadata.metadata.fingerprint;
        await virtualMachine.deleteAccessConfig();
        console.log(`${virtualMachineName} was deleted successfully.`);
    }
    async getAddress(addressName) {
        const address = this._region.address(addressName);
        // @ts-ignore
        const [addressInfo, apiResponse] = await address.get();
        console.log(addressInfo);
        return addressInfo;
    }
    async listAllVirtualMachines(filterValue) {
        // @ts-ignore
        const [vms, apiResponse] = await this._zone.getVMs({
            filter: filterValue ? 'labels.belongs_to eq ' + filterValue : 'labels.belongs_to eq .*'
        });
        return vms;
    }
    async setLabels(virtualMachineName, labelConfig) {
        const virtualMachine = this.getVM(virtualMachineName);
        await virtualMachine.setLabels(labelConfig);
        console.log(`Labels were successfully updated for these things...`);
    }
}
exports.InstanceManager = InstanceManager;
//# sourceMappingURL=InstanceManager.js.map