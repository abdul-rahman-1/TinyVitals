import React from 'react';
import { Card, Button, Badge, Row, Col, Alert } from 'react-bootstrap';
import './ResultDisplay.css';

function ResultDisplay({ result, imagePreview, onReset }) {
  // Parse the result - expecting { text: string, report: object/string }
  const analysisText = result?.text || result?.analysis || 'No analysis text available';
  const analysisReport = result?.report || result?.details || {};

  // Helper to render report data
  const renderReportData = () => {
    if (typeof analysisReport === 'string') {
      return <p className="report-text">{analysisReport}</p>;
    }

    if (typeof analysisReport === 'object' && analysisReport !== null) {
      return Object.entries(analysisReport).map(([key, value]) => (
        <div key={key} className="report-item">
          <strong className="report-key">{formatKey(key)}:</strong>
          <span className="report-value"> {formatValue(value)}</span>
        </div>
      ));
    }

    return <p className="text-muted">No detailed report available</p>;
  };

  // Format keys to be more readable
  const formatKey = (key) => {
    return key
      .replace(/_/g, ' ')
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  };

  // Format values
  const formatValue = (value) => {
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    if (typeof value === 'object' && value !== null) {
      return JSON.stringify(value, null, 2);
    }
    return String(value);
  };

  // Determine severity badge
  const getSeverityBadge = () => {
    const text = analysisText.toLowerCase();
    
    if (text.includes('severe') || text.includes('critical') || text.includes('urgent')) {
      return <Badge bg="danger" className="severity-badge">High Priority</Badge>;
    }
    if (text.includes('moderate') || text.includes('caution')) {
      return <Badge bg="warning" className="severity-badge">Moderate</Badge>;
    }
    if (text.includes('normal') || text.includes('healthy') || text.includes('no concern')) {
      return <Badge bg="success" className="severity-badge">Normal</Badge>;
    }
    return <Badge bg="info" className="severity-badge">Analyzed</Badge>;
  };

  return (
    <div className="result-container">
      <Card className="result-card">
        <Card.Body className="p-4 p-md-5">
          <div className="result-header text-center mb-4">
            <div className="result-icon mb-3">
              <i className="bi bi-check-circle"></i>
            </div>
            <h2 className="result-title">Analysis Complete</h2>
            {getSeverityBadge()}
          </div>

          <Row className="mb-4">
            {imagePreview && (
              <Col md={5} className="mb-4 mb-md-0">
                <div className="result-image-wrapper">
                  <img 
                    src={imagePreview} 
                    alt="Analyzed" 
                    className="result-image"
                  />
                </div>
              </Col>
            )}
            <Col md={imagePreview ? 7 : 12}>
              <div className="analysis-summary">
                <h4 className="summary-title">
                  <i className="bi bi-file-text me-2"></i>
                  Analysis Summary
                </h4>
                <div className="summary-content">
                  <p className="analysis-text">{analysisText}</p>
                </div>
              </div>
            </Col>
          </Row>

          {/* Detailed Report Section */}
          <Card className="report-card mb-4">
            <Card.Header className="report-header">
              <h5 className="mb-0">
                <i className="bi bi-clipboard-data me-2"></i>
                Detailed Report
              </h5>
            </Card.Header>
            <Card.Body className="report-body">
              {renderReportData()}
            </Card.Body>
          </Card>

          {/* Disclaimer */}
          <Alert variant="info" className="disclaimer-alert">
            <Alert.Heading className="h6">
              <i className="bi bi-info-circle me-2"></i>
              Important Notice
            </Alert.Heading>
            <p className="mb-0 small">
              This AI analysis is for screening purposes only. Please consult a qualified 
              healthcare professional for proper medical diagnosis and treatment. 
              Do not make medical decisions based solely on this automated assessment.
            </p>
          </Alert>

          {/* Action Buttons */}
          <div className="result-actions text-center">
            <Button
              variant="primary"
              size="lg"
              className="action-btn me-3"
              onClick={() => window.print()}
            >
              <i className="bi bi-printer me-2"></i>
              Print Report
            </Button>
            <Button
              variant="success"
              size="lg"
              className="action-btn"
              onClick={onReset}
            >
              <i className="bi bi-arrow-clockwise me-2"></i>
              Analyze Another
            </Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

export default ResultDisplay;
