"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { AddOn } from "@/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AddonSelectorProps {
  addons: AddOn[];
  selectedAddons: AddOn[];
  onSelect: (addon: AddOn) => void;
  frequency: "monthly" | "yearly";
}

export function AddonSelector({
  addons,
  selectedAddons,
  onSelect,
  frequency,
}: AddonSelectorProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold">Customize Your Plan</h3>
        <p className="text-sm text-muted-foreground">Add extra features to your subscription</p>
      </div>
      
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {addons.map((addon) => {
          const isSelected = selectedAddons.some(a => a.id === addon.id);
          
          return (
            <Card
              key={addon.id}
              className={cn(
                "relative cursor-pointer overflow-hidden p-6 transition-all hover:shadow-md",
                isSelected && "ring-2 ring-primary"
              )}
              onClick={() => onSelect(addon)}
            >
              {isSelected && (
                <div className="absolute right-2 top-2">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                    <Check className="h-3 w-3 text-primary-foreground" />
                  </div>
                </div>
              )}
              
              <h4 className="font-medium">{addon.title}</h4>
              <div className="mt-1 flex items-baseline gap-x-1">
                <span className="text-2xl font-bold">
                  ${frequency === "monthly" ? addon.price.monthly : addon.price.yearly}
                </span>
                <span className="text-sm text-muted-foreground">
                  /{frequency}
                </span>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                {addon.description}
              </p>
              
              <ul className="mt-4 space-y-2">
                {addon.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-x-2 text-sm">
                    <Check className="h-4 w-4 text-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button
                variant={isSelected ? "default" : "outline"}
                className="mt-6 w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(addon);
                }}
              >
                {isSelected ? "Remove" : "Add to Plan"}
              </Button>
            </Card>
          );
        })}
      </div>
    </div>
  );
} 