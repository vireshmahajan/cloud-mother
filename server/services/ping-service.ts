import axios from 'axios';
export class PingService {
    public static async checkIfReady(url: string): Promise<boolean> {
        const waitDuration = 30000;
        await new Promise((resolve) => {
            setTimeout(() => {
                resolve(true);
            }, waitDuration);
        });
        try {
            await axios.get<string>(url);
            console.log(`Success:Instance is ready to accept requests`);
            return true;
        }catch (e) {
            console.log(`Fail:Trying again in ${waitDuration/1000} seconds`);
            return PingService.checkIfReady(url);
        }
    }
}
