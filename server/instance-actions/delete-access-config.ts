import {google} from 'googleapis';
import {AuthorizationService} from "../services/authorization-service";
import {deploymentAccountKeyPath} from "../../keys/key-store";
const compute = google.compute('v1');

export async function deleteAccessConfig(): Promise<void> {
    // @ts-ignore
    const self = this as any;
    console.log(self);
    const authClient = await AuthorizationService.getGoogleAPIAuthClient(deploymentAccountKeyPath);
    const request = {
        // Project ID for this request.
        project: self.zone.parent.projectId,  // TODO: Update placeholder value.

        // The name of the zone for this request.
        zone: self.zone.name,  // TODO: Update placeholder value.

        // The instance name for this request.
        instance: self.name,  // TODO: Update placeholder value.

        // The name of the access config to delete.
        accessConfig: self.metadata.networkInterfaces[0].accessConfigs[0].name,  // TODO: Update placeholder value.

        // The name of the network interface.
        networkInterface: 'nic0',  // TODO: Update placeholder value.

        auth: authClient,
    };

    compute.instances.deleteAccessConfig(request, function(err: any, response: any) {
        if (err) {
            console.error(err);
            return;
        }

        // TODO: Change code below to process the `response` object:
        console.log(JSON.stringify(response, null, 2));
    });
}


