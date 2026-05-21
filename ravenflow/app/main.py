from fastapi import Depends, FastAPI # type: ignore
from sqlalchemy.orm import Session # pyright: ignore[reportMissingImports]

from app.services.vector_service import create_collection
from app.db.database import Base, engine
from app.db.session import get_db
from app.models.document import Document
from app.schemas.document_schema import DocumentCreate
from app.workers.ingestion_worker import ingest_document
from app.models.chunk import Chunk
from app.schemas.search_schema import SearchQuery
from app.services.embedding_service import generate_embedding
from app.services.vector_service import search_similar_chunks
from app.services.llm_service import generate_answer
from fastapi.middleware.cors import CORSMiddleware

Base.metadata.create_all(bind=engine)
create_collection()

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "RavenFlow API running"}


@app.post("/documents")
def create_document(
    document: DocumentCreate,
    db: Session = Depends(get_db)
):
    new_document = Document(
        source_url=document.source_url
    )

    db.add(new_document)

    db.commit()

    db.refresh(new_document)

    ingest_document.delay(new_document.id)

    return {
        "id": new_document.id,
        "source_url": new_document.source_url,
        "status": new_document.status
    }


@app.get("/documents/{document_id}")
def get_document(
    document_id: int,
    db: Session = Depends(get_db)
):
    document = (
        db.query(Document)
        .filter(Document.id == document_id)
        .first()
    )

    if not document:
        return {
            "error": "Document not found"
        }

    return {
        "id": document.id,
        "source_url": document.source_url,
        "status": document.status,
        "raw_text": document.raw_text
    }


@app.post("/search")
def semantic_search(
    search: SearchQuery
):

    query_embedding = generate_embedding(
        search.query
    )

    results = search_similar_chunks(
        query_embedding
    )

    context_chunks = []

    for result in results:

        context_chunks.append(
            result.payload["content"]
        )

    context = "\n\n".join(context_chunks)

    answer = generate_answer(
        search.query,
        context
    )

    return {
        "query": search.query,
        "answer": answer,
        "sources": context_chunks
    }