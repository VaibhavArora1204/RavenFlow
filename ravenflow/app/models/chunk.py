from sqlalchemy import Column
from sqlalchemy import ForeignKey
from sqlalchemy import Integer
from sqlalchemy import Text

from app.db.database import Base


class Chunk(Base):

    __tablename__ = "chunks"

    id = Column(Integer, primary_key=True)

    document_id = Column(
        Integer,
        ForeignKey("documents.id")
    )

    chunk_index = Column(Integer)

    content = Column(Text)