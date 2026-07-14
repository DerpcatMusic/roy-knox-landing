import { atom } from "nanostores";
import { persistentAtom } from "@nanostores/persistent";
import {
  addCartLines,
  createCart,
  getCart,
  removeCartLines,
} from "./client";
import type { Cart } from "./types";

export const isCartDrawerOpen = atom(false);
export const isCartUpdating = atom(false);

const emptyCart: NonNullable<Cart> = {
  id: "",
  checkoutUrl: "",
  totalQuantity: 0,
  lines: { nodes: [] },
  cost: { subtotalAmount: { amount: "", currencyCode: "" } },
};

export const cart = persistentAtom<NonNullable<Cart>>("flare-cart", emptyCart, {
  encode: JSON.stringify,
  decode: JSON.parse,
});

export async function initCart() {
  const sessionStarted = sessionStorage.getItem("flare-cart-session");
  if (sessionStarted) return;

  sessionStorage.setItem("flare-cart-session", "true");

  const localCart = cart.get();
  if (!localCart.id) return;

  const data = await getCart(localCart.id);
  if (data) {
    cart.set(data);
    return;
  }

  cart.set(emptyCart);
}

export async function addCartItem(item: { id: string; quantity: number }) {
  const localCart = cart.get();
  isCartUpdating.set(true);

  try {
    const cartData = localCart.id
      ? await addCartLines(localCart.id, item.id, item.quantity)
      : await createCart(item.id, item.quantity);

    if (cartData) {
      cart.set(cartData);
      isCartDrawerOpen.set(true);
    }
  } finally {
    isCartUpdating.set(false);
  }
}

export async function removeCartItems(lineIds: string[]) {
  const localCart = cart.get();
  if (!localCart.id) return;

  isCartUpdating.set(true);

  try {
    const cartData = await removeCartLines(localCart.id, lineIds);
    if (cartData) {
      cart.set(cartData);
    }
  } finally {
    isCartUpdating.set(false);
  }
}
