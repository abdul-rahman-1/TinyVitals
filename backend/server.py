import base64
import io
import os
import time
import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from PIL import Image
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import img_to_array, ImageDataGenerator
import uvicorn

# ---- CONFIG ----
MODEL_PATH = "neoscan_model.h5"     # <-- make sure this path is correct
IMG_SIZE = (224, 224)
CLASS_NAMES = ["healthy", "jaundice"]

print("🔄 Loading model...")
model = load_model(MODEL_PATH)
print("✅ Model loaded successfully.\n")

# ---- FASTAPI INIT ----
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],                     # allow frontend access (change in production)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ImageRequest(BaseModel):
    image: str  # Base64 input


# ---- TTA PREDICTION ----
def tta_predict(img_array, num_augmentations=10):
    predictions = []

    # Original image prediction
    predictions.append(model.predict(np.expand_dims(img_array, axis=0), verbose=0)[0][0])

    # Augmented predictions
    tta_gen = ImageDataGenerator(
        rotation_range=15,
        width_shift_range=0.1,
        height_shift_range=0.1,
        zoom_range=0.1,
        horizontal_flip=True
    )

    for _ in range(num_augmentations - 1):
        aug_img = tta_gen.random_transform(img_array)
        pred = model.predict(np.expand_dims(aug_img, axis=0), verbose=0)[0][0]
        predictions.append(pred)

    avg_pred = float(np.mean(predictions))
    predicted_class = CLASS_NAMES[1] if avg_pred > 0.5 else CLASS_NAMES[0]
    confidence = avg_pred if avg_pred > 0.5 else (1 - avg_pred)

    return predicted_class, float(confidence), avg_pred
    
@app.get("/")
def root():
    return {"status": "running", "routes": ["/api/health", "/api/analyze"]}


# ✅ HEALTH ENDPOINT
@app.get("/api/health")
def health_check():
    return {"status": "online"}


# ✅ MAIN ANALYSIS ENDPOINT
@app.post("/api/analyze")
def analyze_image(req: ImageRequest):
    try:
        start = time.time()

        # Decode Base64 image
        image_data = base64.b64decode(req.image.split(",")[-1])
        image = Image.open(io.BytesIO(image_data)).convert("RGB")
        image = image.resize(IMG_SIZE)
        img_array = img_to_array(image) / 255.0

        # Run prediction
        predicted_class, confidence, raw_score = tta_predict(img_array)

        # ------- RULE BASED REPORT (NO GEMINI REQUIRED) -------
        confidence_percent = round(confidence * 100, 2)

        if predicted_class == "jaundice":
            text = f"Possible jaundice detected with {confidence_percent}% confidence."
            report = {
                "condition": "Jaundice",
                "confidence_percent": f"{confidence_percent}%",
                "description": "Yellow discoloration detected, likely due to bilirubin buildup.",
                "medical_risk": "Moderate to High",
                "symptoms_detected": ["yellow skin tone"],
                "recommended_action": "Consult a pediatrician within 24 hours for bilirubin testing.",
            }
        else:
            text = f"No jaundice detected. Confidence {confidence_percent}%."
            report = {
                "condition": "Healthy",
                "confidence_percent": f"{confidence_percent}%",
                "description": "No visible signs of jaundice detected.",
                "medical_risk": "Low",
                "recommended_action": "Continue routine newborn checkups.",
            }

        analysis_time = round((time.time() - start) * 1000, 2)  # ms

        return {
            "status": "success",
            "text": text,
            "report": report,
            "metadata": {
                "model": "MobileNetV2 + TTA",
                "tta_augmentations": 10,
                "raw_score": raw_score,
                "analysis_time_ms": analysis_time,
            }
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error processing image: {str(e)}")




if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    uvicorn.run("server:app", host="0.0.0.0", port=port)
