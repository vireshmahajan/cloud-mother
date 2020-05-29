import Compute  from '@google-cloud/compute'


export class AddressManager {
    private _client: any;
    private _zone: any
     constructor(projectId: string, keyFilePath: string, zoneName: string) {
            if (!projectId || !keyFilePath){
                console.error('ProjectId & KeyFileName are mandatory parameters.');
            }
            this._client = new Compute({
                projectId,
                keyFilename: keyFilePath
            });
            this._zone = this._client.zone(zoneName);
            this._init();
        }

}
