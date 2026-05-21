from sqlalchemy import Column, Integer, String, Text # type: ignore
from app.db.database import Base


class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)

    source_url = Column(String, nullable=False)

    status = Column(String, default="pending")

    raw_text = Column(Text, nullable=True)