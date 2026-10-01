from pydantic import BaseModel


class BoundingBox(BaseModel):
    x1: float
    y1: float
    x2: float
    y2: float


class Detection(BaseModel):
    class_name: str
    confidence: float
    bbox: BoundingBox


class DetectionResponse(BaseModel):
    image_width: int
    image_height: int
    detections: list[Detection]
