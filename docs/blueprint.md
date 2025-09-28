# **App Name**: EmpowerAI: Employee Data Query Engine

## Core Features:

- Database Connection & Schema Discovery: Connect to various database types and automatically discover the schema (tables, columns, relationships) without hardcoding, handling naming variations using AI tools.
- Document Ingestion: Upload and process employee-related documents (resumes, reviews, contracts) of various formats, with intelligent chunking, embedding generation and storing for fast retrieval.
- Natural Language Query Processing: Process natural language queries, classify query type (SQL vs document search vs hybrid), map natural language to schema using AI, optimize SQL queries, and cache frequent queries.
- Results Display: Display query results in a user-friendly format (tables for SQL data, cards for documents), with source attribution, pagination for large results, and export functionality.
- Ingestion Status: Display the document ingestion status, including a success count, errors encountered if any, and an estimated time to completion, with clear success/error states in UI
- Dynamic Schema Visualization: Visually represent the discovered database schema (tables, columns, relationships) as a tree or graph.
- Performance Monitoring: Log query performance metrics (response time, cache hit rate) and display them in a dashboard.

## Style Guidelines:

- Primary color: Deep blue (#34495E), evoking trust, reliability, and professionalism.
- Background color: Light gray (#F0F3F4), for a clean and modern interface.
- Accent color: Teal (#2ABC9B), used for interactive elements, progress indicators, and highlights, providing a touch of innovation and clarity.
- Body and headline font: 'Inter', a grotesque-style sans-serif for a neutral and objective feel.
- Code font: 'Source Code Pro' for displaying configuration files
- Use minimalist icons from a consistent set (e.g., FontAwesome) to represent database tables, document types, and actions.
- Use a responsive, grid-based layout to ensure the interface adapts to different screen sizes.