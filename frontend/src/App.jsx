import React, { useState, useRef } from 'react';
import { Container, Row, Col, Card, Button, Alert, Spinner } from 'react-bootstrap';
import ImageCapture from './components/ImageCapture';
import ResultDisplay from './components/ResultDisplay';
import { analyzeImage } from './services/api';
import './App.css';

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const fileInputRef = useRef(null);

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      processImageFile(file);
    }
  };

  // Process image file
  const processImageFile = (file) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      setSelectedImage(reader.result.split(',')[1]); // Get base64 without data:image prefix
      setError(null);
      setResult(null);
    };
    reader.readAsDataURL(file);
  };

  // Handle camera capture
  const handleCameraCapture = (imageData) => {
    setImagePreview(imageData);
    setSelectedImage(imageData.split(',')[1]); // Get base64 without data:image prefix
    setShowCamera(false);
    setError(null);
    setResult(null);
  };

  // Handle analysis
  const handleAnalyze = async () => {
    if (!selectedImage) {
      setError('Please upload or capture an image first');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await analyzeImage(selectedImage);
      setResult(response);
    } catch (err) {
      setError(err.message || 'Failed to analyze image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Reset everything
  const handleReset = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setResult(null);
    setError(null);
    setShowCamera(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="app-wrapper">
      {/* Header */}
      <header className="app-header">
        <Container>
          <div className="text-center py-4">
            <div className="logo-wrapper mb-3">
              <div className="logo-icon">
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" fill="white"/>
                </svg>
              </div>
            </div>
            <h1 className="app-title">TinyVitals</h1>
            <p className="app-subtitle">AI-Powered Newborn Health Screening Tool</p>
            <p className="app-description">
              Detect visible health issues in newborns using advanced AI technology
            </p>
          </div>
        </Container>
      </header>

      {/* Main Content */}
      <Container className="main-content py-5">
        <Row className="justify-content-center">
          <Col lg={10} xl={8}>
            {/* Upload Section */}
            {!showCamera && (
              <Card className="main-card mb-4">
                <Card.Body className="p-4 p-md-5">
                  <h2 className="section-title text-center mb-4">
                    <i className="bi bi-cloud-upload"></i> Upload or Capture Image
                  </h2>

                  {/* Image Preview */}
                  {imagePreview && (
                    <div className="image-preview-wrapper mb-4">
                      <img 
                        src={imagePreview} 
                        alt="Selected" 
                        className="preview-image"
                      />
                      <Button 
                        variant="outline-danger" 
                        size="sm" 
                        className="remove-image-btn"
                        onClick={handleReset}
                      >
                        <i className="bi bi-x-circle"></i> Remove
                      </Button>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <Row className="g-3 mb-4">
                    <Col md={6}>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        accept="image/*"
                        style={{ display: 'none' }}
                      />
                      <Button
                        variant="primary"
                        size="lg"
                        className="action-btn w-100"
                        onClick={() => fileInputRef.current.click()}
                        disabled={loading}
                      >
                        <i className="bi bi-upload me-2"></i>
                        Upload Image
                      </Button>
                    </Col>
                    <Col md={6}>
                      <Button
                        variant="success"
                        size="lg"
                        className="action-btn w-100"
                        onClick={() => setShowCamera(true)}
                        disabled={loading}
                      >
                        <i className="bi bi-camera me-2"></i>
                        Open Camera
                      </Button>
                    </Col>
                  </Row>

                  {/* Analyze Button */}
                  {selectedImage && !result && (
                    <div className="text-center">
                      <Button
                        variant="warning"
                        size="lg"
                        className="analyze-btn"
                        onClick={handleAnalyze}
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <Spinner
                              as="span"
                              animation="border"
                              size="sm"
                              role="status"
                              aria-hidden="true"
                              className="me-2"
                            />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-lightning-charge me-2"></i>
                            Analyze Image
                          </>
                        )}
                      </Button>
                    </div>
                  )}

                  {/* Error Alert */}
                  {error && (
                    <Alert variant="danger" className="mt-4 mb-0" dismissible onClose={() => setError(null)}>
                      <Alert.Heading>
                        <i className="bi bi-exclamation-triangle me-2"></i>
                        Error
                      </Alert.Heading>
                      <p className="mb-0">{error}</p>
                    </Alert>
                  )}
                </Card.Body>
              </Card>
            )}

            {/* Camera Component */}
            {showCamera && (
              <ImageCapture
                onCapture={handleCameraCapture}
                onCancel={() => setShowCamera(false)}
              />
            )}

            {/* Results Section */}
            {result && (
              <ResultDisplay 
                result={result} 
                imagePreview={imagePreview}
                onReset={handleReset}
              />
            )}
          </Col>
        </Row>

        {/* Info Section */}
        {!result && !showCamera && (
          <Row className="mt-5">
            <Col lg={10} xl={8} className="mx-auto">
              <Card className="info-card">
                <Card.Body className="p-4">
                  <h3 className="info-title mb-3">
                    <i className="bi bi-info-circle me-2"></i>
                    How It Works
                  </h3>
                  <Row>
                    <Col md={4} className="mb-3 mb-md-0">
                      <div className="info-step">
                        <div className="step-number">1</div>
                        <h5>Capture or Upload</h5>
                        <p>Take a photo with your camera or upload an existing image of the newborn</p>
                      </div>
                    </Col>
                    <Col md={4} className="mb-3 mb-md-0">
                      <div className="info-step">
                        <div className="step-number">2</div>
                        <h5>AI Analysis</h5>
                        <p>Our AI analyzes the image for visible health indicators like jaundice</p>
                      </div>
                    </Col>
                    <Col md={4}>
                      <div className="info-step">
                        <div className="step-number">3</div>
                        <h5>Get Results</h5>
                        <p>Receive instant analysis and recommendations for next steps</p>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      </Container>

      {/* Footer */}
      <footer className="app-footer">
        <Container>
          <div className="text-center py-4">
            <p className="mb-2">
              <strong>Disclaimer:</strong> This tool is for screening purposes only and should not replace professional medical diagnosis.
            </p>
            <p className="mb-0">
              © 2025 TinyVitals. Powered by Google ML & GenAI
            </p>
          </div>
        </Container>
      </footer>
    </div>
  );
}

export default App;
