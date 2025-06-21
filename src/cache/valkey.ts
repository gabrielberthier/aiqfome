import { createClient } from "redis";

import env from "@/env";

export const valkeyClient = await createClient({
    url: `redis://${env.REDIS_HOST}:${env.REDIS_PORT}`,
})
    .on("error", err => console.error("Redis Client Error", err))
    .connect();

export type ValkeyClient = typeof valkeyClient;
