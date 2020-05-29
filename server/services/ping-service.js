"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const axios_1 = tslib_1.__importDefault(require("axios"));
class PingService {
    static async checkIfReady(url) {
        const waitDuration = 30000;
        await new Promise((resolve) => {
            setTimeout(() => {
                resolve(true);
            }, waitDuration);
        });
        try {
            await axios_1.default.get(url);
            console.log(`Success:Instance is ready to accept requests`);
            return true;
        }
        catch (e) {
            console.log(`Fail:Trying again in ${waitDuration / 1000} seconds`);
            return PingService.checkIfReady(url);
        }
    }
}
exports.PingService = PingService;
//# sourceMappingURL=ping-service.js.map