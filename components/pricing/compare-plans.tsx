import { PlansRow } from "@/types";
import { CircleCheck, Plus } from "lucide-react";

import { addOns } from "@/config/subscriptions";
import { comparePlans } from "@/config/pricing-data";
import { HeaderSection } from "@/components/shared/header-section";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";
import { Card } from "@/components/ui/card";

export function ComparePlans() {
  return (
    <MaxWidthWrapper>
      <HeaderSection
        label="Features"
        title="Core Features & Add-Ons"
        subtitle="Everything included in the Starter Plan, plus optional add-ons for your specific needs"
      />

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <h3 className="text-xl font-semibold">Core Features</h3>
          <div className="rounded-lg border bg-card p-6 space-y-4">
            {comparePlans.map((feature: PlansRow, index: number) => (
              <div key={index} className="flex items-start gap-3">
                <CircleCheck className="size-5 text-primary flex-shrink-0 mt-1" />
                <div>
                  <p className="font-medium">{feature.feature}</p>
                  {feature.starter && (
                    <p className="text-sm text-muted-foreground">{feature.starter}</p>
                  )}
                  {feature.tooltip && (
                    <p className="text-xs text-muted-foreground mt-1">{feature.tooltip}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-semibold">Available Add-Ons</h3>
          <div className="rounded-lg border bg-card p-6 space-y-6">
            {addOns.map((addon, index) => (
              <div key={addon.id} className="space-y-4">
                <div>
                  <h4 className="text-lg font-semibold">{addon.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{addon.description}</p>
                </div>
                <ul className="space-y-2">
                  {addon.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <Plus className="size-4 text-primary flex-shrink-0 mt-1" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MaxWidthWrapper>
  );
}
