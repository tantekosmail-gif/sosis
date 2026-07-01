import { transformYoutube } from "./youtube.transformer";
import { transformTikTok } from "./tiktok.transformer";
import { transformInstagram } from "./instagram.transformer";
import { transformFacebook } from "./facebook.transformer";

export function transformDashboard(platform: string, response: any, keyword = "") {
  switch (platform) {
    case "youtube":   return transformYoutube(response, keyword);
    case "tiktok":    return transformTikTok(response, keyword);
    case "instagram": return transformInstagram(response, keyword);
    case "facebook":  return transformFacebook(response, keyword);
    default:          throw new Error("Platform belum didukung");
  }
}