import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { openAPI } from "better-auth/plugins";

import { db } from "@/db/pg/db";
import {
    account,
    session,
    user,
    verification,
} from "@/db/pg/db/schema";
import env from "@/env";

export const auth = betterAuth({
    baseURL: env.BETTER_AUTH_URL || "http://localhost:8000",
    secret: env.BETTER_AUTH_SECRET || undefined,
    emailAndPassword: {
        enabled: true,
        autoSignIn: true,
        minPasswordLength: 8,
    },
    plugins: [openAPI()],
    trustedOrigins: [
        env.BETTER_AUTH_URL || "http://localhost:8000",
        ...(env.ALLOWED_ORIGINS?.split(",") || []),
    ],
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: {
            user,
            session,
            account,
            verification,
        },
    }),
});
