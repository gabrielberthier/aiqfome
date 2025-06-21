import { createRoute, z } from "@hono/zod-openapi";

import { jsonContent } from "@/http/openapi/helpers";
import { createErrorSchema, IdParamsSchema } from "@/http/openapi/schemas";
import { notFoundSchema } from "@/lib/constants";
import { favouriteSchema } from "@/presentation/validation/favourite.schema";
import * as HttpStatusCodes from "src/http/status-code";

const tags = ["Clients"];
const defaultPath = "/clients/{userId}/favourites";

const UserIdParamsSchema = z.object({
  userId: z.coerce.number().openapi({
    param: {
      name: "userId",
      in: "path",
      required: true,
    },
    required: ["userId"],
    example: 42,
  }),
});

export const list = createRoute({
  path: defaultPath,
  method: "get",
  tags,
  request: {
    params: UserIdParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(favouriteSchema),
      "The list of the clients favourites",
    ),
  },
});

export const create = createRoute({
  path: defaultPath,
  method: "post",
  request: {
    params: UserIdParamsSchema,
    body: {
      content: {
        "application/json": {
          schema: favouriteSchema,
        },
      },
      required: true,
    },
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: {
      description: "Created successfuly",
      content: {
        "application/json": {
          schema: z.object({
            message: z.string()
          }),
        },
      },
    },
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(favouriteSchema),
      "The validation error(s)",
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      z.object({
        error: z.string(),
      }),
      "The client already exists",
    ),
  },
});

export const getOne = createRoute({
  path: `${defaultPath}/{id}`,
  method: "get",
  request: {
    params: z.object({
      ...UserIdParamsSchema.shape,
      ...IdParamsSchema.shape,
    }),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      favouriteSchema,
      "The requested client",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Favourite not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "Invalid id error",
    ),
  },
});

export const remove = createRoute({
  path: `${defaultPath}/{id}`,
  method: "delete",
  request: {
    params: z.object({
      ...UserIdParamsSchema.shape,
      ...IdParamsSchema.shape,
    }),
  },
  tags,
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: "Favourite deleted",
    },
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "Invalid id error",
    ),
  },
});

export type ListRoute = typeof list;
export type CreateRoute = typeof create;
export type GetOneRoute = typeof getOne;
export type RemoveRoute = typeof remove;
