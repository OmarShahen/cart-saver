import { NextRequest, NextResponse } from "next/server";
import { isShopifyWebhookValid } from "@/utils/hmac";
import { handlers } from "./handlers";

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const data = JSON.parse(rawBody);

    const shop = request.headers.get("x-shopify-shop-domain")!;
    const topic = request.headers.get("x-shopify-topic")!;
    const hmacHeader = request.headers.get("x-shopify-hmac-sha256") || "";

    const isValid = isShopifyWebhookValid(hmacHeader, rawBody);

    if (!isValid) {
      console.warn("Webhook HMAC validation failed");
      return NextResponse.json({ message: "unauthorized" }, { status: 401 });
    }

    const handler = handlers[topic];
    if (handler) {
      queueMicrotask(() => handler(data, shop));
    } else {
      console.warn(`No handler for topic: ${topic}`);
    }

    return NextResponse.json(null, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(null, { status: 200 });
  }
}
