import { DashboardHeader } from "@/components/dashboard/header";
import { SupportForm } from "@/components/forms/support-form";

export const metadata = {
  title: "Support",
  description: "Get help with your account",
};

export default function SupportPage() {
  return (
    <div className="flex flex-col gap-8">
      <DashboardHeader
        heading="Support"
        text="Need help? Fill out the form below and we'll get back to you as soon as possible."
      />
      <div className="grid gap-10">
        <SupportForm />
      </div>
    </div>
  );
} 