import { z } from "zod";

export const createEventSchema = z.object({
  cartId: z.string("cart ID is required"),
  shop: z.string("shop is required"),
  name: z.string("event name is required"),
  payload: z.any().optional(),
});
