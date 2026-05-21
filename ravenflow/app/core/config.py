import os

from dotenv import load_dotenv


load_dotenv()


class Settings:

    DATABASE_URL = os.getenv(
        "DATABASE_URL"
    )

    REDIS_URL = os.getenv(
        "REDIS_URL"
    )

    GROQ_API_KEY = os.getenv(
        "GROQ_API_KEY"
    )

    QDRANT_HOST = os.getenv(
        "QDRANT_HOST",
        "localhost"
    )

    QDRANT_PORT = int(
        os.getenv(
            "QDRANT_PORT",
            6333
        )
    )


settings = Settings()