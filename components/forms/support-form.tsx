"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Icons } from "../shared/icons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { useEffect } from "react";
import { Phone, MessageSquare } from "lucide-react";

const formSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  website: z.string().min(1, "Website name is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type SupportMessage = {
  id: string;
  subject: string;
  website: string;
  message: string;
  createdAt: string;
};

export function SupportForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);
  const [messages, setMessages] = useState<SupportMessage[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: "",
      website: "",
      message: "",
    },
  });

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setIsLoadingMessages(true);
        const response = await fetch("/api/support");
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Failed to fetch messages");
        }
        const data = await response.json();
        setMessages(data.messages);
      } catch (error) {
        console.error("Error fetching messages:", error);
        toast.error("Failed to load previous messages");
      } finally {
        setIsLoadingMessages(false);
      }
    };

    fetchMessages();
  }, []);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const response = await fetch("/api/support", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to send support request");
      }

      const data = await response.json();
      setMessages(prev => [data.message, ...prev]);
      toast.success("Support request sent successfully");
      form.reset();
    } catch (error) {
      console.error("Error sending support request:", error);
      toast.error(error instanceof Error ? error.message : "Failed to send support request");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subject</FormLabel>
                <FormControl>
                  <Input placeholder="Brief description of your issue" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your website name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Please describe your issue in detail"
                    className="min-h-[200px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Send Message
          </Button>
        </form>
      </Form>

      <Card>
        <CardHeader>
          <CardTitle>Previous Messages</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoadingMessages ? (
            <div className="flex items-center justify-center py-8">
              <Icons.spinner className="h-8 w-8 animate-spin" />
            </div>
          ) : messages.length === 0 ? (
            <p className="text-sm text-muted-foreground">No messages yet</p>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className="rounded-lg border p-4 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{msg.subject}</h4>
                  <span className="text-sm text-muted-foreground">
                    {formatDate(msg.createdAt)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Website: {msg.website}
                </p>
                <p className="text-sm">{msg.message}</p>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <div className="md:col-span-2 mt-8 rounded-lg border bg-card p-6">
        <h3 className="text-lg font-semibold mb-4">Need Immediate Assistance?</h3>
        <p className="text-muted-foreground mb-6">
          For faster response, you can reach out directly through phone or WhatsApp. Don't forget to include screenshots or images to help explain your needs better.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href="tel:+14013476461"
            className="flex flex-1 items-center justify-center gap-3 px-6 py-3 rounded-lg border bg-background hover:bg-accent/50 hover:border-primary/50 transition-all duration-200"
          >
            <div className="flex items-center justify-center size-8 rounded-full bg-primary/10">
              <Phone className="h-4 w-4 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Call Us</span>
              <span className="font-medium">+1 (401) 347-6461</span>
            </div>
          </a>
          <a
            href="https://wa.me/14013476461?text=Hi,%20I%20need%20help%20with%20my%20website.%20Here%20are%20some%20details%20about%20my%20request:"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-3 px-6 py-3 rounded-lg border bg-background hover:bg-[#25D366]/10 hover:border-[#25D366]/50 transition-all duration-200"
          >
            <div className="flex items-center justify-center size-8 rounded-full bg-[#25D366]/10">
              <MessageSquare className="h-4 w-4 text-[#25D366]" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Chat with Us</span>
              <span className="font-medium">WhatsApp Support</span>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
} 