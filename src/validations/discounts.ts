import { z } from "zod";

export const createDiscountSchema = z.object({
  cartId: z.string("cart ID is required"),
  shop: z.string("shop is required"),
});
