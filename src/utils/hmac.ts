import crypto from "crypto";

export function isShopifyWebhookValid(hmacHeader: string, rawBody: string) {
  const generatedHmac = crypto
    .createHmac("sha256", process.env.SHOPIFY_WEBHOOK_SECRET!)
    .update(rawBody, "utf-8")
    .digest("base64");

  const hmacBuffer = Buffer.from(hmacHeader, "base64");
  const generatedBuffer = Buffer.from(generatedHmac, "base64");

  const valid =
    hmacBuffer.length === generatedBuffer.length &&
    crypto.timingSafeEqual(generatedBuffer, hmacBuffer);

  return valid;
}
