from sqlalchemy import create_engine # type: ignore
from sqlalchemy.orm import declarative_base # pyright: ignore[reportMissingImports]
from sqlalchemy.orm import sessionmaker # type: ignore

DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/ravenflow"

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()