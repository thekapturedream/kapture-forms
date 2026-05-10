import Link from "next/link";
import { Nav } from "@components/Nav";
import { Footer } from "@components/Footer";

export const dynamic = "force-dynamic";

export default function SuccessPage({
  searchParams,
}: {
  searchParams: { session_id?: string };
}) {
  const sessionId = searchParams.session_id ?? null;

  return (
    <>
      <Nav variant="compact" />
      <section className="bg-kapture-paper py-20">
        <div className="container-c max-w-2xl">
          <div className="bg-white border border-kapture-fog rounded-2xl p-8">
            <span className="ed-kicker">PAYMENT RECEIVED</span>
            <h1 className="h-section text-kapture-black mb-4">
              Welcome to Kapture Forms.
            </h1>
            <p className="font-serif text-base text-kapture-smoke leading-relaxed mb-6">
              Your order is confirmed. We&apos;ve emailed you a magic-link sign-in. Open it on
              this device and you&apos;ll land directly in your dashboard with your downloads
              and (if you bought hosted) your branded form URL.
            </p>
            <div className="bg-kapture-paper border border-kapture-fog rounded-xl p-4 mb-6">
              <div className="font-mono text-[0.625rem] uppercase tracking-widest text-kapture-mist mb-1">
                STRIPE SESSION
              </div>
              <div className="font-mono text-xs text-kapture-smoke break-all">
                {sessionId ?? "—"}
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/dashboard" className="btn-yellow">
                Go to dashboard →
              </Link>
              <Link href="/auth/login" className="btn-secondary">
                Resend sign-in link
              </Link>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
