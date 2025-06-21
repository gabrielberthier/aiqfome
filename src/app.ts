import { cors } from "hono/cors";

import configureOpenAPI from "@/lib/configure-open-api";
import createApp, { allowedOrigins } from "@/lib/create-app";
import clients from "@/presentation/routes/clients/clients.index";
import index from "@/presentation/routes/index.route";

import { auth } from "./auth/auth";

const app = createApp();

configureOpenAPI(app);

const routes = [
  index,
  clients,
] as const;

routes.forEach((route) => {
  app.route("/", route);
});

app.use(
  "/api/auth/**", // or replace with "*" to enable cors for all routes
  cors({
    origin: (origin, _) => {
      if (allowedOrigins.includes(origin)) {
        return origin;
      }
      return undefined;
    },
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  }),
);

app.on(["POST", "GET"], "/api/auth/**", (c) => {
  return auth.handler(c.req.raw);
});

export type AppType = typeof routes[number];

export default app;
