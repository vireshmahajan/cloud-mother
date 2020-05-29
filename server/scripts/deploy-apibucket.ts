import {InstanceManager} from "../instance-manager/InstanceManager";
let instanceManager: InstanceManager;
const envConfig = process.env;
import path from "path";
import {DomainManager} from "../domain-manager/DomainManager";
import {PingService} from "../services/ping-service";
const configFilePath = envConfig.deployConfiguration || '';

async function getConfig(configPath: string): Promise<any> {
    console.log(path.resolve(configPath))
    return await import(path.resolve(configPath));
}

async function startOrchestration(configuration: any): Promise<void> {
    const machineLabel = configuration.instanceLabel.toLowerCase();
    console.log('\x1b[32m%s\x1b[0m','Deployment Starting on instances labelled: ' + machineLabel);
    console.log('\x1b[32m%s\x1b[0m', `ProjectId: ${configuration.projectId}`);
    instanceManager = new InstanceManager(configuration.projectId, configuration.keyFilePath, configuration.deploymentZone, configuration.deploymentRegion);
    let listVms = await instanceManager.listAllVirtualMachines(machineLabel);
    console.log(listVms.forEach((vm: any) => {console.log(vm.metadata.tags)}));
    listVms.forEach((vm: any) => {
        // eslint-disable-next-line @typescript-eslint/camelcase
        vm.metadata.labels.marked_as = machineLabel + '-stale';
        const labelConfig: any = {
            labelFingerprint: vm.metadata.labelFingerprint,
            labels: vm.metadata.labels
        };
        instanceManager.setLabels(vm.name, labelConfig)
    });
    if(listVms.length === 0) {
        console.log('\x1b[32m%s\x1b[0m', `No instances found. Nothing to delete. :)`);
    }
    console.log('\x1b[32m%s\x1b[0m','Creating Instance....');
    const machineInfo = await instanceManager.createInstance(configuration);
    console.log('\x1b[32m%s\x1b[0m','Machine Successfully Created....with Ip: ', machineInfo.machineIP);
    console.log('\x1b[32m%s\x1b[0m','Checking if server is ready to accept requests');
    await PingService.checkIfReady(`http://${machineInfo.machineIP}${configuration.healthCheckURL}`);
    console.log('\x1b[32m%s\x1b[0m','Setting IP To Domain..... ', machineInfo.machineIP);
    const domainResult = await DomainManager.setDomainIP(configuration.pointDomainToIPRequest, machineInfo.machineIP);
    console.log('Domain Result: ', domainResult);
    console.log('Doing Clean Up.......');
    listVms = await instanceManager.listAllVirtualMachines(machineLabel);
    listVms.filter((vm: any) => {
        return vm.metadata.labels.marked_as === machineLabel + '-stale';
    }).forEach((vm: any) => {
        instanceManager.deleteInstanceByName(vm.name);
    });

}

getConfig(configFilePath).then((data: any) => {
    console.log(data.default);
    const config = data.default;
    startOrchestration(config);

});
