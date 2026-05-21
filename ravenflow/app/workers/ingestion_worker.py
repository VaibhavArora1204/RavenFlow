import time

from app.db.database import SessionLocal
from app.models.document import Document
from app.workers.celery_app import celery
from app.services.parser_service import fetch_page_content
from app.models.chunk import Chunk
from app.services.chunking_service import chunk_text
from app.services.embedding_service import generate_embedding
from app.services.vector_service import store_chunk_embedding
from app.core.logging_config import logger

@celery.task
def ingest_document(document_id):

    db = SessionLocal()

    try:

        document = db.query(Document).get(
            document_id
        )

        content = fetch_page_content(
            document.source_url
        )
        logger.info(
            f"Fetched document {document.id}"
        )

        document.raw_text = content

        chunks = chunk_text(content)
        logger.info(
            f"Created {len(chunks)} chunks"
        )

        for index, chunk_content in enumerate(chunks):

            chunk = Chunk(
                document_id=document.id,
                chunk_index=index,
                content=chunk_content
            )

            db.add(chunk)

            db.flush()

            embedding = generate_embedding(
                chunk_content
            )

            store_chunk_embedding(
                chunk.id,
                embedding,
                chunk_content
            )

        document.status = "completed"

        db.commit()
        logger.info(
            f"Completed ingestion for "
            f"document {document.id}"
        )

    except Exception as e:

        document.status = "failed"

        db.commit()

        logger.error(
            f"Ingestion failed: {e}"
        )

    finally:

        db.close()