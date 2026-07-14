<script lang="ts">
  import { fade, fly } from "svelte/transition";
  import {
    cart,
    isCartDrawerOpen,
    isCartUpdating,
    removeCartItems,
  } from "../../lib/shopify/cart-store";
  import { clickOutside } from "../../utils/click-outside";
  import Money from "./Money.svelte";
  import ShopifyImage from "./ShopifyImage.svelte";

  let drawerEl: HTMLDivElement | undefined = $state();

  let cartIsUpdatingClass = $derived(
    $isCartUpdating ? "cart-drawer__list--updating" : "",
  );

  $effect(() => {
    if ($isCartDrawerOpen) {
      document.body.classList.add("cart-drawer-open");
      drawerEl?.focus();
      return;
    }

    document.body.classList.remove("cart-drawer-open");
  });

  function closeDrawer() {
    isCartDrawerOpen.set(false);
  }

  function removeItem(lineId: string) {
    removeCartItems([lineId]);
  }

  function onKeyDown(event: KeyboardEvent) {
    if (event.key === "Escape") {
      closeDrawer();
    }
  }
</script>

{#if $isCartDrawerOpen}
  <div
    class="cart-drawer"
    aria-labelledby="cart-drawer-title"
    role="dialog"
    aria-modal="true"
    tabindex="-1"
    bind:this={drawerEl}
    onkeydown={onKeyDown}
  >
    <div class="cart-drawer__backdrop" in:fade={{ duration: 300 }} out:fade={{ duration: 300 }}></div>

    <div class="cart-drawer__frame">
      <div
        class="cart-drawer__panel"
        use:clickOutside={() => closeDrawer()}
        in:fly={{ duration: 400, x: 420 }}
        out:fly={{ duration: 400, x: 420 }}
      >
        <header class="cart-drawer__header">
          <h2 id="cart-drawer-title" class="cart-drawer__title">
            Your Cart
            {#if $isCartUpdating}
              <svg class="cart-drawer__spinner" viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" opacity="0.25" />
                <path fill="currentColor" opacity="0.75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            {/if}
          </h2>
          <button type="button" class="cart-drawer__close" onclick={closeDrawer}>
            <span class="sr-only">Close cart</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>

        <div class="cart-drawer__body">
          {#if $cart.lines.nodes.length > 0}
            <ul class={`cart-drawer__list ${cartIsUpdatingClass}`}>
              {#each $cart.lines.nodes as item (item.id)}
                <li class="cart-drawer__item">
                  <a href={`/shop/${item.merchandise.product.handle}`} class="cart-drawer__thumb">
                    <ShopifyImage
                      image={item.merchandise.image}
                      sizes="80px"
                      loading="lazy"
                    />
                  </a>

                  <div class="cart-drawer__details">
                    <a href={`/shop/${item.merchandise.product.handle}`} class="cart-drawer__name">
                      {item.merchandise.product.title}
                    </a>
                    {#if item.merchandise.title !== "Default Title"}
                      <p class="cart-drawer__variant">{item.merchandise.title}</p>
                    {/if}
                    <p class="cart-drawer__price">
                      <Money price={item.cost.amountPerQuantity} />
                    </p>
                  </div>

                  <div class="cart-drawer__actions">
                    <button
                      type="button"
                      class="cart-drawer__remove"
                      onclick={() => removeItem(item.id)}
                      disabled={$isCartUpdating}
                      aria-label={`Remove ${item.merchandise.product.title}`}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    </button>
                    <p class="cart-drawer__line-total">
                      <Money price={item.cost.totalAmount} />
                    </p>
                  </div>
                </li>
              {/each}
            </ul>
          {:else}
            <div class="cart-drawer__empty">
              <p>Your cart is empty.</p>
              <a href="/#merch">Continue shopping</a>
            </div>
          {/if}
        </div>

        {#if $cart.lines.nodes.length > 0}
          <footer class="cart-drawer__footer">
            <div class="cart-drawer__subtotal">
              <span>Subtotal</span>
              <Money price={$cart.cost.subtotalAmount} showCurrency />
            </div>
            <p class="cart-drawer__note">Shipping and taxes calculated at checkout.</p>
            <a href={$cart.checkoutUrl} class="shopify-btn shopify-btn--primary cart-drawer__checkout">
              Checkout
            </a>
          </footer>
        {/if}
      </div>
    </div>
  </div>
{/if}

<style>
  :global(body.cart-drawer-open) {
    overflow: hidden;
  }

  .cart-drawer {
    position: relative;
    z-index: var(--z-modal);
    outline: none;
  }

  .cart-drawer__backdrop {
    position: fixed;
    inset: 0;
    background: oklch(0.145 0.012 280 / 0.45);
  }

  .cart-drawer__frame {
    position: fixed;
    inset: 0;
    overflow: hidden;
    pointer-events: none;
  }

  .cart-drawer__panel {
    pointer-events: auto;
    position: absolute;
    inset-block: 0;
    inset-inline-end: 0;
    display: flex;
    flex-direction: column;
    width: min(100vw, 28rem);
    max-height: 100dvh;
    background: var(--color-bg);
    border-inline-start: 1px solid var(--color-border-strong);
  }

  .cart-drawer__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-md);
    padding: var(--space-lg);
    border-bottom: 1px solid var(--color-border);
  }

  .cart-drawer__title {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    font-family: var(--font-display);
    font-size: var(--text-lg);
    font-weight: 400;
    letter-spacing: var(--tracking-display);
  }

  .cart-drawer__spinner {
    width: 1rem;
    height: 1rem;
    animation: spin 0.8s linear infinite;
  }

  .cart-drawer__close {
    display: grid;
    place-items: center;
    width: 2.25rem;
    height: 2.25rem;
    padding: 0;
    color: var(--color-ink-muted);
    background: transparent;
    border: none;
    border-radius: var(--radius-sm);
    cursor: pointer;
  }

  .cart-drawer__close:hover {
    color: var(--color-flame);
  }

  .cart-drawer__close svg {
    width: 1.25rem;
    height: 1.25rem;
  }

  .cart-drawer__body {
    flex: 1;
    overflow-y: auto;
    padding: var(--space-lg);
  }

  .cart-drawer__list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: var(--space-lg);
  }

  .cart-drawer__list--updating {
    opacity: 0.55;
    pointer-events: none;
  }

  .cart-drawer__item {
    display: grid;
    grid-template-columns: 4.5rem 1fr auto;
    gap: var(--space-md);
    align-items: start;
  }

  .cart-drawer__thumb {
    display: block;
    overflow: hidden;
    aspect-ratio: 1;
    border-radius: var(--radius-md);
    border: 1px solid var(--color-border);
    text-decoration: none;
  }

  .cart-drawer__thumb :global(img),
  .cart-drawer__thumb :global(.shopify-image-placeholder) {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .cart-drawer__details {
    display: grid;
    gap: 0.25rem;
  }

  .cart-drawer__name {
    font-family: var(--font-display);
    font-size: var(--text-sm);
    font-weight: 400;
    color: var(--color-ink);
    text-decoration: none;
  }

  .cart-drawer__name:hover {
    color: var(--color-flame);
  }

  .cart-drawer__variant,
  .cart-drawer__price,
  .cart-drawer__line-total {
    margin: 0;
    font-size: var(--text-caption);
    color: var(--color-ink-muted);
  }

  .cart-drawer__actions {
    display: flex;
    flex-direction: column;
    align-items: end;
    justify-content: space-between;
    gap: var(--space-sm);
  }

  .cart-drawer__remove {
    display: grid;
    place-items: center;
    width: 2rem;
    height: 2rem;
    padding: 0;
    color: var(--color-ink-muted);
    background: transparent;
    border: none;
    border-radius: var(--radius-sm);
    cursor: pointer;
  }

  .cart-drawer__remove:hover:not(:disabled) {
    color: var(--color-ember);
  }

  .cart-drawer__remove svg {
    width: 1rem;
    height: 1rem;
  }

  .cart-drawer__empty {
    display: grid;
    gap: var(--space-md);
    place-items: center;
    padding-block: var(--space-3xl);
    text-align: center;
    color: var(--color-ink-muted);
  }

  .cart-drawer__footer {
    padding: var(--space-lg);
    border-top: 1px solid var(--color-border);
    display: grid;
    gap: var(--space-sm);
  }

  .cart-drawer__subtotal {
    display: flex;
    justify-content: space-between;
    font-family: var(--font-display);
    font-size: var(--text-body);
    font-weight: 400;
  }

  .cart-drawer__note {
    margin: 0;
    font-size: var(--text-caption);
    color: var(--color-ink-muted);
  }

  .cart-drawer__checkout {
    margin-top: var(--space-sm);
    text-decoration: none;
  }

  .shopify-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 0.85rem 1.25rem;
    font-family: var(--font-display);
    font-size: var(--text-sm);
    font-weight: 400;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    border: none;
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: background-color var(--duration-base) var(--ease-out-quart);
  }

  .shopify-btn--primary {
    background: var(--color-ink);
    color: var(--color-bg);
    border: 1px solid var(--color-ink);
  }

  .shopify-btn--primary:hover {
    background: var(--color-bg);
    color: var(--color-ink);
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>
