"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const googleapis_1 = require("googleapis");
class AuthorizationService {
    static async getGoogleAPIAuthClient(accountKeyPath) {
        const client = await googleapis_1.google.auth.getClient({
            keyFilename: accountKeyPath,
            scopes: [
                // 'https://www.googleapis.com/auth/cloud-platform',
                'https://www.googleapis.com/auth/compute'
            ]
        });
        // @ts-ignore
        console.log('Client is: ', client.email);
        return client;
    }
}
exports.AuthorizationService = AuthorizationService;
//# sourceMappingURL=authorization-service.js.map