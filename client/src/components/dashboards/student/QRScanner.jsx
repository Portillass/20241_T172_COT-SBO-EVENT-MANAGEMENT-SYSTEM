import React, { useRef, useState, useCallback } from 'react';
import { Card, Alert, Row, Col, Button } from 'react-bootstrap';
import Webcam from 'react-webcam';
import jsQR from 'jsqr';
import axios from '../../../utils/axios';

function QRScanner() {
  const webcamRef = useRef(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [scanning, setScanning] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(true);

  const videoConstraints = {
    width: 720,
    height: 720,
    facingMode: 'environment'
  };

  const scanQRCode = useCallback(async () => {
    if (webcamRef.current && scanning) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        const image = new Image();
        image.src = imageSrc;
        image.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = image.width;
          canvas.height = image.height;
          const context = canvas.getContext('2d');
          context.drawImage(image, 0, 0);
          const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height);

          if (code) {
            handleQRCode(code.data);
          }
        };
      }
    }
    if (scanning) {
      setTimeout(scanQRCode, 500); // Scan every 500ms
    }
  }, [scanning]);

  const handleQRCode = async (data) => {
    try {
      setScanning(false);
      const response = await axios.post('/api/attendance/scan', {
        qrData: data
      });
      setSuccess('Attendance recorded successfully!');
      setError('');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to record attendance');
      setSuccess('');
      setScanning(true); // Resume scanning if there was an error
    }
  };

  const startScanning = () => {
    setScanning(true);
    setError('');
    setSuccess('');
    scanQRCode();
  };

  const stopScanning = () => {
    setScanning(false);
  };

  const toggleCamera = () => {
    setCameraEnabled(!cameraEnabled);
    if (!cameraEnabled) {
      setTimeout(startScanning, 1000); // Give camera time to start
    }
  };

  return (
    <div>
      <h2 className="mb-4">QR Scanner</h2>
      <Row>
        <Col md={8} className="mx-auto">
          <Card className="shadow-sm">
            <Card.Body>
              {error && (
                <Alert variant="danger" dismissible onClose={() => setError('')}>
                  {error}
                </Alert>
              )}
              {success && (
                <Alert variant="success" dismissible onClose={() => setSuccess('')}>
                  {success}
                </Alert>
              )}
              <div className="text-center">
                {cameraEnabled ? (
                  <div className="qr-scanner-container" style={{ maxWidth: '500px', margin: '0 auto' }}>
                    <Webcam
                      ref={webcamRef}
                      audio={false}
                      screenshotFormat="image/jpeg"
                      videoConstraints={videoConstraints}
                      onUserMedia={() => startScanning()}
                      onUserMediaError={(err) => {
                        setError('Failed to access camera: ' + err.message);
                        setCameraEnabled(false);
                      }}
                      style={{
                        width: '100%',
                        borderRadius: '8px'
                      }}
                    />
                    <div 
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '200px',
                        height: '200px',
                        border: '2px solid #00ff00',
                        borderRadius: '20px',
                        pointerEvents: 'none'
                      }}
                    />
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p>Camera is disabled</p>
                  </div>
                )}
                <div className="mt-3">
                  <Button 
                    variant={cameraEnabled ? "danger" : "primary"} 
                    onClick={toggleCamera}
                    className="me-2"
                  >
                    {cameraEnabled ? 'Disable Camera' : 'Enable Camera'}
                  </Button>
                  {cameraEnabled && (
                    <Button 
                      variant={scanning ? "warning" : "success"} 
                      onClick={scanning ? stopScanning : startScanning}
                    >
                      {scanning ? 'Stop Scanning' : 'Start Scanning'}
                    </Button>
                  )}
                </div>
              </div>
              <div className="text-center mt-3">
                <p className="text-muted">
                  {scanning 
                    ? 'Position the QR code within the green frame to scan' 
                    : success 
                      ? 'Scan completed successfully!' 
                      : 'Click Start Scanning to begin'
                  }
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default QRScanner;
