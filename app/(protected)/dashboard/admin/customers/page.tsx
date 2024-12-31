import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CustomersPage() {
  const supabase = createServerComponentClient({ cookies });

  // Query users without active subscriptions
  const { data: customers, error } = await supabase
    .from("users")
    .select("id, name, email")
    .is("stripe_subscription_id", null);

  if (error) {
    console.error("Error fetching customers:", error);
    return <div>Error loading customers</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Customers Without Active Subscriptions</h1>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>{customer.name || "N/A"}</TableCell>
                <TableCell>{customer.email || "N/A"}</TableCell>
              </TableRow>
            ))}
            {customers.length === 0 && (
              <TableRow>
                <TableCell colSpan={2} className="text-center py-4">
                  No customers found without active subscriptions
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 