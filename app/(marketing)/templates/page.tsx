import Image from "next/image";
import Link from "next/link";

import { constructMetadata } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";
import { cn } from "@/lib/utils";
import { templates } from "@/config/templates";

export const metadata = constructMetadata({
  title: "Templates & Portfolio",
  description: "Explore our collection of templates and past work.",
});

export default function TemplatesPage() {
  return (
    <MaxWidthWrapper className="py-10">
      <div className="flex flex-col items-start gap-4 md:gap-6">
        <div className="grid gap-1">
          <h1 className="line-clamp-1 text-3xl font-bold md:text-4xl">
            Templates & Portfolio
          </h1>
          <p className="text-lg text-muted-foreground">
            Explore our collection of templates and past work.
          </p>
        </div>

        <div className="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <Card key={template.title} className="flex flex-col overflow-hidden">
              <CardHeader className="flex-none p-0">
                <div className="relative aspect-[16/9] overflow-hidden">
                  <Image
                    src={template.image}
                    alt={template.title}
                    className="object-cover"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority={template.featured}
                  />
                  {template.featured && (
                    <div className="absolute right-2 top-2 rounded-full bg-primary/90 px-3 py-1 text-xs font-medium text-primary-foreground">
                      Featured
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="flex-1 space-y-2 p-5">
                <CardTitle className="line-clamp-1">{template.title}</CardTitle>
                <p className="line-clamp-2 text-sm text-muted-foreground">
                  {template.description}
                </p>
                {template.tags && (
                  <div className="flex flex-wrap gap-1 pt-2">
                    {template.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="px-2 py-0.5">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex-none p-5 pt-0">
                <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-between">
                  <Link
                    href={template.demoUrl}
                    className={cn(
                      buttonVariants({ variant: "default", size: "sm" }),
                      "w-full sm:w-auto"
                    )}
                    target="_blank"
                  >
                    View Demo
                  </Link>
                  {template.sourceUrl && (
                    <Link
                      href={template.sourceUrl}
                      className={cn(
                        buttonVariants({ variant: "outline", size: "sm" }),
                        "w-full sm:w-auto"
                      )}
                      target="_blank"
                    >
                      Source Code
                    </Link>
                  )}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </MaxWidthWrapper>
  );
} 