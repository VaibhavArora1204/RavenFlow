# RavenFlow

AI-powered semantic retrieval and retrieval-augmented generation (RAG) platform built with FastAPI, Celery, Redis, PostgreSQL, Qdrant, and Groq LLM APIs.

RavenFlow ingests documents asynchronously, transforms them into semantic vector embeddings, stores them in a vector database, and generates grounded AI responses using contextual retrieval.

---

# Features

- Async document ingestion pipeline
- Semantic vector search
- Retrieval-Augmented Generation (RAG)
- FastAPI backend
- Celery background workers
- Redis task queue
- PostgreSQL document storage
- Qdrant vector database
- Groq LLM integration
- Modern React frontend
- Dockerized infrastructure
- Structured logging
- Health monitoring endpoints
- Modular backend architecture

---

# Architecture

```text
Frontend (React + Vite)
        ↓
FastAPI Backend
        ↓
Redis Queue
        ↓
Celery Workers
        ↓
Embedding Pipeline
        ↓
Qdrant Vector DB
        ↓
Groq LLM API



# Run RavenFlow

## Terminal 1

```bash
cd ravenflow

docker compose up -d
```

---

## Terminal 2

```bash
cd ravenflow

source .venv/Scripts/activate

python -m uvicorn app.main:app --reload
```

---

## Terminal 3

```bash
cd ravenflow

source .venv/Scripts/activate

celery -A app.workers.ingestion_worker worker --pool=solo --loglevel=info
```

---

## Terminal 4

```bash
cd ravenflow/frontend

npm install

npm run dev
```

---

# URLs

```text
Frontend:
http://localhost:5173

Backend:
http://127.0.0.1:8000

Swagger Docs:
http://127.0.0.1:8000/docs
```

---

# Stop Services

## Stop frontend/backend/worker

```text
CTRL + C
```

---

## Stop Docker

```bash
docker compose down
```
