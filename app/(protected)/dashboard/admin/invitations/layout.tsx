import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Invitations | Admin Dashboard",
  description: "Manage and send invitations to new users",
};

export default function InvitationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 