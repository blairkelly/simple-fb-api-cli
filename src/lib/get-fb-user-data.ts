import * as qs from 'querystring';

import { curl } from "./curl";
import { FbGraphApiUserFields } from "./types/fb-graph-api-user-fields";
import { GetFbUserDataResult } from "./types/get-fb-user-data-result";
import { FbGraphApiUserError } from './types/fb-graph-api-user-error';

// (keyof FbGraphApiUserFields)[]

export async function getFbUserData <
    FIELD extends keyof FbGraphApiUserFields,
    RESULT = GetFbUserDataResult<{
        [key in FIELD]: FbGraphApiUserFields[key];
    }>,
> (
    options: {
        accessToken: string;
        fields: FIELD[];
    },
): Promise<RESULT> {
    const queryString = qs.stringify({
        access_token: options.accessToken,
        fields: options.fields.join(","),
    });

    const uri = `https://graph.facebook.com/v19.0/me?${queryString}`;

    const response = await curl<{error?: FbGraphApiUserError}>(
        uri
    );

    if (
        response.body?.error
    ) {
        throw response.body.error;
    }

    return <RESULT>response;
}
