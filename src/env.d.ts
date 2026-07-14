/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_SHOPIFY_SHOP?: string;
  readonly PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN?: string;
  readonly PRIVATE_SHOPIFY_STOREFRONT_ACCESS_TOKEN?: string;
  readonly SPOTIFY_CLIENT_ID?: string;
  readonly SPOTIFY_CLIENT_SECRET?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
