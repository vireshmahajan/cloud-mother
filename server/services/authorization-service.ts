import { google} from "googleapis";

export class AuthorizationService {
    public static async getGoogleAPIAuthClient(accountKeyPath: string): Promise<any> {
            const client = await google.auth.getClient({
                keyFilename: accountKeyPath,
                scopes: [
                    // 'https://www.googleapis.com/auth/cloud-platform',
                       'https://www.googleapis.com/auth/compute'
                ]
            });
            // @ts-ignore
           console.log('Client is: ', client.email);
            return client
    }
}
