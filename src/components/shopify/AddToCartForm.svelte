<script lang="ts">
  import { addCartItem, cart, isCartUpdating } from "../../lib/shopify/cart-store";

  interface Props {
    variantId: string;
    variantQuantityAvailable: number;
    variantAvailableForSale: boolean;
    class?: string;
  }

  let {
    variantId,
    variantQuantityAvailable,
    variantAvailableForSale,
    class: className = "",
  }: Props = $props();

  let variantInCart = $derived(
    $cart.lines.nodes.find((item) => item.merchandise.id === variantId),
  );

  let noQuantityLeft = $derived(
    variantInCart && variantQuantityAvailable <= variantInCart.quantity,
  );

  function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    addCartItem({ id: variantId, quantity: 1 });
  }
</script>

<form class={className} onsubmit={handleSubmit}>
  <input type="hidden" name="id" value={variantId} />
  <input type="hidden" name="quantity" value="1" />

  <button
    type="submit"
    class="shopify-btn shopify-btn--primary"
    disabled={$isCartUpdating || noQuantityLeft || !variantAvailableForSale}
  >
    {#if $isCartUpdating}
      <svg class="shopify-btn__spinner" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" opacity="0.25" />
        <path fill="currentColor" opacity="0.75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
    {/if}
    {#if variantAvailableForSale}
      Add to Cart
    {:else}
      Sold Out
    {/if}
  </button>

  {#if noQuantityLeft}
    <p class="shopify-btn__hint">All units left are in your cart</p>
  {/if}
</form>

<style>
  .shopify-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-sm);
    width: 100%;
    padding: 0.75rem 1.25rem;
    font-family: var(--font-display);
    font-size: var(--text-sm);
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    border: none;
    border-radius: var(--radius-md);
    cursor: pointer;
    transition:
      background-color var(--duration-base) var(--ease-out-quart),
      color var(--duration-base) var(--ease-out-quart);
  }

  .shopify-btn--primary {
    background: var(--color-ink);
    color: var(--color-bg);
    border: 1px solid var(--color-ink);
  }

  .shopify-btn--primary:hover:not(:disabled) {
    background: var(--color-bg);
    color: var(--color-ink);
  }

  .shopify-btn:disabled {
    opacity: 0.55;
    cursor: not-allowed;
    transform: none;
  }

  .shopify-btn__spinner {
    width: 1rem;
    height: 1rem;
    animation: spin 0.8s linear infinite;
  }

  .shopify-btn__hint {
    margin: var(--space-sm) 0 0;
    font-size: var(--text-caption);
    color: var(--color-ember);
    text-align: center;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>
