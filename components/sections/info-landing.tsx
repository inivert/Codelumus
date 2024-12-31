import Image from "next/image";
import { InfoLdg } from "@/types";

import { cn } from "@/lib/utils";
import { Icons } from "@/components/shared/icons";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";

interface InfoLandingProps {
  data: InfoLdg;
  reverse?: boolean;
}

export default function InfoLanding({
  data,
  reverse = false,
}: InfoLandingProps) {
  return (
    <div className="py-10 sm:py-20">
      <MaxWidthWrapper className="grid gap-10 px-2.5 lg:grid-cols-2 lg:items-center lg:gap-20 lg:px-7">
        <div className={cn(reverse ? "lg:order-2" : "lg:order-1", "max-w-2xl")}>
          <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl lg:text-[40px]">
            {data.title}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {data.description}
          </p>
          <dl className="mt-8 space-y-6 leading-7">
            {data.list.map((item, index) => {
              const Icon = Icons[item.icon || "arrowRight"];
              return (
                <div className="relative pl-9" key={index}>
                  <dt className="inline font-semibold text-foreground">
                    <Icon className="absolute left-0 top-1 size-6 text-primary" />
                    <span>{item.title}</span>
                  </dt>
                  <dd className="mt-2 text-muted-foreground">
                    {item.description}
                  </dd>
                </div>
              );
            })}
          </dl>
        </div>
        <div
          className={cn(
            "overflow-hidden rounded-xl border bg-background p-8 lg:-m-4",
            reverse ? "order-1" : "order-2",
          )}
        >
          <div className="aspect-[4/3] flex items-center justify-center">
            <Image
              className="size-full object-contain"
              src={data.image}
              alt={data.title}
              width={1000}
              height={750}
              priority={true}
            />
          </div>
        </div>
      </MaxWidthWrapper>
    </div>
  );
}
