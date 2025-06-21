import { createClient } from "redis";

import env from "@/env";

const url = env.REDIS_URL ? env.REDIS_URL : `redis://${env.REDIS_HOST}:${env.REDIS_PORT}`

export const valkeyClient = await createClient({
    url,
})
    .on("error", err => console.error("Redis Client Error", err))
    .connect();

export type ValkeyClient = typeof valkeyClient;
