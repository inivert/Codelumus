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
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function MessagesPage() {
  const session = await auth();
  
  if (!session?.user) {
    return <div>Not authenticated</div>;
  }

  try {
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
      <div className="container mx-auto space-y-6 py-10">
        <h1 className="text-2xl font-bold">Support Messages</h1>
        
        {/* Mobile View */}
        <div className="grid gap-4 md:hidden">
          {messages.map((msg) => (
            <Card key={msg.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-base">
                  <span>{msg.subject}</span>
                  <span className="text-sm text-muted-foreground">
                    {new Date(msg.createdAt).toLocaleDateString()}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2">
                <div className="grid gap-1">
                  <div className="text-sm font-medium">From</div>
                  <div className="text-sm">
                    <div>{msg.user?.name || "N/A"}</div>
                    <div className="text-muted-foreground">{msg.user?.email}</div>
                  </div>
                </div>
                <div className="grid gap-1">
                  <div className="text-sm font-medium">Website</div>
                  <div className="text-sm">{msg.website}</div>
                </div>
                <div className="grid gap-1">
                  <div className="text-sm font-medium">Message</div>
                  <div className="text-sm">{msg.message}</div>
                </div>
              </CardContent>
            </Card>
          ))}
          {messages.length === 0 && (
            <Card>
              <CardContent className="py-4 text-center">
                No support messages found
              </CardContent>
            </Card>
          )}
        </div>

        {/* Desktop View */}
        <div className="hidden rounded-md border md:block">
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
                    <div className="text-sm text-muted-foreground">{msg.user?.email}</div>
                  </TableCell>
                  <TableCell>{msg.website}</TableCell>
                  <TableCell>{msg.subject}</TableCell>
                  <TableCell className="max-w-md">
                    <div className="line-clamp-2">{msg.message}</div>
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