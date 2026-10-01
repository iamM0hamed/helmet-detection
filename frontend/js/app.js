const imageInput = document.getElementById("image-input");
const canvas = document.getElementById("detection-canvas");
const ctx = canvas.getContext("2d");
const fileName = document.getElementById("file-name");

const previewSection = document.getElementById("preview-section");
const detectButton = document.getElementById("detect-button");

const resultsSection = document.getElementById("results-section");
const resultsCount = document.getElementById("results-count");
const resultsContainer = document.getElementById("results-container");

let selectedImage = null;

imageInput.addEventListener("change", () => {
    const file = imageInput.files[0];

    if (!file) {
        return;
    }

    fileName.textContent = file.name;

    const imageUrl = URL.createObjectURL(file);

    const image = new Image();

    image.onload = () => {
        selectedImage = image;

        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;

        ctx.drawImage(
            image,
            0,
            0,
            canvas.width,
            canvas.height
        );

        URL.revokeObjectURL(imageUrl);
    };

    image.src = imageUrl;

    previewSection.classList.remove("hidden");
    resultsSection.classList.add("hidden");
});

detectButton.addEventListener("click", async () => {
    const file = imageInput.files[0];

    if (!file) {
        return;
    }

    detectButton.disabled = true;
    detectButton.textContent = "Detecting...";

    const formData = new FormData();
    formData.append("image", file);

    try {
        const response = await fetch(
            "http://127.0.0.1:8000/api/detect",
            {
                method: "POST",
                body: formData,
            }
        );

        if (!response.ok) {
            throw new Error("Detection request failed.");
        }

        const data = await response.json();

        displayResults(data);
        drawDetections(data);
    } catch (error) {
        console.error(error);
        alert("Something went wrong while detecting the image.");
    } finally {
        detectButton.disabled = false;
        detectButton.textContent = "Detect";
    }
});


function displayResults(data) {
    resultsSection.classList.remove("hidden");

    resultsCount.textContent =
        `Detections: ${data.detections.length}`;

    resultsContainer.innerHTML = "";

    data.detections.forEach((detection) => {
        const result = document.createElement("p");

        result.textContent =
            `${detection.class_name} — ` +
            `${(detection.confidence * 100).toFixed(1)}%`;

        resultsContainer.appendChild(result);
    });
}


function drawDetections(data) {
    ctx.drawImage(
        selectedImage,
        0,
        0,
        canvas.width,
        canvas.height
    );

    data.detections.forEach((detection) => {
        const { x1, y1, x2, y2 } = detection.bbox;

        const width = x2 - x1;
        const height = y2 - y1;

        ctx.strokeStyle = "#22c55e";
        ctx.lineWidth = 4;

        ctx.strokeRect(
            x1,
            y1,
            width,
            height
        );

        const label =
            `${detection.class_name} ` +
            `${(detection.confidence * 100).toFixed(1)}%`;

        ctx.font = "20px Arial";

        const textWidth = ctx.measureText(label).width;
        const textHeight = 24;

        ctx.fillStyle = "#22c55e";

        ctx.fillRect(
            x1,
            y1 - textHeight,
            textWidth + 10,
            textHeight
        );

        ctx.fillStyle = "#ffffff";

        ctx.fillText(
            label,
            x1 + 5,
            y1 - 6
        );
    });
}