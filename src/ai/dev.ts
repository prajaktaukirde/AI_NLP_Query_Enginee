import { config } from 'dotenv';
config();

import '@/ai/flows/nl-query-clarification.ts';
import '@/ai/flows/schema-understanding-for-queries.ts';
import '@/ai/flows/dynamic-schema-suggestion.ts';