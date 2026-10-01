from fastapi import APIRouter, File, UploadFile

from backend.app.schemas.detection import DetectionResponse
from backend.app.services.detector import Detector

router = APIRouter()

detector = Detector()


@router.post("/detect")
async def detect(image: UploadFile = File(...)):
    image_bytes = await image.read()

    detections, width, height = detector.detect(image_bytes)

    return DetectionResponse(
        detections=detections,
        image_width=width,
        image_height=height,
    )
