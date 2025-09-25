import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { cartToken } = body;

    if (!cartToken) {
      return NextResponse.json({ error: "Missing cartToken" }, { status: 400 });
    }

    const cartId = `gid://shopify/Cart/${cartToken}`;

    const query = `
      query getCart($id: ID!) {
        cart(id: $id) {
          id
          createdAt
          updatedAt
          checkoutUrl
          totalQuantity
          cost {
            subtotalAmount { amount currencyCode }
            totalAmount { amount currencyCode }
          }
          lines(first: 10) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    product { title }
                  }
                }
              }
            }
          }
        }
      }
    `;

    const response = await fetch(
      `https://${process.env.SHOPIFY_STORE_DOMAIN}/api/2025-01/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Storefront-Access-Token":
            process.env.SHOPIFY_ADMIN_API_KEY!,
        },
        body: JSON.stringify({ query, variables: { id: cartId } }),
      }
    );

    const data = await response.json();

    // 🔥 Console log Shopify response
    console.log("Shopify cart response:", JSON.stringify(data, null, 2));

    if (!data.data?.cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    return NextResponse.json({ cart: data.data.cart });
  } catch (err: any) {
    console.error("Error fetching cart:", err);
    return NextResponse.json(
      { error: "Server error", details: err.message },
      { status: 500 }
    );
  }
}
