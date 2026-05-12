/**
 * Cart wire types — shared between the client provider, the drawer, and
 * the /api/checkout/cart endpoint.
 *
 * A cart item is always (slug, optionId, qty). The server is the
 * authority on pricing — never trust prices written by the client. The
 * endpoint resolves slug → StoreProduct → option and reads the canonical
 * pricePence at session-creation time.
 */

export interface CartItem {
  /** Product slug — matches getStoreProduct(slug). */
  slug: string;
  /** Which pricing option the buyer picked. Matches StoreProduct.options[].id. */
  optionId: string;
  /** Quantity — 1 for most items, but bundles / packs can be bought in multiples. */
  qty: number;
  /** Snapshot fields cached for fast drawer render — refreshed on revisit. */
  snapshot: {
    title: string;
    optionLabel: string;
    pricePence: number;
    rrpPence?: number;
    mode: "oneoff" | "subscription" | "preorder" | "bundle" | "pass";
  };
}

export interface CartCheckoutRequest {
  items: Array<Pick<CartItem, "slug" | "optionId" | "qty">>;
  email?: string;
}
