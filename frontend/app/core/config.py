from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Guess the Elo"
    API_V1_STR: str = "/api/v1"
    DATABASE_URL: str = "sqlite+aiosqlite:///./guess_the_elo.db"

    class Config:
        env_file = ".env"

settings = Settings()