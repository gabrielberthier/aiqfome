import { describe, expect, it } from "vitest";
import { ZodError } from "zod";

import { priceSchema } from "./price.schema";

describe("price priceSchema test", () => {
    it("sHould validate if number can be parsed as number", () => {
        const numeric = 42.42424242;
        const result = priceSchema.parse(numeric);

        expect(result).toEqual(numeric);
    });

    it("sHould throw and fail for bad input", () => {
        expect(() => {
            priceSchema.parse("string");
        }).toThrow(ZodError);
    });

    it("sHould validate if string can be parsed as number", () => {
        const result = priceSchema.parse("42.55");

        expect(result).toBe(42.55);
    });
});
