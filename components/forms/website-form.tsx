"use client";

import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SectionColumns } from "@/components/dashboard/section-columns";
import { Icons } from "@/components/shared/icons";

const websiteSchema = z.object({
  website: z.string().max(191, "Website name is too long").optional(),
});

interface WebsiteFormProps {
  user: {
    id: string;
    website: string | null;
  };
}

export function WebsiteForm({ user }: WebsiteFormProps) {
  const [updated, setUpdated] = useState(false);
  const [isPending, startTransition] = useTransition();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(websiteSchema),
    defaultValues: {
      website: user?.website || "",
    },
  });

  const checkUpdate = (value: string) => {
    setUpdated(user.website !== value);
  };

  const onSubmit = handleSubmit((data) => {
    startTransition(async () => {
      try {
        const response = await fetch("/api/user/website", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error("Failed to update website");
        }

        setUpdated(false);
        toast.success("Your website has been updated.");
      } catch (error) {
        toast.error("Something went wrong.", {
          description: "Your website was not updated. Please try again.",
        });
      }
    });
  });

  return (
    <form onSubmit={onSubmit}>
      <SectionColumns
        title="Website"
        description="Set your website name."
      >
        <div className="flex w-full items-center gap-2">
          <Input
            id="website"
            className="flex-1"
            size={32}
            {...register("website")}
            onChange={(e) => checkUpdate(e.target.value)}
          />
          <Button
            type="submit"
            variant={updated ? "default" : "disable"}
            disabled={isPending || !updated}
            className="w-[67px] shrink-0 px-0 sm:w-[130px]"
          >
            {isPending ? (
              <Icons.spinner className="size-4 animate-spin" />
            ) : (
              <p>
                Save
                <span className="hidden sm:inline-flex">&nbsp;Changes</span>
              </p>
            )}
          </Button>
        </div>
        <div className="flex flex-col justify-between p-1">
          {errors?.website && (
            <p className="pb-0.5 text-[13px] text-red-600">
              {errors.website.message}
            </p>
          )}
          <p className="text-[13px] text-muted-foreground">Max 191 characters</p>
        </div>
      </SectionColumns>
    </form>
  );
}
