import Stripe from "stripe";

let _stripe: Stripe | null = null;

/**
 * Lazy Stripe singleton. The first call instantiates with the secret
 * key from env; later calls reuse the instance. Throws if the secret
 * is missing — this surfaces a clear error in dev when Stripe isn't
 * yet configured rather than silently failing in webhooks.
 */
export function getStripe(): Stripe {
  if (_stripe) return _stripe;
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    throw new Error(
      "STRIPE_SECRET_KEY missing — set it in .env.local before calling Stripe."
    );
  }
  _stripe = new Stripe(secret, {
    // Use the account's pinned API version — keeps the build green
    // across Stripe SDK upgrades. Override per call if you need a
    // specific version for an idempotent request.
    appInfo: { name: "kapture-forms", version: "0.1.0" },
  });
  return _stripe;
}

export const STRIPE_WEBHOOK_TOLERANCE_SECONDS = 300;
