import { z } from "zod";

export const MoneySchema = z.object({
  amount: z.string(),
  currencyCode: z.string(),
});

export const ImageSchema = z
  .object({
    altText: z.string().nullable().optional(),
    url: z.string(),
    width: z.number().positive().int(),
    height: z.number().positive().int(),
  })
  .nullable();

export const VariantSchema = z.object({
  id: z.string(),
  title: z.string(),
  availableForSale: z.boolean(),
  quantityAvailable: z.number().int(),
  price: MoneySchema,
});

export const ProductSchema = z.object({
  id: z.string(),
  title: z.string(),
  handle: z.string(),
  images: z.object({
    nodes: z.array(ImageSchema),
  }),
  variants: z.object({
    nodes: z.array(VariantSchema),
  }),
  featuredImage: ImageSchema.nullable(),
});

export const CartLineSchema = z.object({
  id: z.string(),
  quantity: z.number().positive().int(),
  cost: z.object({
    amountPerQuantity: MoneySchema,
    subtotalAmount: MoneySchema,
    totalAmount: MoneySchema,
  }),
  merchandise: z.object({
    id: z.string(),
    title: z.string(),
    product: z.object({
      title: z.string(),
      handle: z.string(),
    }),
    image: ImageSchema.nullable(),
  }),
});

export const CartSchema = z
  .object({
    id: z.string(),
    checkoutUrl: z.string(),
    totalQuantity: z.number().int(),
    cost: z.object({
      subtotalAmount: MoneySchema,
    }),
    lines: z.object({
      nodes: z.array(CartLineSchema),
    }),
  })
  .nullable();

export type Money = z.infer<typeof MoneySchema>;
export type ShopifyImage = z.infer<typeof ImageSchema>;
export type ProductVariant = z.infer<typeof VariantSchema>;
export type Product = z.infer<typeof ProductSchema>;
export type CartLine = z.infer<typeof CartLineSchema>;
export type Cart = z.infer<typeof CartSchema>;

export const ProductsSchema = z.array(ProductSchema);
