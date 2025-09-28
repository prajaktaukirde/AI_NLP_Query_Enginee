'use server';

/**
 * @fileOverview Provides dynamic schema suggestions for a given database schema.
 *
 * - suggestQueries - A function that suggests relevant queries based on the database schema.
 * - SuggestQueriesInput - The input type for the suggestQueries function.
 * - SuggestQueriesOutput - The return type for the suggestQueries function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestQueriesInputSchema = z.object({
  schemaDescription: z
    .string()
    .describe(
      'A detailed description of the database schema, including table names, column names, and relationships.'
    ),
});
export type SuggestQueriesInput = z.infer<typeof SuggestQueriesInputSchema>;

const SuggestQueriesOutputSchema = z.object({
  suggestedQueries: z
    .array(z.string())
    .describe('An array of suggested natural language queries based on the schema.'),
});
export type SuggestQueriesOutput = z.infer<typeof SuggestQueriesOutputSchema>;

export async function suggestQueries(input: SuggestQueriesInput): Promise<SuggestQueriesOutput> {
  return suggestQueriesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestQueriesPrompt',
  input: {schema: SuggestQueriesInputSchema},
  output: {schema: SuggestQueriesOutputSchema},
  prompt: `You are an AI assistant helping users to explore a database.
  Given the following database schema description, suggest a list of 5 possible natural language queries that a user might ask to gain insights from the database. Consider common questions and analytical queries.

  Schema Description: {{{schemaDescription}}}

  Output the suggested queries as a numbered list.
  `,
});

const suggestQueriesFlow = ai.defineFlow(
  {
    name: 'suggestQueriesFlow',
    inputSchema: SuggestQueriesInputSchema,
    outputSchema: SuggestQueriesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
