ALTER TABLE "favourites" RENAME COLUMN "productId" TO "product_id";--> statement-breakpoint
ALTER TABLE "favourites" RENAME COLUMN "clientId" TO "client_id";--> statement-breakpoint
ALTER TABLE "favourites" DROP CONSTRAINT "favourites_productId_products_id_fk";
--> statement-breakpoint
ALTER TABLE "favourites" DROP CONSTRAINT "favourites_clientId_clients_id_fk";
--> statement-breakpoint
ALTER TABLE "favourites" ADD CONSTRAINT "favourites_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "favourites" ADD CONSTRAINT "favourites_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;