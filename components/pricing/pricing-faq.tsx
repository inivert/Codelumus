import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HeaderSection } from "@/components/shared/header-section";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";

const faqs = [
  {
    question: "How long does it take to build a website?",
    answer:
      "Timeline varies based on project complexity. I typically complete a basic website in 2-3 weeks, while more complex projects with custom features may take 4-6 weeks. I'll provide you with a detailed timeline during our initial consultation.",
  },
  {
    question: "Do you handle hosting and domains?",
    answer:
      "Yes, I take care of all technical aspects including hosting setup and domain configuration. I'll set up SSL certificates, configure backups, and implement security monitoring to keep your site running smoothly.",
  },
  {
    question: "How do I request website updates?",
    answer:
      "Simply email me with your requested changes, and I'll handle all updates for you. This ensures your website maintains its quality and consistency. I typically implement minor updates within 24-48 hours of your request.",
  },
  {
    question: "What technologies do you use?",
    answer:
      "I specialize in modern web technologies including Next.js, React, and Node.js. For databases, I use Supabase, and I can integrate various third-party services based on your needs. Every site I build is mobile-first and fully responsive.",
  },
  {
    question: "Do you provide maintenance?",
    answer:
      "Yes, I include maintenance in all plans. This covers regular updates, security patches, and technical support. The level of support varies by plan, and I offer extended maintenance packages if you need additional coverage.",
  },
  {
    question: "What happens after my support period ends?",
    answer:
      "After your initial support period, you can either extend your maintenance plan or switch to pay-as-you-need support. I'll still be here to help - you won't be left without assistance.",
  },
  {
    question: "Can I upgrade my plan later?",
    answer:
      "Yes, you can upgrade your plan anytime to access more features and support. I'll help you transition smoothly and implement any additional functionality you need.",
  },
  {
    question: "Do you help with SEO?",
    answer:
      "Yes, I build every website with SEO best practices in mind. I provide basic SEO optimization with all plans and more advanced SEO services with Pro and Enterprise plans. I can also help integrate your marketing tools and analytics.",
  },
];

export function PricingFaq() {
  return (
    <MaxWidthWrapper>
      <section className="mx-auto flex max-w-5xl flex-col gap-8">
        <HeaderSection
          label="FAQ"
          title="Frequently Asked Questions"
          subtitle="Everything you need to know about my web development services"
        />

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </MaxWidthWrapper>
  );
}
