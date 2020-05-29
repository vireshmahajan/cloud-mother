// @ts-ignore
import VM from '@google-cloud/compute/src/vm.js';
import { deleteAccessConfig } from "./instance-actions/delete-access-config";
import {setLabels} from "./instance-actions/set-labels";
VM.prototype.deleteAccessConfig = deleteAccessConfig;
VM.prototype.setLabels = setLabels;

function notify(): void {
    console.log('ALL Good');
}

export { notify };
