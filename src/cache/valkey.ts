import { createClient } from "redis";

export const valkeyClient = await createClient()
    .on("error", err => console.error("Redis Client Error", err))
    .connect();

export type ValkeyClient = typeof valkeyClient;
