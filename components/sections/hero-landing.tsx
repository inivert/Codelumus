import Link from "next/link";
import Image from "next/image";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/shared/icons";

export default async function HeroLanding() {
  return (
    <section className="space-y-6 py-12 sm:py-20 lg:py-20">
      <div className="container flex max-w-5xl flex-col items-center gap-5 text-center">
        <div className="flex items-center justify-center">
          <Image
            src="/assets/prisma-16-svgrepo-com.svg"
            alt="Codelumus Logo"
            width={100}
            height={100}
            className="dark:invert"
            priority
          />
        </div>

        <h1 className="text-balance font-urban text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-[66px]">
          Welcome to{" "}
          <span className="text-gradient_indigo-purple font-extrabold">
            Codelumus
          </span>
        </h1>

        <p
          className="max-w-2xl text-balance leading-normal text-muted-foreground sm:text-xl sm:leading-8"
          style={{ animationDelay: "0.35s", animationFillMode: "forwards" }}
        >
          Your central hub for managing development projects and collaborations.
        </p>

        <div
          className="flex justify-center space-x-2 md:space-x-4"
          style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}
        >
          <Link
            href="/pricing"
            prefetch={true}
            className={cn(
              buttonVariants({ size: "lg", rounded: "full" }),
              "gap-2",
            )}
          >
            <span>Get Started</span>
            <Icons.arrowRight className="size-4" />
          </Link>
          <Link
            href="/docs"
            className={cn(
              buttonVariants({
                variant: "outline",
                size: "lg",
                rounded: "full",
              }),
              "px-5",
            )}
          >
            <Icons.bookOpen className="mr-2 size-4" />
            <span>Documentation</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
