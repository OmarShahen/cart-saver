import { db } from "@/db";
import { events, NewEvent } from "@/db/schema";

export default async function orderCreate(body: any, shop: string) {
  try {
    const eventData: NewEvent = {
      cartId: body.cart_token,
      shop,
      name: "order_create",
      source: "webhook",
      timestamp: new Date(),
      meta: body,
    };

    await db.insert(events).values(eventData).returning();
  } catch (error) {
    console.error(error);
  }
}
