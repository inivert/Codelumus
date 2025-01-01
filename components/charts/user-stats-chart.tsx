"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface UserStatsChartProps {
  data: {
    totalUsers: number;
    activeSubscribers: number;
    cancelledUsers: number;
    neverSubscribed: number;
    monthlyStats: Array<{
      date: string;
      newUsers: number;
    }>;
  };
}

const chartConfig = {
  users: {
    label: "Users",
  },
  newUsers: {
    label: "New Users",
    color: "hsl(var(--chart-1))",
  },
  activeSubscribers: {
    label: "Active Subscribers",
    color: "hsl(var(--chart-2))",
  },
  cancelledUsers: {
    label: "Cancelled Subscriptions",
    color: "hsl(var(--chart-3))",
  },
  neverSubscribed: {
    label: "Never Subscribed",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;

export function UserStatsChart({ data }: UserStatsChartProps) {
  const [activeChart, setActiveChart] = React.useState<"newUsers" | "activeSubscribers" | "cancelledUsers" | "neverSubscribed">("newUsers");

  const chartData = React.useMemo(() => {
    return data.monthlyStats.map(stat => ({
      date: stat.date,
      newUsers: stat.newUsers,
      activeSubscribers: data.activeSubscribers,
      cancelledUsers: data.cancelledUsers,
      neverSubscribed: data.neverSubscribed,
    }));
  }, [data]);

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>User Statistics</CardTitle>
          <CardDescription>
            User growth and subscription status
          </CardDescription>
        </div>
        <div className="flex flex-wrap">
          {(["newUsers", "activeSubscribers", "cancelledUsers", "neverSubscribed"] as const).map((key) => (
            <button
              key={key}
              data-active={activeChart === key}
              className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
              onClick={() => setActiveChart(key)}
            >
              <span className="text-xs text-muted-foreground">
                {chartConfig[key].label}
              </span>
              <span className="text-lg font-bold leading-none sm:text-3xl">
                {key === "newUsers" 
                  ? data.monthlyStats.reduce((acc, curr) => acc + curr.newUsers, 0)
                  : data[key]
                }
              </span>
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value: string) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
              scale="point"
              padding={{ left: 10, right: 10 }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="users"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                />
              }
            />
            <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
} 