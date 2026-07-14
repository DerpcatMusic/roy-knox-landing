<script lang="ts">
  import type { ShopifyImage } from "../../lib/shopify/types";

  interface Props {
    image: ShopifyImage;
    class?: string;
    loading?: "lazy" | "eager";
    sizes: string;
  }

  let {
    image,
    class: className = "",
    loading = "lazy",
    sizes,
  }: Props = $props();

  const srcSetValues = [
    50, 100, 200, 450, 600, 750, 900, 1000, 1250, 1500, 1750, 2000, 2500,
  ];

  function imageUrl(width: number, height = "") {
    return image ? `${image.url}&width=${width}&height=${height}` : "";
  }

  let srcset = $derived.by(() => {
    if (!image) return "";

    return srcSetValues
      .filter((value) => value < image.width)
      .map((value) => `${imageUrl(value)} ${value}w`)
      .concat(`${image.url} ${image.width}w`)
      .join(", ");
  });
</script>

{#if image}
  <img
    src={image.url}
    alt={image.altText || "Product image"}
    class={className}
    width={image.width}
    height={image.height}
    {loading}
    {sizes}
    srcset={srcset}
  />
{:else}
  <div class="shopify-image-placeholder" aria-hidden="true">
    <span>RK</span>
  </div>
{/if}

<style>
  .shopify-image-placeholder {
    display: grid;
    place-items: center;
    width: 100%;
    height: 100%;
    background: var(--color-surface);
  }

  .shopify-image-placeholder span {
    font-family: var(--font-display);
    font-size: var(--text-headline);
    font-weight: 400;
    color: var(--color-ink-muted);
    letter-spacing: var(--tracking-display);
  }
</style>
