import { spawn } from 'child_process';
import { FbGraphApiCurlResult } from './types/fb-graph-api-curl-result';
import { FbGraphApiResponseHeaders } from './types/fb-graph-api-response-headers';
import { FbGraphApiHeaderJsonXAppUsage } from './types/fb-graph-api-header-json-x-app-usage';

export async function curl <
    RESPONSE_BODY = unknown
> (
    uri: string
): Promise<FbGraphApiCurlResult<RESPONSE_BODY>> {
    let curlOutputString: string = "";

    return await new Promise<FbGraphApiCurlResult<RESPONSE_BODY>>((resolve, reject) => {
        const task = spawn(
            "curl",
            [
                "-X", "GET",
                "-H", "Accept: application/json",
                "-w", "Headers_JSON:%{header_json}Response_Code:%{response_code}",
                uri
            ],
        );

        task.on("error", (err) => {
            console.log("err!", err);
            reject(err);
        });

        task.on("exit", (code) => {
            if (
                code === 0
            ) {
                const responseBody = <RESPONSE_BODY>(
                    JSON.parse(
                        curlOutputString.split("Headers_JSON:")[0]
                    )
                );

                const responseHeadersRaw = <Record<string, string[]>>(
                    JSON.parse(
                        (curlOutputString.split("Headers_JSON:")[1]).split("Response_Code:")[0]
                    )
                );
                const responseHeaders: FbGraphApiResponseHeaders = {};
                Object.keys(responseHeadersRaw).forEach((h) => {
                    responseHeaders[<keyof FbGraphApiResponseHeaders>h] = responseHeadersRaw[h][0];
                });

                const statusCode = (curlOutputString.split("Headers_JSON:")[1]).split("Response_Code:")[1];

                resolve({
                    appUsage: <FbGraphApiHeaderJsonXAppUsage>(JSON.parse(responseHeaders['x-app-usage'] || '')),
                    body: responseBody,
                    headers: responseHeaders,
                    statusCode: parseInt(statusCode, 10),
                });

                return;
            }
            reject(`curl exited with code ${String(code)}`);
        });

        task.stdout.on('data', (data) => {
            curlOutputString = `${curlOutputString}${String(data)}`;
        });
    });
}
