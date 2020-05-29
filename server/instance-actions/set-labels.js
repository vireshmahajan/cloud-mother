"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authorization_service_1 = require("../services/authorization-service");
const key_store_1 = require("../../keys/key-store");
const googleapis_1 = require("googleapis");
const compute = googleapis_1.google.compute('v1');
async function setLabels(labelConfig) {
    // @ts-ignore
    const self = this;
    const authClient = await authorization_service_1.AuthorizationService.getGoogleAPIAuthClient(key_store_1.deploymentAccountKeyPath);
    const requestOptions = {
        project: self.zone.parent.projectId,
        zone: self.zone.name,
        instance: self.name,
        resource: {
            ...labelConfig
        },
        auth: authClient
    };
    compute.instances.setLabels(requestOptions, (err, _response) => {
        if (err) {
            console.error(err);
            return;
        }
        // console.log(JSON.stringify(response, null, 2));
    });
}
exports.setLabels = setLabels;
//# sourceMappingURL=set-labels.js.map