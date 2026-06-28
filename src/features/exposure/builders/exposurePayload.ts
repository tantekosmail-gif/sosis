export function buildExposurePayload() {
  return {
    analyze_id: "8c0719bbfd327ebc3380a7b013b215ba",

    criteria_id: "b22bc8ad532305803f7188a73ea15eef",

    platform: "global",

    interval: "1d",

    type: "",

    filter: JSON.stringify({
      query: {
        bool: {
          must: [],
        },
      },
    }),
  };
}
