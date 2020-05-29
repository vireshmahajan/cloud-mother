"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const googleapis_1 = require("googleapis");
const authorization_service_1 = require("../services/authorization-service");
const key_store_1 = require("../../keys/key-store");
const compute = googleapis_1.google.compute('v1');
async function deleteAccessConfig() {
    // @ts-ignore
    const self = this;
    console.log(self);
    const authClient = await authorization_service_1.AuthorizationService.getGoogleAPIAuthClient(key_store_1.deploymentAccountKeyPath);
    const request = {
        // Project ID for this request.
        project: self.zone.parent.projectId,
        // The name of the zone for this request.
        zone: self.zone.name,
        // The instance name for this request.
        instance: self.name,
        // The name of the access config to delete.
        accessConfig: self.metadata.networkInterfaces[0].accessConfigs[0].name,
        // The name of the network interface.
        networkInterface: 'nic0',
        auth: authClient,
    };
    compute.instances.deleteAccessConfig(request, function (err, response) {
        if (err) {
            console.error(err);
            return;
        }
        // TODO: Change code below to process the `response` object:
        console.log(JSON.stringify(response, null, 2));
    });
}
exports.deleteAccessConfig = deleteAccessConfig;
//# sourceMappingURL=delete-access-config.js.map