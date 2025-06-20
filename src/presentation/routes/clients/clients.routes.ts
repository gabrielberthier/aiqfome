import { createRoute, z } from "@hono/zod-openapi";

import { jsonContent, jsonContentRequired } from "@/http/openapi/helpers";
import { createErrorSchema, IdParamsSchema } from "@/http/openapi/schemas";
import { notFoundSchema } from "@/lib/constants";
import { clientSchema, patchClientSchema } from "@/presentation/validation/client.schema";
import * as HttpStatusCodes from "src/http/status-code";

const tags = ["Clients"];
const defaultPath = "/clients";

export const list = createRoute({
  path: defaultPath,
  method: "get",
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(clientSchema),
      "The list of clients",
    ),
  },
});

export const create = createRoute({
  path: defaultPath,
  method: "post",
  request: {
    body: {
      content: {
        "application/json": {
          schema: clientSchema,
        },
      },
      required: true,
    },
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({
        id: z.number(),
      }),
      "The created client",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(clientSchema),
      "The validation error(s)",
    ),
  },
});

export const getOne = createRoute({
  path: `${defaultPath}/{id}`,
  method: "get",
  request: {
    params: IdParamsSchema,
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      clientSchema,
      "The requested client",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Client not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "Invalid id error",
    ),
  },
});

export const patch = createRoute({
  path: `${defaultPath}/{id}`,
  method: "patch",
  request: {
    params: IdParamsSchema,
    body: jsonContentRequired(
      patchClientSchema,
      "The client updates",
    ),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      clientSchema,
      "The updated client",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Client not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(patchClientSchema)
        .or(createErrorSchema(IdParamsSchema)),
      "The validation error(s)",
    ),
  },
});

export const remove = createRoute({
  path: `${defaultPath}/{id}`,
  method: "delete",
  request: {
    params: IdParamsSchema,
  },
  tags,
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: "Client deleted",
    },
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Client not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "Invalid id error",
    ),
  },
});

export type ListRoute = typeof list;
export type CreateRoute = typeof create;
export type GetOneRoute = typeof getOne;
export type PatchRoute = typeof patch;
export type RemoveRoute = typeof remove;
