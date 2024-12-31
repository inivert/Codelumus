import { MarketingConfig } from "types"

export const marketingConfig: MarketingConfig = {
  mainNav: [
    {
      title: "Pricing",
      href: "/pricing",
    },
    {
      title: "Templates",
      href: "/templates",
    },
    {
      title: "Roadmap",
      href: "/roadmap",
    },
    {
      title: "Book a Call",
      href: "/book-consultation",
      className: "bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-4",
    },
  ],
}
