import axios from 'axios';

export class DomainManager {

    public static async setDomainIP(config: any, ip: string): Promise<string> {
        const response = await axios(JSON.parse(JSON.stringify(config).replace('${ip}', ip)));
        return response.data;
    }
}
