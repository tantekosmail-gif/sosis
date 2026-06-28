import { transformYoutube } from "./youtube.transformer";
import { transformTikTok } from "./tiktok.transformer";
import { transformInstagram } from "./instagram.transformer";
import { transformFacebook } from "./facebook.transformer";

export function transformDashboard(platform:string,response:any){

    switch(platform){

        case "youtube":

            return transformYoutube(response);

        case "tiktok":

            return transformTikTok(response);

        case "instagram":

            return transformInstagram(response);

        case "facebook":

            return transformFacebook(response);

        default:

            throw new Error("Platform belum didukung");

    }

}