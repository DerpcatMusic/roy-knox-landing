<script lang="ts">
  import type { Money } from "../../lib/shopify/types";

  interface Props {
    price: Money;
    showCurrency?: boolean;
  }

  let { price, showCurrency = false }: Props = $props();

  let formatted = $derived(
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: price.currencyCode,
      currencyDisplay: showCurrency ? "symbol" : "narrowSymbol",
    }).format(parseFloat(price.amount)),
  );
</script>

<span>{formatted}</span>
