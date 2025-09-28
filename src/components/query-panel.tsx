"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Lightbulb, Send, Loader2 } from 'lucide-react';
import type { ViewState } from '@/app/page';
import { sqlResults, docResults, hybridResults, QueryResult } from '@/lib/data';

interface QueryPanelProps {
  setViewState: (state: ViewState) => void;
  setQueryResult: (result: QueryResult | null) => void;
  setQueryMetrics: (metrics: { time: string, cacheStatus: string }) => void;
}

const suggestedQueries = [
  "Show me all Python developers in Engineering",
  "How many employees do we have?",
  "List employees hired this year",
  "Show me performance reviews for engineers hired last year"
];

export default function QueryPanel({ setViewState, setQueryResult, setQueryMetrics }: QueryPanelProps) {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query || isLoading) return;

    setIsLoading(true);
    setViewState('loading');
    setQueryResult(null);

    // Simulate API call and result type determination
    setTimeout(() => {
      let result: QueryResult;
      if (query.toLowerCase().includes('review') || query.toLowerCase().includes('resume')) {
        result = docResults;
      } else if (query.toLowerCase().includes('python')) {
        result = hybridResults;
      } else {
        result = sqlResults;
      }
      
      const isCacheMiss = Math.random() > 0.5;
      const responseTime = (Math.random() * 1.5 + 0.3).toFixed(2);

      setQueryResult(result);
      setQueryMetrics({ time: `${responseTime}s`, cacheStatus: isCacheMiss ? 'cache miss' : 'cache hit' });
      setViewState('results');
      setIsLoading(false);
    }, 2000);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
  };

  return (
    <Card className="sticky top-8">
      <CardHeader>
        <CardTitle>Natural Language Query</CardTitle>
        <CardDescription>Ask a question about your employee data in plain English.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder='e.g., "Top 5 highest paid employees in each department"'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="min-h-[120px] text-base"
            disabled={isLoading}
          />
          <Button type="submit" className="w-full" disabled={!query || isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Submit Query
              </>
            )}
          </Button>
        </form>

        <div className="mt-6">
          <h4 className="flex items-center text-sm font-semibold mb-2">
            <Lightbulb className="mr-2 h-4 w-4 text-yellow-400" />
            Suggestions
          </h4>
          <div className="flex flex-wrap gap-2">
            {suggestedQueries.map((suggestion) => (
              <Button
                key={suggestion}
                variant="outline"
                size="sm"
                className="text-xs h-auto py-1 px-2"
                onClick={() => handleSuggestionClick(suggestion)}
                disabled={isLoading}
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
