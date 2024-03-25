import * as fs from 'fs';
import { setTimeout } from 'timers/promises';
import { Command } from 'commander';
import { getFbUserData } from './lib/get-fb-user-data';
import { FbGraphApiUserError } from 'lib/types/fb-graph-api-user-error';
import { FbGraphApiUserFields } from 'lib/types/fb-graph-api-user-fields';
import { fbUserFields } from './lib/fb-user-fields';

const program = new Command();

program.name(
    "simple-fb-api-cli"
).description(
    "A simple CLI for retrieving user data from the FB Graph API using cURL."
).version(
    "0.0.0"
);

program.option(
    "--access-token-file <path>",
    "Path to a file containing a valid access token, i.e.: ./access-token.txt",
);

program.option(
    "--access-token <value>",
    "A valid access token"
);

program.option(
    "--fields <value>",
    "A comma-separated list of fields to retreive",
    "id,name,last_name"
);

program.option(
    "--poll-interval <value>",
    "An duration (in ms) to wait between requests for data.",
    "2000"
);

async function poll (
    options: {
        accessToken: string;
        fields: (keyof FbGraphApiUserFields)[];
        targetPollInterval: number;
    },
): Promise<void> {
    try {
        const result = await getFbUserData({
            accessToken: options.accessToken,
            fields: options.fields,
        });

        const dataString = Object.keys(result.body).map((k) => {
            return `${k} = ${result.body[<keyof FbGraphApiUserFields>k]}`;
        }).join(", ");

        console.log(" ");
        console.log(`Got data: ${dataString}`);

        const callCount = result.appUsage.call_count;

        let pollInterval = options.targetPollInterval;
        if (
            callCount
        ) {
            const callsLeftThisHour = 200 - Math.floor(
                200 * (callCount / 100)
            );

            pollInterval = Math.ceil(
                ((1000 * 60 * 60) / callsLeftThisHour) * 1.05
            );
        }

        console.log(`Waiting  ${String(pollInterval)} ms, call_count = ${String(result.appUsage.call_count)}`);
        await setTimeout(pollInterval);

        return await poll(
            options
        );
    }
    catch (err: unknown) {
        if (
            (<FbGraphApiUserError>err)?.code
            &&
            (<FbGraphApiUserError>err)?.message
            &&
            (<FbGraphApiUserError>err)?.type
        ) {
            if (
                (<FbGraphApiUserError>err).code === 4
            ) {
                console.warn(`Application request limit reached. Waiting 5 minutes to try again ...`);
                await setTimeout(
                    (1000 * 60 * 5)
                );
                return await poll(
                    options
                );
            }

            console.error(`${(<FbGraphApiUserError>err).type}: ${(<FbGraphApiUserError>err).message}`);
            process.exit((<FbGraphApiUserError>err).code);
        }

        throw err;
    }
}

async function go (): Promise<void> {
    await program.parseAsync();

    const options = program.opts();

    let accessToken: string = "";

    if (
        (<string>options.accessTokenFile)?.length
    ) {
        accessToken = (
            fs.readFileSync(
                <string>(options.accessTokenFile),
                "utf-8"
            ) || ""
        ).trim();
    }
    else if (
        (<string>options.accessToken)?.length
    ) {
        accessToken = (<string>(options.accessToken)).trim();
    }

    if (
        !accessToken
    ) {
        console.error("Error: No access token provided.");
        process.exit(1);
    }

    const fields = (<string>options.fields).split(",").map((item) => {
        item = item.trim().toLowerCase();

        if (
            !fbUserFields.includes(<keyof FbGraphApiUserFields>item)
        ) {
            console.error(`Error: "${item}" is not a known field.`);
            process.exit(2);
        }

        return <keyof FbGraphApiUserFields>item;
    });

    await poll({
        accessToken: accessToken,
        fields: fields,
        targetPollInterval: parseInt(<string>(options.pollInterval), 10)
    });
}

go().catch(
    console.error
);

