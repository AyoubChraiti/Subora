from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    database_url: str = "postgresql+psycopg2://subora:subora_password@db:5432/subora"
    secret_key: str = "replace_with_a_long_random_secret"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    app_env: str = "development"
    cors_allow_origins: str = "http://localhost:3000"
    auth_rate_limit: str = "5/minute"
    default_rate_limit: str = "60/minute"

    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=False,
        extra="ignore",
    )

    @property
    def cors_origins(self) -> list[str]:
        return [origin.strip() for origin in self.cors_allow_origins.split(",") if origin.strip()]


settings = Settings()
