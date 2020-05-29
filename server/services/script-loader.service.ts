import axios from 'axios';
import {lstatSync, readFileSync} from "fs";

export class ScriptLoaderService {
    public static async loadScript(path: string): Promise<any> {
       try{
           new URL(path);
           const response = await axios.get(path, {
               headers: {
                   'content-type': 'text/html'
               }
           });
           return response.data
       }catch(e) {
           if (lstatSync(path).isFile()) {
             const script = readFileSync(path);
             return script.toString()
           }else {
               throw new Error(`${path} not found`)
           }
       }
    }
}
