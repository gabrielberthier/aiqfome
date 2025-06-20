import { eq } from "drizzle-orm";

import type { AppRouteHandler } from "@/lib/types";

import { db } from "@/db/pg/db";
import { client } from "@/db/pg/db/schema";
import { ZOD_ERROR_CODES } from "@/lib/constants";
import * as StatusCode from "src/http/status-code";

import type { CreateRoute, GetOneRoute, ListRoute, PatchRoute, RemoveRoute } from "./clients.routes";

export const list: AppRouteHandler<ListRoute> = async (c) => {
  const tasks = await db.query.user.findMany();
  return c.json(tasks);
};

export const create: AppRouteHandler<CreateRoute> = async (c) => {
  const task = c.req.valid("json");
  const [inserted] = await db.insert(client).values({
    email: task.email,
    name: task.name,
  }).returning();
  return c.json(inserted, StatusCode.OK);
};

export const getOne: AppRouteHandler<GetOneRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const client = await db.query.client.findFirst({
    where(fields, operators) {
      return operators.eq(fields.id, id);
    },
  });

  console.log(client);

  if (!client) {
    return c.json(
      {
        message: "NotFound",
      },
      StatusCode.NOT_FOUND,
    );
  }

  return c.json(client, StatusCode.OK);
};

export const patch: AppRouteHandler<PatchRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const updates = c.req.valid("json");

  if (!updates || Object.keys(updates).length === 0) {
    return c.json(
      {
        success: false,
        error: {
          issues: [
            {
              code: ZOD_ERROR_CODES.INVALID_UPDATES,
              path: [],
              message: "No Updates",
            },
          ],
          name: "ZodError",
        },
      },
      StatusCode.UNPROCESSABLE_ENTITY,
    );
  }

  const [task] = await db.update(client)
    .set(updates)
    .where(eq(client.id, id))
    .returning();

  if (!task) {
    return c.json(
      {
        message: "NotFound",
      },
      StatusCode.NOT_FOUND,
    );
  }

  return c.json(task, StatusCode.OK);
};

export const remove: AppRouteHandler<RemoveRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const result = await db.delete(client)
    .where(eq(client.id, id));

  if (result.rowCount === 0) {
    return c.json(
      {
        message: StatusCode.NOT_FOUND,
      },
      StatusCode.NOT_FOUND,
    );
  }

  return c.body(null, StatusCode.NO_CONTENT);
};
