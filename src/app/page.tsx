"use client";

import { useState } from 'react';
import Header from "@/components/header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DatabaseConnector from '@/components/database-connector';
import DocumentUploader from '@/components/document-uploader';
import QueryPanel from '@/components/query-panel';
import ResultsView from '@/components/results-view';
import MetricsDashboard from '@/components/metrics-dashboard';
import type { QueryResult } from '@/lib/data';

export type ViewState = 'initial' | 'loading' | 'results';

export default function Home() {
  const [viewState, setViewState] = useState<ViewState>('initial');
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null);
  const [queryMetrics, setQueryMetrics] = useState({ time: '0s', cacheStatus: 'N/A' });

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow p-4 md:p-8">
        <Tabs defaultValue="query" className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-2xl mx-auto">
            <TabsTrigger value="query">Query Data</TabsTrigger>
            <TabsTrigger value="connect">Connect Data</TabsTrigger>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          </TabsList>

          <TabsContent value="query" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              <QueryPanel setViewState={setViewState} setQueryResult={setQueryResult} setQueryMetrics={setQueryMetrics} />
              <ResultsView viewState={viewState} result={queryResult} metrics={queryMetrics} />
            </div>
          </TabsContent>

          <TabsContent value="connect" className="mt-6">
            <Tabs defaultValue="database" className="w-full max-w-4xl mx-auto">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="database">Database</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
              </TabsList>
              <TabsContent value="database" className="mt-4">
                <DatabaseConnector />
              </TabsContent>
              <TabsContent value="documents" className="mt-4">
                <DocumentUploader />
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="dashboard" className="mt-6">
            <MetricsDashboard />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
