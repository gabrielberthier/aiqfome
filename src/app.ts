import { cors } from "hono/cors";

import configureOpenAPI from "@/lib/configure-open-api";
import createApp from "@/lib/create-app";
import clients from "@/presentation/routes/clients/clients.index";
import favourites from "@/presentation/routes/favourites/favourites.index";
import index from "@/presentation/routes/index.route";

import { auth } from "./auth/auth";

const app = createApp();

configureOpenAPI(app);

const routes = [
  index,
  clients,
  favourites,
] as const;

routes.forEach((route) => {
  app.route("/", route);
});

app.use(
  "*", // or replace with "*" to enable cors for all routes
  cors(),
);

app.on(["POST", "GET"], "/api/auth/**", (c) => {
  return auth.handler(c.req.raw);
});

export type AppType = typeof routes[number];

export default app;
