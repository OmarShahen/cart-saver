import { db } from "@/db";
import { events, NewEvent } from "@/db/schema";
import { handleError } from "@/utils/error-handler";
import { createEventSchema } from "@/validations/events";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const data = createEventSchema.parse(body);

    const eventData: NewEvent = {
      cartId: data.cartId,
      shop: data.shop,
      name: data.name,
      source: "client",
      meta: data.payload,
    };

    const [newEvent] = await db.insert(events).values(eventData).returning();

    return NextResponse.json({ event: newEvent }, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}
