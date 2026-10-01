from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.api.routes.detection import router as detection_router
from backend.app.api.routes.health import router as health_router

app = FastAPI(
    title="Helmet Detection API",
    description="API for helmet detection using computer vision.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router, prefix="/api")
app.include_router(detection_router, prefix="/api")
