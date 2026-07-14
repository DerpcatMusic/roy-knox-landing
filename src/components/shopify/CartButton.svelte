<script lang="ts">
  import { onMount } from "svelte";
  import { cart, initCart, isCartDrawerOpen } from "../../lib/shopify/cart-store";

  onMount(() => {
    initCart();
  });

  function openCart() {
    isCartDrawerOpen.set(true);
  }
</script>

<button
  type="button"
  class="cart-button"
  onclick={openCart}
  aria-label={$cart.totalQuantity > 0 ? `Open cart, ${$cart.totalQuantity} items` : "Open cart"}
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke-width="1.5"
    stroke="currentColor"
    aria-hidden="true"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
    />
  </svg>

  {#if $cart.totalQuantity > 0}
    <span class="cart-button__badge">{$cart.totalQuantity}</span>
  {/if}
</button>

<style>
  .cart-button {
    position: relative;
    display: grid;
    place-items: center;
    width: 2.5rem;
    height: 2.5rem;
    padding: 0;
    color: var(--color-ink);
    background: transparent;
    border: 1px solid var(--color-border-strong);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition:
      color var(--duration-fast) var(--ease-out-quart),
      border-color var(--duration-fast) var(--ease-out-quart);
  }

  .cart-button svg {
    width: 1.25rem;
    height: 1.25rem;
  }

  .cart-button:hover {
    color: var(--color-ink);
    border-color: var(--color-ink);
  }

  .cart-button__badge {
    position: absolute;
    top: -0.35rem;
    right: -0.35rem;
    min-width: 1.15rem;
    height: 1.15rem;
    padding-inline: 0.25rem;
    display: grid;
    place-items: center;
    font-family: var(--font-label);
    font-size: 0.65rem;
    font-weight: 500;
    color: var(--color-bg);
    background: var(--color-ink);
    border-radius: var(--radius-pill);
  }
</style>
