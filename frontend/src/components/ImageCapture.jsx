import React, { useRef, useState, useEffect } from 'react';
import { Card, Button, Alert } from 'react-bootstrap';
import './ImageCapture.css';

function ImageCapture({ onCapture, onCancel }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);
  const [isCameraReady, setIsCameraReady] = useState(false);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Use back camera on mobile
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setIsCameraReady(true);
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Unable to access camera. Please ensure camera permissions are granted.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Get image data as base64
    const imageData = canvas.toDataURL('image/jpeg', 0.9);

    // Stop camera
    stopCamera();

    // Send captured image to parent
    onCapture(imageData);
  };

  const handleCancel = () => {
    stopCamera();
    onCancel();
  };

  return (
    <Card className="camera-card">
      <Card.Body className="p-4">
        <h2 className="section-title text-center mb-4">
          <i className="bi bi-camera-video"></i> Camera Capture
        </h2>

        {error && (
          <Alert variant="danger" className="mb-4">
            <i className="bi bi-exclamation-triangle me-2"></i>
            {error}
          </Alert>
        )}

        <div className="camera-container">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="camera-video"
          />
          <canvas ref={canvasRef} style={{ display: 'none' }} />
          
          {!isCameraReady && !error && (
            <div className="camera-loading">
              <div className="spinner-border text-light" role="status">
                <span className="visually-hidden">Loading camera...</span>
              </div>
              <p className="mt-3 text-light">Starting camera...</p>
            </div>
          )}
        </div>

        <div className="camera-controls mt-4">
          <Button
            variant="danger"
            size="lg"
            className="control-btn me-3"
            onClick={handleCancel}
          >
            <i className="bi bi-x-circle me-2"></i>
            Cancel
          </Button>
          <Button
            variant="success"
            size="lg"
            className="control-btn"
            onClick={captureImage}
            disabled={!isCameraReady}
          >
            <i className="bi bi-camera me-2"></i>
            Capture Photo
          </Button>
        </div>

        <div className="camera-hint text-center mt-3">
          <small className="text-muted">
            <i className="bi bi-info-circle me-1"></i>
            Position the newborn in good lighting for best results
          </small>
        </div>
      </Card.Body>
    </Card>
  );
}

export default ImageCapture;
