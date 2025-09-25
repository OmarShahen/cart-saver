import { NextRequest, NextResponse } from "next/server";
import { generateUniqueCode } from "@/utils/utils";
import { APIError, handleError } from "@/utils/error-handler";
import { addDatesHours, formatDateForTitle } from "@/utils/dates";
import { events, NewEvent } from "@/db/schema";
import { createDiscountSchema } from "@/validations/discounts";
import { db } from "@/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const data = createDiscountSchema.parse(body);

    const discountCode = generateUniqueCode();

    const priceRuleData = {
      price_rule: {
        title: `Cart Saver ${formatDateForTitle(new Date())}`,
        target_type: "line_item",
        target_selection: "all",
        allocation_method: "across",
        value_type: "percentage",
        value: `-10`,
        customer_selection: "all",
        usage_limit: 1,
        once_per_customer: true,
        starts_at: new Date().toISOString(),
        ends_at: addDatesHours(new Date(), 72).toISOString(),
      },
    };

    const priceRuleResponse = await fetch(
      `https://${process.env.SHOPIFY_STORE_DOMAIN}/admin/api/2024-01/price_rules.json`,
      {
        method: "POST",
        headers: {
          "X-Shopify-Access-Token": process.env.SHOPIFY_ADMIN_API_KEY!,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(priceRuleData),
      }
    );

    if (!priceRuleResponse.ok) {
      throw APIError("There was a problem creating price rule", 400);
    }

    const newPriceRule = await priceRuleResponse.json();
    const priceRuleId = newPriceRule.price_rule.id;

    const discountCodeData = { discount_code: { code: discountCode } };
    const discountResponse = await fetch(
      `https://${process.env.SHOPIFY_STORE_DOMAIN}/admin/api/2024-01/price_rules/${priceRuleId}/discount_codes.json`,
      {
        method: "POST",
        headers: {
          "X-Shopify-Access-Token": process.env.SHOPIFY_ADMIN_API_KEY!,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(discountCodeData),
      }
    );

    if (!discountResponse.ok) {
      throw APIError("problem generating discount codes", 400);
    }
    const discountData = await discountResponse.json();

    const eventData: NewEvent = {
      cartId: data.cartId,
      shop: data.shop,
      name: "coupon_create",
      source: "client",
      meta: { priceRule: newPriceRule, discount: discountData },
    };

    const [newEvent] = await db.insert(events).values(eventData).returning();

    return NextResponse.json(
      {
        message: "Discount code created successfully!",
        discountCode,
        discount: discountData,
        priceRule: newPriceRule,
        event: newEvent,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error);
  }
}
