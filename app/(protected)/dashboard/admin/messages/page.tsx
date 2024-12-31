import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function MessagesPage() {
  const session = await auth();
  
  if (!session?.user) {
    return <div>Not authenticated</div>;
  }

  try {
    // Query all support messages with user information using Prisma
    const messages = await prisma.supportMessage.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return (
      <div className="container mx-auto py-10">
        <h1 className="mb-6 text-2xl font-bold">Support Messages</h1>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Website</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Message</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {messages.map((msg) => (
                <TableRow key={msg.id}>
                  <TableCell>
                    {new Date(msg.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div>{msg.user?.name || "N/A"}</div>
                    <div className="text-sm text-gray-500">{msg.user?.email}</div>
                  </TableCell>
                  <TableCell>{msg.website}</TableCell>
                  <TableCell>{msg.subject}</TableCell>
                  <TableCell className="max-w-md">
                    <div className="truncate">{msg.message}</div>
                  </TableCell>
                </TableRow>
              ))}
              {messages.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="py-4 text-center">
                    No support messages found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error in MessagesPage:", error);
    return <div>An unexpected error occurred</div>;
  }
} 