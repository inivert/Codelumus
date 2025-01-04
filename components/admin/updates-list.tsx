"use client";

import { formatDistanceToNow } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface Update {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  createdBy: {
    name: string | null;
    email: string | null;
  };
  targetUser?: {
    name: string | null;
    email: string | null;
  } | null;
}

interface UpdatesListProps {
  updates: Update[];
}

export function UpdatesList({ updates }: UpdatesListProps) {
  if (updates.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-4">
        No updates sent yet
      </div>
    );
  }

  return (
    <ScrollArea className="h-[400px] pr-4">
      <div className="space-y-4">
        {updates.map((update) => (
          <div
            key={update.id}
            className="border rounded-lg p-4 space-y-2"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <h3 className="font-medium">{update.title}</h3>
                {update.targetUser ? (
                  <Badge variant="secondary" className="mt-1">
                    Sent to: {update.targetUser.name || update.targetUser.email}
                  </Badge>
                ) : (
                  <Badge variant="outline" className="mt-1">
                    Sent to all users
                  </Badge>
                )}
              </div>
              <span className="text-xs text-muted-foreground shrink-0">
                {formatDistanceToNow(new Date(update.createdAt), { addSuffix: true })}
              </span>
            </div>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {update.content}
            </p>
            <div className="text-xs text-muted-foreground">
              Sent by: {update.createdBy.name || update.createdBy.email || "Unknown"}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
} 