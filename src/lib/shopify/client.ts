import { getShopifyConfig } from "./config";
import {
  AddCartLinesMutation,
  CreateCartMutation,
  GetCartQuery,
  ProductByHandleQuery,
  ProductsQuery,
  RemoveCartLinesMutation,
} from "./queries";
import {
  CartSchema,
  ProductSchema,
  ProductsSchema,
  type Cart,
  type Product,
} from "./types";

interface ShopifyRequestOptions {
  buyerIP?: string;
}

async function shopifyFetch<T>(
  query: string,
  variables: Record<string, unknown> = {},
  options: ShopifyRequestOptions = {},
): Promise<T | null> {
  const config = getShopifyConfig();
  if (!config) return null;

  const apiUrl = `https://${config.shopifyShop}/api/${config.apiVersion}/graphql.json`;
  const isSSR = import.meta.env.SSR;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (isSSR && config.privateShopifyAccessToken) {
    headers["Shopify-Storefront-Private-Token"] =
      config.privateShopifyAccessToken;
    headers["Shopify-Storefront-Buyer-IP"] = options.buyerIP ?? "127.0.0.1";
  } else {
    headers["X-Shopify-Storefront-Access-Token"] =
      config.publicShopifyAccessToken;
  }

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers,
      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
      console.warn(`Shopify request failed: ${response.status}`);
      return null;
    }

    const json = await response.json();
    if (json.errors?.length) {
      console.warn(
        "Shopify GraphQL errors:",
        json.errors.map((error: { message: string }) => error.message).join(", "),
      );
      return null;
    }

    return json.data as T;
  } catch (error) {
    console.warn("Shopify request error:", error);
    return null;
  }
}

export async function getProducts(options: {
  limit?: number;
  buyerIP?: string;
} = {}): Promise<Product[]> {
  const { limit = 12, buyerIP } = options;
  const data = await shopifyFetch<{
    products?: { edges: Array<{ node: unknown }> };
  }>(ProductsQuery, { first: limit }, { buyerIP });

  if (!data?.products?.edges?.length) return [];

  const nodes = data.products.edges.map((edge) => edge.node);
  const parsed = ProductsSchema.safeParse(nodes);
  return parsed.success ? parsed.data : [];
}

export async function getProductByHandle(options: {
  handle: string;
  buyerIP?: string;
}): Promise<Product | null> {
  const data = await shopifyFetch<{ product?: unknown }>(
    ProductByHandleQuery,
    { handle: options.handle },
    { buyerIP: options.buyerIP },
  );

  if (!data?.product) return null;

  const parsed = ProductSchema.safeParse(data.product);
  return parsed.success ? parsed.data : null;
}

export async function createCart(
  merchandiseId: string,
  quantity: number,
): Promise<Cart | null> {
  const data = await shopifyFetch<{ cartCreate?: { cart?: unknown } }>(
    CreateCartMutation,
    { id: merchandiseId, quantity },
  );

  const cart = data?.cartCreate?.cart;
  if (!cart) return null;

  const parsed = CartSchema.safeParse(cart);
  return parsed.success ? parsed.data : null;
}

export async function addCartLines(
  cartId: string,
  merchandiseId: string,
  quantity: number,
): Promise<Cart | null> {
  const data = await shopifyFetch<{ cartLinesAdd?: { cart?: unknown } }>(
    AddCartLinesMutation,
    { cartId, merchandiseId, quantity },
  );

  const cart = data?.cartLinesAdd?.cart;
  if (!cart) return null;

  const parsed = CartSchema.safeParse(cart);
  return parsed.success ? parsed.data : null;
}

export async function removeCartLines(
  cartId: string,
  lineIds: string[],
): Promise<Cart | null> {
  const data = await shopifyFetch<{ cartLinesRemove?: { cart?: unknown } }>(
    RemoveCartLinesMutation,
    { cartId, lineIds },
  );

  const cart = data?.cartLinesRemove?.cart;
  if (!cart) return null;

  const parsed = CartSchema.safeParse(cart);
  return parsed.success ? parsed.data : null;
}

export async function getCart(cartId: string): Promise<Cart | null> {
  const data = await shopifyFetch<{ cart?: unknown }>(GetCartQuery, {
    id: cartId,
  });

  if (!data?.cart) return null;

  const parsed = CartSchema.safeParse(data.cart);
  return parsed.success ? parsed.data : null;
}
