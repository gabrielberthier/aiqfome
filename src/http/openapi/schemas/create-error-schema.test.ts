import { z } from "@hono/zod-openapi";
import { describe, expect, expectTypeOf, it } from "vitest";
import { ZodObject } from "zod";

import createErrorSchema from "./create-error-schema";

describe("createErrorSchema", () => {
  it("should return a zod object schema with success and error fields", () => {
    const schema = z.object({
      name: z.string(),
    });
    const errorSchema = createErrorSchema(schema);

    expect(errorSchema.shape).toHaveProperty("success");
    expect(errorSchema.shape).toHaveProperty("error");
    expectTypeOf(errorSchema.shape.success).toEqualTypeOf(z.boolean());
    expect(errorSchema.shape.error).toBeInstanceOf(ZodObject);
  });

  it("should validate an error object with issues array", () => {
    const schema = z.object({
      name: z.string(),
    });
    const errorSchema = createErrorSchema(schema);

    const errorObj = {
      success: false,
      error: {
        issues: [
          {
            code: "too_small",
            path: ["name"],
            message: "Required",
          },
        ],
        name: "ZodError",
      },
    };

    const result = errorSchema.safeParse(errorObj);
    expect(result.success).toBe(true);
    expect(result.data?.success).toBe(false);
    expect(Array.isArray(result.data?.error.issues)).toBe(true);
    expect(result.data?.error.issues[0].code).toBe("too_small");
    expect(result.data?.error.issues[0].path).toEqual(["name"]);
    expect(result.data?.error.name).toBe("ZodError");
  });

  it("should fail validation if required fields are missing", () => {
    const schema = z.object({
      name: z.string(),
    });
    const errorSchema = createErrorSchema(schema);

    const invalidObj = {
      error: {
        issues: [],
        name: "ZodError",
      },
    };

    const result = errorSchema.safeParse(invalidObj);
    expect(result.success).toBe(false);
    expect(result.error?.issues.some(issue => issue.path[0] === "success")).toBe(true);
  });

  it("should provide an openapi example for the error field", () => {
    const schema = z.object({
      age: z.number(),
    });
    const errorSchema = createErrorSchema(schema);

    const openapiMeta = errorSchema.shape.error._def.openapi;
    expect(openapiMeta).toBeDefined();
  });

  it("should handle array schemas", () => {
    const schema = z.array(z.string());
    const errorSchema = createErrorSchema(schema);

    const errorObj = {
      success: false,
      error: {
        issues: [
          {
            code: "invalid_type",
            path: [0],
            message: "Expected string",
          },
        ],
        name: "ZodError",
      },
    };

    const result = errorSchema.safeParse(errorObj);
    expect(result.success).toBe(true);
    expect(result.data?.error.issues[0].path).toEqual([0]);
  });
});
