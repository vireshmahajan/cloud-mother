import { AuthorizationService } from "../services/authorization-service";
import { deploymentAccountKeyPath } from "../../keys/key-store";
import { google } from 'googleapis';
const compute = google.compute('v1');

export async function setLabels(labelConfig: any): Promise<void> {
   // @ts-ignore
   const self: any = this as any;
   const authClient = await AuthorizationService.getGoogleAPIAuthClient(deploymentAccountKeyPath);
   const requestOptions: any  = {
       project: self.zone.parent.projectId,
       zone: self.zone.name,
       instance: self.name,
       resource: {
           ...labelConfig
       },
       auth: authClient
   };
   compute.instances.setLabels(requestOptions, (err: any, _response: any)=> {
       if(err) {
           console.error(err);
           return;
       }
       // console.log(JSON.stringify(response, null, 2));
   })
}
