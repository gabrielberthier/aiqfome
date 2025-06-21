CREATE TABLE "product_rating" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer,
	"unit_price" numeric(10, 2) NOT NULL,
	"count" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "product_rating" ADD CONSTRAINT "product_rating_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;