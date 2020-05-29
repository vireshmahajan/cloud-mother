"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const axios_1 = tslib_1.__importDefault(require("axios"));
const fs_1 = require("fs");
class ScriptLoaderService {
    static async loadScript(path) {
        try {
            new URL(path);
            const response = await axios_1.default.get(path, {
                headers: {
                    'content-type': 'text/html'
                }
            });
            return response.data;
        }
        catch (e) {
            if (fs_1.lstatSync(path).isFile()) {
                const script = fs_1.readFileSync(path);
                return script.toString();
            }
            else {
                throw new Error(`${path} not found`);
            }
        }
    }
}
exports.ScriptLoaderService = ScriptLoaderService;
//# sourceMappingURL=script-loader.service.js.map