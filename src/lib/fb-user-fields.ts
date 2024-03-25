import { FbGraphApiUserFields } from "./types/fb-graph-api-user-fields";

export const fbUserFields: (keyof FbGraphApiUserFields)[] = [
    "id",
    "name",
    "first_name",
    "last_name",
] as const;
