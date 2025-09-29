# AI Engineering — NLP Query Engine

Demo Video link : https://www.youtube.com/watch?v=j9owdX_nuIM

> **A sleek, web-based platform for ingesting, exploring, and querying structured and unstructured data — combining SQL power with semantic document search.**

---

## 🚀 Quick Overview

This project provides a modern web interface and backend to ingest data (databases + documents), automatically discover schemas, and run SQL, document, or hybrid queries that combine both sources. Built for extensibility and performance using **FastAPI** on the backend and **React** on the frontend.

---

## ✨ Highlights

* Unified query experience: run SQL, semantic document search, or hybrid queries.
* Automatic schema discovery for fast onboarding of new data sources.
* Modular backend services for ingestion, processing, and query execution.
* Query caching, batch ingestion, and connection pooling for production-ready performance.
* Exportable results (CSV / JSON) and an intuitive UI for monitoring ingestion progress.

---

## 📦 Features (User-Facing)

**Data Ingestion**

* Connect to SQL databases: PostgreSQL, MySQL, SQLite.
* Upload multiple files: PDF, CSV, TXT (max file size 10MB per doc).
* Automatic schema discovery, column type inference, and sample preview.
* Live ingestion progress and status per source.

**Query Interface**

* Execute raw SQL with syntax highlighting and result table.
* Document search: enter natural-language queries and get ranked snippets.
* Hybrid queries: combine SQL results with semantically retrieved document context.
* Caching for repeated queries (TTL configurable).
* Export results as CSV or JSON.

**Admin / Monitoring**

* Ingestion logs and failure traces.
* Cache stats and hit/miss metrics.
* Basic resource usage dashboard.

---

## 🧩 Project Structure

```
project/
├── backend/
│   ├── api/
│   │   ├── routes/
│   │   │   ├── ingestion.py
│   │   │   ├── query.py
│   │   │   └── schema.py
│   │   ├── services/
│   │   │   ├── schema_discovery.py
│   │   │   ├── document_processor.py
│   │   │   └── query_engine.py
│   │   └── models/
│   └── main.py
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── DatabaseConnector.js
│   │   │   ├── DocumentUploader.js
│   │   │   ├── QueryPanel.js
│   │   │   └── ResultsView.js
│   │   └── App.js
│   └── public/
├── config.yml
├── docker-compose.yml
├── requirements.txt
├── package.json
└── README.md
```

---

## ⚙️ Setup (Developer)

**Backend**

```bash
cd backend
python -m venv venv
# Windows
.\venv\Scripts\activate
# macOS / Linux
source venv/bin/activate
pip install -r requirements.txt
# Edit config.yml for your database and embeddings model
uvicorn main:app --reload
```

**Frontend**

```bash
cd frontend
npm install
npm start
```

**Recommended config snippet (config.yml)**

```yaml
database:
  connection_string: "sqlite:///./app.db" # or your PostgreSQL/MySQL URL
  pool_size: 10
embeddings:
  model: "sentence-transformers/all-MiniLM-L6-v2"
  batch_size: 32
cache:
  ttl_seconds: 300
  max_size: 1000
```

---

## 🧠 Architecture & Design Notes

* **Microservices-alike modules**: ingestion, schema discovery, embedding/document processing, query execution. Each component has clear interfaces making it easy to swap implementations (e.g., replace embedding model).
* **Asynchronous processing**: heavy tasks (embedding extraction, file parsing) run in background workers (Celery / FastAPI background tasks) and update ingestion status in the DB.
* **Query execution**: SQL queries run against the connected RDBMS; semantic document retrieval uses vector search over document embeddings. Hybrid queries join SQL table results with nearest-neighbour document contexts.
* **Caching**: LRU or Redis-backed cache for query results, configurable TTL.
* **Security**: demo build has no auth; for production add OAuth2 / API keys + RBAC.

---

## 🎨 Frontend / UX Recommendations

* Use a clean, card-based layout: left panel for data sources & ingestion, middle for query composer, right panel for results.
* QueryPanel tabs: **SQL**, **Documents**, **Hybrid** (switchable). Provide query history and saved queries.
* ResultsView: show tabular results, and a second tab with document snippets and highlight matching tokens.
* Add small visual cues: ingestion progress bar, database connection status badges, and cache hit/miss indicator.

---

## ✅ Testing

* Unit tests for services and API routes using pytest and test DB fixtures.
* Integration tests using a test container (Docker Compose) for DB + app.
* Run all tests:

```bash
pytest backend/tests
```

---

## 🔧 Performance & Optimization Tips

* Use connection pooling for DB access and chunked queries for large result sets.
* Batch-embed documents to reduce model calls.
* Use Redis for cache and vector index (or a specialized vector DB for scale).
* Limit file size (10MB) and implement streaming parsing for large CSVs.

---

## ♻️ Limitations & Notes

* **No auth** in demo mode — add production-grade authentication before public deployment.
* Handles basic JOINs and typical SQL; complex distributed queries may need additional planning.
* Designed to run comfortably on an 8GB RAM machine for demo and small workloads.

---

## ✨ Future Work

* Add role-based access control and multi-tenant support.
* Replace simple vector store with Milvus / Pinecone for scale.
* Add realtime collaborative query editing and live query explain plans.

---

## 🙌 Contributing

Contributions are welcome! Please open issues for feature requests or bug reports and submit PRs against `develop`.

---

