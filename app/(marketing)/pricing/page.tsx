import Image from "next/image";
import Link from "next/link";

import { getCurrentUser } from "@/lib/session";
import { getUserSubscriptionPlan } from "@/lib/subscription";
import { constructMetadata } from "@/lib/utils";
import { ComparePlans } from "@/components/pricing/compare-plans";
import { PricingCards } from "@/components/pricing/pricing-cards";
import { PricingFaq } from "@/components/pricing/pricing-faq";

export const metadata = constructMetadata({
  title: "Website Development Plans - Codelumus",
  description: "Choose the perfect website development plan for your business. From simple landing pages to full-featured web applications.",
});

export default async function PricingPage() {
  const user = await getCurrentUser();

  if (user?.role === "ADMIN") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <h1 className="text-5xl font-bold">Seriously?</h1>
        <Image
          src="/_static/illustrations/call-waiting.svg"
          alt="403"
          width={560}
          height={560}
          className="pointer-events-none -my-20 dark:invert"
        />
        <p className="text-balance px-4 text-center text-2xl font-medium">
          You are an {user.role}. Back to{" "}
          <Link
            href="/admin"
            className="text-muted-foreground underline underline-offset-4 hover:text-purple-500"
          >
            Dashboard
          </Link>
          .
        </p>
      </div>
    );
  }

  let subscriptionPlan;
  if (user && user.id) {
    subscriptionPlan = await getUserSubscriptionPlan(user.id);
  }

  return (
    <div className="flex w-full flex-col gap-16 py-8 md:py-8">
      <div className="container text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Website Development Plans
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          Choose the perfect plan for your business. All plans include responsive design, SEO optimization, and ongoing support.
        </p>
      </div>
      
      <PricingCards userId={user?.id} subscriptionPlan={subscriptionPlan} />
      
      <div className="container space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold">Why Choose Us?</h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            We build modern, fast, and secure websites that help your business grow
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-xl font-semibold mb-2">Modern Technology Stack</h3>
            <p className="text-muted-foreground">Built with Next.js, React, and other cutting-edge technologies for optimal performance.</p>
          </div>
          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-xl font-semibold mb-2">Secure & Reliable</h3>
            <p className="text-muted-foreground">Enterprise-grade security with regular backups and monitoring to keep your website safe.</p>
          </div>
          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-xl font-semibold mb-2">Ongoing Support</h3>
            <p className="text-muted-foreground">Dedicated support team to help you maintain and improve your website as your business grows.</p>
          </div>
        </div>
      </div>

      <hr className="container" />
      <ComparePlans />
      <PricingFaq />
    </div>
  );
}
