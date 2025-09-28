"use client"

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, Database, Loader2, AlertCircle } from 'lucide-react';
import SchemaVisualizer from './schema-visualizer';
import { discoveredSchema, SchemaInfo } from '@/lib/data';

const formSchema = z.object({
  connectionString: z.string().min(10, {
    message: "Connection string must be at least 10 characters.",
  }).refine(s => s.includes('://'), 'Invalid connection string format.'),
});

type ConnectionState = 'idle' | 'connecting' | 'success' | 'error';

export default function DatabaseConnector() {
  const [connectionState, setConnectionState] = useState<ConnectionState>('idle');
  const [schemaInfo, setSchemaInfo] = useState<SchemaInfo | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      connectionString: "postgresql://user:pass@localhost:5432/company_db",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setConnectionState('connecting');
    setSchemaInfo(null);
    console.log(values);

    setTimeout(() => {
      // Simulate API call
      if (values.connectionString.includes('fail')) {
        setConnectionState('error');
      } else {
        setConnectionState('success');
        setSchemaInfo(discoveredSchema.info);
      }
    }, 2000);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Database /> Database Connection</CardTitle>
        <CardDescription>Connect to your database to automatically discover its schema.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="connectionString"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Connection String</FormLabel>
                  <FormControl>
                    <Input placeholder="postgresql://user:pass@host:port/dbname" {...field} className="font-code" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={connectionState === 'connecting'}>
              {connectionState === 'connecting' ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : 'Connect & Analyze'}
            </Button>
          </form>
        </Form>

        <div className="mt-6">
          {connectionState === 'success' && schemaInfo && (
            <Alert variant="default" className="bg-accent/20 border-accent">
              <CheckCircle className="h-4 w-4 text-accent-foreground" />
              <AlertTitle>Connection Successful!</AlertTitle>
              <AlertDescription>
                Discovered {schemaInfo.tables} tables, {schemaInfo.columns} columns, and {schemaInfo.relationships} relationships.
              </AlertDescription>
            </Alert>
          )}
          {connectionState === 'error' && (
             <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Connection Failed</AlertTitle>
                <AlertDescription>
                  Could not connect to the database. Please check your connection string and credentials.
                </AlertDescription>
              </Alert>
          )}
        </div>
        
        {connectionState === 'success' && schemaInfo && (
          <div className="mt-6">
            <SchemaVisualizer schema={discoveredSchema} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
