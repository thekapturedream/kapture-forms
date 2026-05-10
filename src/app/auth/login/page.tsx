import { Nav } from "@components/Nav";
import { Footer } from "@components/Footer";
import { LoginForm } from "./LoginForm";

export const metadata = {
  title: "Sign in",
  description: "Sign in to Kapture Forms with a magic link.",
};

export default function LoginPage() {
  return (
    <>
      <Nav variant="compact" />
      <section className="bg-kapture-paper py-20 min-h-[60vh]">
        <div className="container-c max-w-md">
          <div className="bg-white border border-kapture-fog rounded-2xl p-8">
            <span className="ed-kicker">SIGN IN</span>
            <h1 className="font-display font-semibold text-2xl mb-2">
              Magic-link sign-in.
            </h1>
            <p className="text-sm text-kapture-smoke leading-relaxed mb-6">
              Enter the email you used at checkout. We&apos;ll send a one-time link that drops
              you straight into your dashboard.
            </p>
            <LoginForm />
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
