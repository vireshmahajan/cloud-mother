"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
// @ts-ignore
const vm_js_1 = tslib_1.__importDefault(require("@google-cloud/compute/src/vm.js"));
const delete_access_config_1 = require("./instance-actions/delete-access-config");
const set_labels_1 = require("./instance-actions/set-labels");
vm_js_1.default.prototype.deleteAccessConfig = delete_access_config_1.deleteAccessConfig;
vm_js_1.default.prototype.setLabels = set_labels_1.setLabels;
function notify() {
    console.log('ALL Good');
}
exports.notify = notify;
//# sourceMappingURL=init.js.map