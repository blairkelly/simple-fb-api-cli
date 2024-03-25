import { FbGraphApiHeaderJsonXAppUsage } from "./fb-graph-api-header-json-x-app-usage";
import { FbGraphApiResponseHeaders } from "./fb-graph-api-response-headers";

export type FbGraphApiCurlResult <
    BODY = unknown
> = {
    appUsage: FbGraphApiHeaderJsonXAppUsage;
    body: BODY;
    headers: FbGraphApiResponseHeaders;
    statusCode: number;
};
