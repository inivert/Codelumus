"use client";

import { getInvitations } from "./actions";
import { DataTable } from "@/components/ui/data-table";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { InvitationForm } from "./invitation-form";
import { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";

interface InvitationsTableProps {
  id: string;
  email: string;
  status: string;
  createdAt: Date;
  invitedBy: {
    name: string | null;
    email: string | null;
  };
}

const columns: ColumnDef<InvitationsTableProps>[] = [
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "invitedBy.name",
    header: "Invited By",
  },
  {
    accessorKey: "createdAt",
    header: "Sent At",
    cell: ({ row }) => {
      return format(new Date(row.getValue("createdAt")), "MMM d, yyyy HH:mm");
    },
  },
];

export default function InvitationsPage() {
  const [invitations, setInvitations] = useState<InvitationsTableProps[]>([]);

  useEffect(() => {
    const loadInvitations = async () => {
      const data = await getInvitations();
      setInvitations(data);
    };
    loadInvitations();
  }, []);

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight">Invitations</h2>
        <p className="text-muted-foreground">
          Manage and track user invitations
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card className="p-6">
          <InvitationForm />
        </Card>

        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold">Sent Invitations</h3>
          <DataTable
            columns={columns}
            data={invitations}
            searchKey="email"
          />
        </Card>
      </div>
    </div>
  );
} 