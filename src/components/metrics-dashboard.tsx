"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Progress } from "@/components/ui/progress";
import { Table, Columns, Link, Users, BarChart2, Zap } from "lucide-react";
import { discoveredSchema, chartData, chartConfig } from "@/lib/data";

export default function MetricsDashboard() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Table /> Schema Stats</CardTitle>
          <CardDescription>Overview of the discovered schema.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-3 gap-4 text-center">
            <div>
                <p className="text-2xl font-bold">{discoveredSchema.info.tables}</p>
                <p className="text-xs text-muted-foreground">Tables</p>
            </div>
            <div>
                <p className="text-2xl font-bold">{discoveredSchema.info.columns}</p>
                <p className="text-xs text-muted-foreground">Columns</p>
            </div>
            <div>
                <p className="text-2xl font-bold">{discoveredSchema.info.relationships}</p>
                <p className="text-xs text-muted-foreground">Relationships</p>
            </div>
        </CardContent>
      </Card>
      
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><BarChart2 /> Query Performance</CardTitle>
          <CardDescription>Average response time over the last hour.</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="time"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis unit="ms" />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Bar dataKey="responseTime" fill="var(--color-desktop)" radius={4} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Zap /> Cache Hit Rate</CardTitle>
          <CardDescription>Percentage of queries served from cache.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
           <div className="flex justify-between items-baseline">
             <p className="text-2xl font-bold">78%</p>
             <p className="text-sm text-muted-foreground">780/1000</p>
           </div>
          <Progress value={78} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Users /> Active Connections</CardTitle>
          <CardDescription>Current database connections in use.</CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-3xl font-bold">7<span className="text-lg text-muted-foreground">/10</span></p>
        </CardContent>
      </Card>

       <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><FileText /> Indexed Documents</CardTitle>
          <CardDescription>Total documents processed and indexed.</CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-3xl font-bold">1,245</p>
        </CardContent>
      </Card>

    </div>
  );
}
