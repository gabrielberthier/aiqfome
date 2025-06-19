import { createRoute } from "@hono/zod-openapi";

import { createMessageObjectSchema } from "@/http/openapi/schemas";
import { createRouter } from "@/lib/create-app";
import { jsonContent } from "src/http/openapi/helpers";
import * as HttpStatusCodes from "src/http/status-code";

const router = createRouter()
  .openapi(
    createRoute({
      tags: ["Index"],
      method: "get",
      path: "/",
      responses: {
        [HttpStatusCodes.OK]: jsonContent(
          createMessageObjectSchema("Tasks API"),
          "Tasks API Index",
        ),
      },
    }),
    (c) => {
      return c.json({
        message: "Tasks API",
      }, HttpStatusCodes.OK);
    },
  );

export default router;
