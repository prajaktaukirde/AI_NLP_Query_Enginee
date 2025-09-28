// src/ai/flows/nl-query-clarification.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow for clarifying ambiguous natural language queries, especially when multiple matches are found (e.g., multiple employees with the same name).
 *
 * @fileOverview This file defines a Genkit flow for clarifying ambiguous natural language queries, especially when multiple matches are found (e.g., multiple employees with the same name).
 * - nlQueryClarification - A function that takes a natural language query and a list of possible matches and returns a clarified query or follow-up questions.
 * - NLQueryClarificationInput - The input type for the nlQueryClarification function.
 * - NLQueryClarificationOutput - The return type for the nlQueryClarification function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const NLQueryClarificationInputSchema = z.object({
  query: z.string().describe('The original natural language query.'),
  possibleMatches: z.array(
    z.object({
      id: z.string().describe('Unique identifier for the match.'),
      name: z.string().describe('Name of the matched entity.'),
      context: z.string().describe('Additional context for the match (e.g., department, role).'),
    })
  ).describe('A list of possible matches with their context.'),
});
export type NLQueryClarificationInput = z.infer<typeof NLQueryClarificationInputSchema>;

const NLQueryClarificationOutputSchema = z.object({
  clarifiedQuery: z.string().optional().describe('The clarified natural language query, if applicable.'),
  followUpQuestions: z.array(z.string()).optional().describe('A list of follow-up questions to ask the user to clarify the query.'),
  possibleMatchesWithContext: z.array(
    z.object({
      id: z.string().describe('Unique identifier for the match.'),
      name: z.string().describe('Name of the matched entity.'),
      context: z.string().describe('Additional context for the match (e.g., department, role).'),
    })
  ).optional().describe('A list of possible matches to show to the user with additional context.'),
});
export type NLQueryClarificationOutput = z.infer<typeof NLQueryClarificationOutputSchema>;

export async function nlQueryClarification(input: NLQueryClarificationInput): Promise<NLQueryClarificationOutput> {
  return nlQueryClarificationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'nlQueryClarificationPrompt',
  input: {schema: NLQueryClarificationInputSchema},
  output: {schema: NLQueryClarificationOutputSchema},
  prompt: `You are an AI assistant helping to clarify ambiguous natural language queries related to employee data.

The user's query is: "{{query}}"

There are multiple possible matches for this query. Here are the possible matches with their context:
{{#each possibleMatches}}
- Name: {{name}}, Context: {{context}}, ID: {{id}}
{{/each}}

Based on the query and the possible matches, you should either:
1.  Return a clarified query if you can confidently determine the user's intent.
2.  Return a list of follow-up questions to ask the user to clarify the query.
3.  Return the list of possible matches with context to display to the user, so the user can select the correct match.

Choose the best approach and provide the appropriate output.

Output in JSON format. If returning followUpQuestions or possibleMatchesWithContext, do not return a clarifiedQuery. Only return one output.
`,
});

const nlQueryClarificationFlow = ai.defineFlow(
  {
    name: 'nlQueryClarificationFlow',
    inputSchema: NLQueryClarificationInputSchema,
    outputSchema: NLQueryClarificationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
