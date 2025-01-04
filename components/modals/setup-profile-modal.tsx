"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface SetupProfileModalProps {
  name: string | null;
  website: string | null;
}

export function SetupProfileModal({ name, website }: SetupProfileModalProps) {
  const router = useRouter();

  // Debug log
  console.log("SetupProfileModal props:", {
    name,
    website,
    nameType: typeof name,
    websiteType: typeof website,
    nameTrimmed: name?.trim(),
    websiteTrimmed: website?.trim(),
  });

  if (name?.trim() && website?.trim()) {
    return null;
  }

  return (
    <Card className="mb-8 border-yellow-500">
      <CardHeader>
        <CardTitle className="text-yellow-500">Complete Your Profile Setup</CardTitle>
        <CardDescription>
          Please update your profile information to get the most out of Codelumus
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm">
          {(!name?.trim()) && <p>• Add your display name</p>}
          {(!website?.trim()) && <p>• Set your website name</p>}
        </div>
        <Button onClick={() => router.push("/dashboard/settings")}>
          Go to Settings
        </Button>
      </CardContent>
    </Card>
  );
} 