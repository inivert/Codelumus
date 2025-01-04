"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, X, Trash2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { addOns } from "@/config/subscriptions";
import { UserSubscriptionPlan } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AddonManagerProps {
  subscriptionPlan: UserSubscriptionPlan;
}

export function AddonManager({ subscriptionPlan }: AddonManagerProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleToggleAddon = (addonId: string) => {
    setSelectedAddons(current => {
      if (current.includes(addonId)) {
        return current.filter(id => id !== addonId);
      } else {
        return [...current, addonId];
      }
    });
  };

  const handleCancelAddons = async () => {
    if (selectedAddons.length === 0) return;

    try {
      setIsLoading(true);
      
      // Cancel each selected addon
      for (const addonId of selectedAddons) {
        const response = await fetch("/api/subscription/addons", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ addonId }),
        });

        if (!response.ok) {
          throw new Error(`Failed to cancel addon: ${addonId}`);
        }
      }

      toast.success(
        selectedAddons.length === 1 
          ? "Addon cancelled successfully" 
          : "Addons cancelled successfully"
      );
      setShowConfirmDialog(false);
      setSelectedAddons([]);
      router.refresh();
    } catch (error) {
      console.error("Error cancelling addons:", error);
      toast.error("Failed to cancel addons");
    } finally {
      setIsLoading(false);
    }
  };

  if (!subscriptionPlan.activeAddons?.length) {
    return null;
  }

  const totalSavings = selectedAddons.reduce((sum, addonId) => {
    const addon = addOns.find(a => a.id === addonId);
    if (!addon) return sum;
    return sum + (subscriptionPlan.interval === "month" ? addon.price.monthly : addon.price.yearly);
  }, 0);

  return (
    <>
      <div className="rounded-lg border bg-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Active Add-ons</h3>
          {selectedAddons.length > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowConfirmDialog(true)}
              disabled={isLoading}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Cancel Selected ({selectedAddons.length})
            </Button>
          )}
        </div>
        <div className="space-y-6">
          {subscriptionPlan.activeAddons.map((addonId) => {
            const addon = addOns.find(a => a.id === addonId);
            if (!addon) return null;
            
            return (
              <div key={addon.id} className="flex items-start gap-4">
                <Checkbox
                  id={`addon-${addon.id}`}
                  checked={selectedAddons.includes(addon.id)}
                  onCheckedChange={() => handleToggleAddon(addon.id)}
                  disabled={isLoading}
                />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <label
                      htmlFor={`addon-${addon.id}`}
                      className="font-medium cursor-pointer"
                    >
                      {addon.title}
                    </label>
                    <span className="text-sm text-muted-foreground">
                      ${subscriptionPlan.interval === "month" ? addon.price.monthly : addon.price.yearly}/{subscriptionPlan.interval}ly
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{addon.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Selected Add-ons</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel the following add-ons?
              <ul className="mt-2 space-y-1">
                {selectedAddons.map(addonId => {
                  const addon = addOns.find(a => a.id === addonId);
                  return (
                    <li key={addonId} className="text-sm">
                      • {addon?.title}
                    </li>
                  );
                })}
              </ul>
              {totalSavings > 0 && (
                <div className="mt-4 p-4 bg-muted rounded-lg flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-blue-500">Billing Impact</p>
                    <p>
                      You will save ${totalSavings}/{subscriptionPlan.interval}ly after cancellation.
                      Changes will take effect at the end of your current billing period.
                    </p>
                  </div>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
              disabled={isLoading}
            >
              Keep Add-ons
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelAddons}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cancelling...
                </>
              ) : (
                "Confirm Cancellation"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
} 