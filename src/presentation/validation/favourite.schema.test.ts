import { describe, expect, it } from "vitest";
import { ZodError } from "zod";

import { favouriteSchema } from "./favourite.schema";

describe("favouriteSchema", () => {
    const validFavourite = {
        productId: 1,
        title: "Product Title",
        image: "https://example.com/image.jpg",
        price: 99.99,
        review: {
            rate: 4.5,
            count: 10,
        },
    };

    it("should validate a correct favourite object", () => {
        const result = favouriteSchema.parse(validFavourite);
        expect(result).toEqual(validFavourite);
    });

    it("should allow missing image field", () => {
        const { image, ...withoutImage } = validFavourite;
        const result = favouriteSchema.parse(withoutImage);
        expect(result.image).toBeUndefined();
    });

    it("should fail if id is not positive", () => {
        expect(() => {
            favouriteSchema.parse({ ...validFavourite, productId: 0 });
        }).toThrow(ZodError);
    });

    it("should fail if title is empty", () => {
        expect(() => {
            favouriteSchema.parse({ ...validFavourite, title: "" });
        }).toThrow(ZodError);
    });

    it("should fail if price is invalid", () => {
        expect(() => {
            favouriteSchema.parse({ ...validFavourite, price: "invalid" });
        }).toThrow(ZodError);
    });

    it("should fail if review.rate is out of range", () => {
        expect(() => {
            favouriteSchema.parse({
                ...validFavourite,
                review: { ...validFavourite.review, rate: 6 },
            });
        }).toThrow(ZodError);

        expect(() => {
            favouriteSchema.parse({
                ...validFavourite,
                review: { ...validFavourite.review, rate: 0 },
            });
        }).toThrow(ZodError);
    });

    it("should fail if review.count is not positive", () => {
        expect(() => {
            favouriteSchema.parse({
                ...validFavourite,
                review: { ...validFavourite.review, count: 0 },
            });
        }).toThrow(ZodError);
    });
});
