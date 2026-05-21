from pydantic import BaseModel # pyright: ignore[reportMissingImports]


class DocumentCreate(BaseModel):
    source_url: str