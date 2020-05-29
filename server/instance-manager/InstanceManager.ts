import Compute  from '@google-cloud/compute';
import { notify } from "../init";
import {ScriptLoaderService} from "../services/script-loader.service";
notify();

export class InstanceManager {
    private _computeClient: any;
    private _zone: any;
    private _region: any;
     constructor(projectId: string, keyFilePath: string, zoneName: string, region: string) {
         if (!projectId || !keyFilePath){
             console.error('ProjectId & KeyFileName are mandatory parameters.');
         }
         this._computeClient = new Compute({
             projectId,
             keyFilename: keyFilePath
         });
         this._zone = this._computeClient.zone(zoneName);
         this._region = this._computeClient.region(region);
     }

    public async createInstance(configuration: any): Promise<any>{
           const virtualMachineLabel = configuration.instanceLabel.toLowerCase();
           const virtualMachineName = virtualMachineLabel + '-' + new Date().getTime();
           let startupScript = await ScriptLoaderService.loadScript(configuration.startupScriptPath);
           startupScript = startupScript.replace(/\r\n/g, '\n')
           const machineConfiguration: any = {
               os: configuration.os,
               machineType: configuration.machineType,
               http: configuration.externalIP,
               "networkInterfaces": configuration.networkInterfaces,
               tags: [virtualMachineLabel.toLowerCase()].concat(configuration.tags),
               labels: Object.assign({
                   // eslint-disable-next-line @typescript-eslint/camelcase
                   belongs_to: virtualMachineLabel
               }, configuration.labels),
           }
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
    public async deleteInstanceByName(instanceName: string): Promise<void> {
          const vm = this._zone.vm(instanceName);
          const [operation] = await vm.delete();
          await operation.promise();
          console.log(`Instance ${instanceName} successfully deleted`);
     }

     public getVM(VMName: string): any | null {
         try {
             return this._zone.vm(VMName);
         }catch (e) {
             console.error(`${VMName} was not found. Please check name.`);
             return null;
         }
     }

     public async updateMetaData(VMName: string, metaData: any): Promise<void> {
         const VM = this._zone.vm(VMName);
         // @ts-ignore
         // eslint-disable-next-line @typescript-eslint/no-unused-vars
         const [operation, _apiResponse ] = await VM.setMetadata(metaData);
         await operation.promise();
     }

    public async deleteAccessConfig(virtualMachineName: string): Promise<void> {
        const virtualMachine = this.getVM(virtualMachineName);
        // const [metadata] = await virtualMachine.getMetadata();
        // const ip = metadata.networkInterfaces[0].accessConfigs[0].natIP;
        // const fingerprint = metadata.metadata.fingerprint;
        await virtualMachine.deleteAccessConfig();
        console.log(`${virtualMachineName} was deleted successfully.`);
    }

    public async getAddress(addressName: string): Promise<void> {
        const address = this._region.address(addressName);
        // @ts-ignore
        const [addressInfo, apiResponse] = await address.get();
        console.log(addressInfo);
        return addressInfo;
    }

    public async listAllVirtualMachines(filterValue?: string): Promise<any> {
         // @ts-ignore
        const [vms, apiResponse] = await this._zone.getVMs({
            filter: filterValue ? 'labels.belongs_to eq ' + filterValue : 'labels.belongs_to eq .*'
        });
         return vms;
    }

    public async setLabels(virtualMachineName: string, labelConfig: any): Promise<void> {
         const virtualMachine = this.getVM(virtualMachineName);

         await virtualMachine.setLabels(labelConfig);
         console.log(`Labels were successfully updated for these things...`);
    }
}
