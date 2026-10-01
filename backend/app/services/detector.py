from io import BytesIO

from PIL import Image

from backend.app.schemas.detection import BoundingBox, Detection


class Detector:
    def detect(self, image_bytes: bytes) -> tuple[list[Detection], int, int]:
        image = Image.open(BytesIO(image_bytes))

        width, height = image.size

        detections = [
            Detection(
                class_name="helmet",
                confidence=0.96,
                bbox=BoundingBox(
                    x1=width * 0.2,
                    y1=height * 0.2,
                    x2=width * 0.6,
                    y2=height * 0.7,
                ),
            )
        ]

        return detections, width, height
