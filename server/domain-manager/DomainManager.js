"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const axios_1 = tslib_1.__importDefault(require("axios"));
class DomainManager {
    static async setDomainIP(config, ip) {
        const response = await axios_1.default(JSON.parse(JSON.stringify(config).replace('${ip}', ip)));
        return response.data;
    }
}
exports.DomainManager = DomainManager;
//# sourceMappingURL=DomainManager.js.map