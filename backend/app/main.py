from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.routes import process, confirm, logs
from app.database import engine, Base
from app.models.call_log import CallLog # Ensure model is imported for create_all

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/audio", StaticFiles(directory="."), name="audio")

app.include_router(process.router)
app.include_router(confirm.router)
app.include_router(logs.router)