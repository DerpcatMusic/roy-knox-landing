const API_VERSION = "2024-10";

export interface ShopifyConfig {
  shopifyShop: string;
  publicShopifyAccessToken: string;
  privateShopifyAccessToken: string;
  apiVersion: string;
}

export function getShopifyConfig(): ShopifyConfig | null {
  const shopifyShop = import.meta.env.PUBLIC_SHOPIFY_SHOP;
  const publicShopifyAccessToken = import.meta.env
    .PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

  if (!shopifyShop || !publicShopifyAccessToken) {
    return null;
  }

  return {
    shopifyShop,
    publicShopifyAccessToken,
    privateShopifyAccessToken:
      import.meta.env.PRIVATE_SHOPIFY_STOREFRONT_ACCESS_TOKEN ?? "",
    apiVersion: API_VERSION,
  };
}

export function isShopifyConfigured(): boolean {
  return getShopifyConfig() !== null;
}
