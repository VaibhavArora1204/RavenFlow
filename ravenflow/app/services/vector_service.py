from qdrant_client import QdrantClient
from qdrant_client.models import Distance
from qdrant_client.models import PointStruct
from qdrant_client.models import VectorParams


client = QdrantClient(
    host="localhost",
    port=6333
)

COLLECTION_NAME = "document_chunks"


def create_collection():

    collections = client.get_collections()

    existing = [
        c.name
        for c in collections.collections
    ]

    if COLLECTION_NAME not in existing:

        client.create_collection(
            collection_name=COLLECTION_NAME,
            vectors_config=VectorParams(
                size=384,
                distance=Distance.COSINE
            )
        )


def store_chunk_embedding(
    chunk_id: int,
    embedding: list,
    content: str
):

    client.upsert(
        collection_name=COLLECTION_NAME,
        points=[
            PointStruct(
                id=chunk_id,
                vector=embedding,
                payload={
                    "content": content
                }
            )
        ]
    )


def search_similar_chunks(
    query_embedding: list,
    limit: int = 5
):

    results = client.query_points(
        collection_name=COLLECTION_NAME,
        query=query_embedding,
        limit=limit
    ).points

    return results