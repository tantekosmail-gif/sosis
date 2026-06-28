import { exposureApi } from "../api/exposure.api";

import { buildExposurePayload } from "../builders/exposure.builder";

export async function executeExposure() {
  const payload = buildExposurePayload();

  const { data } = await exposureApi.post(
    "/api/v1/analyze/executeQueryByAnalyzeId",
    payload
  );

  return data;
}