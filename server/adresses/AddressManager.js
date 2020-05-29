"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const compute_1 = tslib_1.__importDefault(require("@google-cloud/compute"));
class AddressManager {
    constructor(projectId, keyFilePath, zoneName) {
        if (!projectId || !keyFilePath) {
            console.error('ProjectId & KeyFileName are mandatory parameters.');
        }
        this._client = new compute_1.default({
            projectId,
            keyFilename: keyFilePath
        });
        this._zone = this._client.zone(zoneName);
        this._init();
    }
}
exports.AddressManager = AddressManager;
//# sourceMappingURL=AddressManager.js.map