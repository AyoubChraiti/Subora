from fastapi import FastAPI

from app.api.routes import api_router, router
from app.db.init_db import init_db


app = FastAPI(title="Subora API", version="0.1.0")


@app.on_event("startup")
def on_startup() -> None:
    init_db()


app.include_router(router)
app.include_router(api_router)
