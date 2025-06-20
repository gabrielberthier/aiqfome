/* eslint-disable ts/ban-ts-comment */
import { testClient } from "hono/testing";
import { execSync } from "node:child_process";
import fs from "node:fs";
import { afterAll, beforeAll, describe, expect, expectTypeOf, it } from "vitest";
import { ZodIssueCode } from "zod";

import env from "@/env";
import { ZOD_ERROR_CODES, ZOD_ERROR_MESSAGES } from "@/lib/constants";
import { createTestApp } from "@/lib/create-app";
import * as HttpStatusPhrases from "src/http/status-code";

import router from "./clients.index";

const client = testClient(createTestApp(router));

const isE2e = env.NODE_ENV !== "e2e";

describe.skipIf(isE2e)("clients routes", () => {
  beforeAll(async () => {
    execSync("pnpm drizzle-kit push");
  });

  afterAll(async () => {
    fs.rmSync("test.db", { force: true });
  });

  it("post /clients validates the body when creating", async () => {
    const response = await client.clients.$post({
      json: {
        email: "m",
        name: "",
      },
    });
    expect(response.status).toBe(422);
    if (response.status === 422) {
      const json = await response.json();
      expect(json.error.issues[0].path[0]).toBe("name");
      expect(json.error.issues[0].message).toBe(ZOD_ERROR_MESSAGES.REQUIRED);
    }
  });

  const id = 1;
  const name = "Learn vitest";

  it("post /clients creates a task", async () => {
    const response = await client.clients.$post({
      json: {
        name,
        email: "gabo@mail.com",
      },
    });
    expect(response.status).toBe(200);
    if (response.status === 200) {
      const json = await response.json();
      expect(json.id).toBeInstanceOf(Number);
    }
  });

  it("get /clients lists all clients", async () => {
    const response = await client.clients.$get();
    expect(response.status).toBe(200);
    if (response.status === 200) {
      const json = await response.json();
      expectTypeOf(json).toBeArray();
      expect(json.length).toBe(1);
    }
  });

  it("get /clients/{id} validates the id param", async () => {
    const response = await client.clients[":id"].$get({
      param: {
        id: -1,
      },
    });
    expect(response.status).toBe(422);
    if (response.status === 422) {
      const json = await response.json();
      expect(json.error.issues[0].path[0]).toBe("id");
      expect(json.error.issues[0].message).toBe(ZOD_ERROR_MESSAGES.EXPECTED_NUMBER);
    }
  });

  it("get /clients/{id} returns 404 when task not found", async () => {
    const response = await client.clients[":id"].$get({
      param: {
        id: 999,
      },
    });
    expect(response.status).toBe(404);
    if (response.status === 404) {
      const json = await response.json();
      expect(json.message).toBe(HttpStatusPhrases.NOT_FOUND);
    }
  });

  it("get /clients/{id} gets a single task", async () => {
    const response = await client.clients[":id"].$get({
      param: {
        id,
      },
    });
    expect(response.status).toBe(200);
    if (response.status === 200) {
      const json = await response.json();
      expect(json.name).toBe(name);
    }
  });

  it("patch /clients/{id} validates the body when updating", async () => {
    const response = await client.clients[":id"].$patch({
      param: {
        id,
      },
      json: {
        name: "",
      },
    });
    expect(response.status).toBe(422);
    if (response.status === 422) {
      const json = await response.json();
      expect(json.error.issues[0].path[0]).toBe("name");
      expect(json.error.issues[0].code).toBe(ZodIssueCode.too_small);
    }
  });

  it("patch /clients/{id} validates the id param", async () => {
    const response = await client.clients[":id"].$patch({
      param: {
        // @ts-expect-error
        id: "wat",
      },
      json: {},
    });
    expect(response.status).toBe(422);
    if (response.status === 422) {
      const json = await response.json();
      expect(json.error.issues[0].path[0]).toBe("id");
      expect(json.error.issues[0].message).toBe(ZOD_ERROR_MESSAGES.EXPECTED_NUMBER);
    }
  });

  it("patch /clients/{id} validates empty body", async () => {
    const response = await client.clients[":id"].$patch({
      param: {
        id,
      },
      json: {},
    });
    expect(response.status).toBe(422);
    if (response.status === 422) {
      const json = await response.json();
      expect(json.error.issues[0].code).toBe(ZOD_ERROR_CODES.INVALID_UPDATES);
      expect(json.error.issues[0].message).toBe(ZOD_ERROR_MESSAGES.NO_UPDATES);
    }
  });

  it("patch /clients/{id} updates a single property of a client", async () => {
    const response = await client.clients[":id"].$patch({
      param: {
        id: 1,
      },
      json: {
        name: "Jing Sue Doe",
      },
    });
    expect(response.status).toBe(200);
    if (response.status === 200) {
      const json = await response.json();
      expect(json.name).toBe("Jing Sue Doe");
    }
  });

  it("delete /clients/{id} validates the id when deleting", async () => {
    const response = await client.clients[":id"].$delete({
      param: {
        // @ts-expect-error
        id: "wat",
      },
    });
    expect(response.status).toBe(422);
    if (response.status === 422) {
      const json = await response.json();
      expect(json.error.issues[0].path[0]).toBe("id");
      expect(json.error.issues[0].message).toBe(ZOD_ERROR_MESSAGES.EXPECTED_NUMBER);
    }
  });

  it("delete /clients/{id} removes a task", async () => {
    const response = await client.clients[":id"].$delete({
      param: {
        id,
      },
    });
    expect(response.status).toBe(200);
  });
}, { timeout: 60000 });
