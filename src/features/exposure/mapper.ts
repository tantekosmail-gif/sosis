export function mapExposure(raw:any){

    return {

    total: raw.total ?? 0,
    engagement: raw.engagement ?? 0,
    reach: raw.reach ?? 0,

    positive: raw.positive ?? 0,
    neutral: raw.neutral ?? 0,
    negative: raw.negative ?? 0,

    };

}