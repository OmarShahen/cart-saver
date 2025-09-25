import { db } from "@/db";
import { events, NewEvent } from "@/db/schema";

export default async function cartCreate(body: any, shop: string) {
  try {
    const eventData: NewEvent = {
      cartId: body.token,
      shop,
      name: "cart_create",
      source: "webhook",
      timestamp: new Date(),
      meta: body,
    };

    await db.insert(events).values(eventData).returning();
  } catch (error) {
    console.error(error);
  }
}
