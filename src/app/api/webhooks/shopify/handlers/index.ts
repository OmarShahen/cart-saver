import checkoutCreate from "./checkouts/checkoutsCreate";
import checkoutUpdate from "./checkouts/checkoutsUpdate";
import orderCreate from "./orders/ordersCreate";
import cartCreate from "./carts/cartsCreate";
import cartUpdate from "./carts/cartsUpdate";

type WebhookHandler = (body: any, shop: string) => Promise<void>;

export const handlers: Record<string, WebhookHandler> = {
  "checkouts/create": checkoutCreate,
  "checkouts/update": checkoutUpdate,
  "orders/create": orderCreate,
  "carts/create": cartCreate,
  "carts/update": cartUpdate,
};
