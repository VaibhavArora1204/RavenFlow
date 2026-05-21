from celery import Celery # pyright: ignore[reportMissingImports]

celery = Celery(
    "ravenflow",
    broker="redis://localhost:6379/0",
    backend="redis://localhost:6379/0"
)