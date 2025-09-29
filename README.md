# AI Engineering NLP Query Engine

## Overview
This project provides a web-based interface for **data ingestion, schema discovery, and querying** of structured and unstructured data.  
It supports SQL queries, document search, and hybrid queries combining both. The system is modular, scalable, and uses **FastAPI** for the backend and **React** for the frontend.

---

## Features
- **Data Ingestion**
  - Connect to SQL databases (PostgreSQL/MySQL/SQLite)
  - Upload multiple documents (PDF, CSV, TXT)
  - Automatic schema discovery
  - Track ingestion progress and status
- **Query Interface**
  - Execute SQL queries
  - Search documents
  - Hybrid queries combining SQL and document search
  - Query result caching for faster repeated queries
- **Backend**
  - FastAPI REST API
  - Modular services for schema discovery, document processing, and query execution
  - PostgreSQL/MySQL database support
- **Frontend**
  - React-based user interface
  - Components: DatabaseConnector, DocumentUploader, QueryPanel, ResultsView
  - Displays results clearly with export functionality

---

## Project Structure
project/
├── backend/
│ ├── api/
│ │ ├── routes/
│ │ │ ├── ingestion.py
│ │ │ ├── query.py
│ │ │ └── schema.py
│ │ ├── services/
│ │ │ ├── schema_discovery.py
│ │ │ ├── document_processor.py
│ │ │ └── query_engine.py
│ │ └── models/
│ └── main.py
├── frontend/
│ ├── src/
│ │ ├── components/
│ │ │ ├── DatabaseConnector.js
│ │ │ ├── DocumentUploader.js
│ │ │ ├── QueryPanel.js
│ │ │ └── ResultsView.js
│ │ └── App.js
│ └── public/
├── config.yml
├── docker-compose.yml
├── requirements.txt
├── package.json
└── README.md


---

## Setup Instructions

### Backend
1. **Create virtual environment**

cd backend
python -m venv venv
.\venv\Scripts\activate  # Windows
# or
source venv/bin/activate  # Mac/Linux

2. Install dependencies
pip install -r requirements.txt

3.Configure database
Edit config.yml:
database:
  connection_string: "sqlite:///./app.db" # or PostgreSQL/MySQL URL
  pool_size: 10
embeddings:
  model: "sentence-transformers/all-MiniLM-L6-v2"
  batch_size: 32
cache:
  ttl_seconds: 300
  max_size: 1000

4.Run backend server
uvicorn main:app --reload

Frontend

1. Install dependencies

cd frontend
npm install


2.Run React app

npm start
Usage

Connect to your database using the DatabaseConnector component.

Upload documents (PDF, CSV, TXT) through DocumentUploader.

Execute queries via QueryPanel:

SQL queries → tabular results

Document queries → relevant document snippets

Hybrid queries → combined results

Export results as CSV or JSON.

Monitor ingestion and query cache status.

Testing

Unit tests for services and routes (mocked database and schemas)

Integration tests to verify end-to-end functionality

pytest backend/tests

Performance & Optimization

Uses query caching for repeated queries

Batch processing for document ingestion

Async operations for concurrent queries

Connection pooling for efficient database access

Notes

No authentication implemented (demo purposes)

Handles basic JOINs for multi-table queries

Max file size per document: 10MB

Works on 8GB RAM machine
