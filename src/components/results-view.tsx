"use client";

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { FileText, Table as TableIcon, Activity, CornerDownLeft, Download, Database, ChevronLeft, ChevronRight } from 'lucide-react';
import type { ViewState } from '@/app/page';
import type { QueryResult } from '@/lib/data';
import { Badge } from './ui/badge';

interface ResultsViewProps {
  viewState: ViewState;
  result: QueryResult | null;
  metrics: { time: string, cacheStatus: string };
}

const ITEMS_PER_PAGE = 5;

const LoadingSkeleton = () => (
  <Card>
    <CardHeader>
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </CardHeader>
    <CardContent className="space-y-4">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
    </CardContent>
    <CardFooter>
        <Skeleton className="h-6 w-1/4" />
    </CardFooter>
  </Card>
);

const InitialState = () => (
  <Card className="flex flex-col items-center justify-center text-center p-8 min-h-[400px]">
    <CornerDownLeft className="w-16 h-16 text-muted-foreground/50 mb-4" />
    <CardTitle>Ready for your query</CardTitle>
    <CardDescription className="mt-2">
      Enter a query on the left to see results here.
    </CardDescription>
  </Card>
);

const SQLResults = ({ data }: { data: Record<string, any>[] }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const headers = useMemo(() => (data.length > 0 ? Object.keys(data[0]) : []), [data]);
  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return data.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [data, currentPage]);

  return (
    <>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {headers.map(header => <TableHead key={header}>{header}</TableHead>)}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {headers.map(header => (
                  <TableCell key={header}>{String(row[header])}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-end space-x-2 py-4">
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </>
  );
};

const DocumentResults = ({ data }: { data: Record<string, any>[] }) => (
  <div className="space-y-4">
    {data.map((doc, index) => (
      <Card key={index} className="bg-secondary/50">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" />
            {doc.source}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm" dangerouslySetInnerHTML={{ __html: doc.content }}></p>
        </CardContent>
      </Card>
    ))}
  </div>
);

export default function ResultsView({ viewState, result, metrics }: ResultsViewProps) {
  if (viewState === 'initial') {
    return <InitialState />;
  }
  if (viewState === 'loading') {
    return <LoadingSkeleton />;
  }
  if (viewState === 'results' && result) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Query Results
            <Badge variant="outline">{result.type}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {result.sqlData && result.sqlData.length > 0 && (
            <div className="mb-6">
              <h3 className="flex items-center gap-2 font-semibold mb-2"><Database className="w-5 h-5 text-primary"/> Database Results</h3>
              <SQLResults data={result.sqlData} />
            </div>
          )}
          {result.docData && result.docData.length > 0 && (
            <div>
              <h3 className="flex items-center gap-2 font-semibold mb-2"><FileText className="w-5 h-5 text-primary"/> Document Results</h3>
              <DocumentResults data={result.docData} />
            </div>
          )}
           {(!result.sqlData || result.sqlData.length === 0) && (!result.docData || result.docData.length === 0) && (
             <p className="text-muted-foreground">No results found.</p>
           )}
        </CardContent>
        <CardFooter className="flex-wrap justify-between gap-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Activity className="w-4 h-4" />
                <span>Query took {metrics.time} ({metrics.cacheStatus})</span>
            </div>
            <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4"/>
                Export
            </Button>
        </CardFooter>
      </Card>
    );
  }
  return <InitialState />;
}
