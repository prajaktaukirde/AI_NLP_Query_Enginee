'use server';

/**
 * @fileOverview A flow that understands natural language queries and maps them to the database schema.
 *
 * - mapNaturalLanguageToSchema - A function that takes a natural language query and a database schema and returns a mapping of the query to the schema.
 * - MapNaturalLanguageToSchemaInput - The input type for the mapNaturalLanguageToSchema function.
 * - MapNaturalLanguageToSchemaOutput - The return type for the mapNaturalLanguageToSchema function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MapNaturalLanguageToSchemaInputSchema = z.object({
  query: z.string().describe('The natural language query.'),
  schema: z.string().describe('The database schema.'),
});
export type MapNaturalLanguageToSchemaInput = z.infer<typeof MapNaturalLanguageToSchemaInputSchema>;

const MapNaturalLanguageToSchemaOutputSchema = z.object({
  mapping: z.record(z.string(), z.string()).describe('A mapping of the query to the schema.'),
});
export type MapNaturalLanguageToSchemaOutput = z.infer<typeof MapNaturalLanguageToSchemaOutputSchema>;

export async function mapNaturalLanguageToSchema(input: MapNaturalLanguageToSchemaInput): Promise<MapNaturalLanguageToSchemaOutput> {
  return mapNaturalLanguageToSchemaFlow(input);
}

const prompt = ai.definePrompt({
  name: 'mapNaturalLanguageToSchemaPrompt',
  input: {schema: MapNaturalLanguageToSchemaInputSchema},
  output: {schema: MapNaturalLanguageToSchemaOutputSchema},
  prompt: `You are a database expert. Given a natural language query and a database schema, you will map the query to the schema.

Query: {{{query}}}
Schema: {{{schema}}}

Return a JSON object where each key is a term from the query, and each value is the corresponding column name from the schema. If a term does not map to any column, the value should be null.

Example:
Query: Show me the salary for John Smith
Schema: { employees: { name: string, salary: number } }
Output: { \"salary\": \"employees.salary\", \"John Smith\": \"employees.name\" }

Output:
`,
});

const mapNaturalLanguageToSchemaFlow = ai.defineFlow(
  {
    name: 'mapNaturalLanguageToSchemaFlow',
    inputSchema: MapNaturalLanguageToSchemaInputSchema,
    outputSchema: MapNaturalLanguageToSchemaOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
