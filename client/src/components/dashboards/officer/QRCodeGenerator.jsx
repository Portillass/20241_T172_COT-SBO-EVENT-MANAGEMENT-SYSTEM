import React, { useState } from 'react';
import { Card, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { QRCodeSVG } from 'qrcode.react';
import { FaDownload, FaPrint } from 'react-icons/fa';

function QRCodeGenerator({ event }) {
  const [qrValue, setQrValue] = useState('');
  const [showQR, setShowQR] = useState(false);

  const generateQRCode = () => {
    if (!event) return;
    
    const qrData = {
      eventId: event.id,
      eventName: event.summary,
      timestamp: new Date().toISOString()
    };
    setQrValue(JSON.stringify(qrData));
    setShowQR(true);
  };

  const downloadQRCode = () => {
    const svg = document.getElementById('qr-code');
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `qr-${event?.summary?.replace(/\s+/g, '-').toLowerCase() || 'event'}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  const printQRCode = () => {
    const svg = document.getElementById('qr-code');
    const svgData = new XMLSerializer().serializeToString(svg);
    const printWindow = window.open('', '', 'height=500,width=500');
    printWindow.document.write('<html><head><title>Print QR Code</title></head><body>');
    printWindow.document.write('<img src="data:image/svg+xml;base64,' + btoa(svgData) + '" />');
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <Card className="shadow-sm">
      <Card.Header className="bg-primary text-white">
        <h5 className="mb-0">QR Code Generator</h5>
      </Card.Header>
      <Card.Body>
        <Row>
          <Col md={6}>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Event Name</Form.Label>
                <Form.Control type="text" value={event?.summary || ''} disabled />
              </Form.Group>
              <Button 
                variant="primary" 
                onClick={generateQRCode} 
                className="mb-3"
                disabled={!event}
              >
                Generate QR Code
              </Button>
            </Form>
          </Col>
          <Col md={6} className="text-center">
            {showQR && qrValue && (
              <div className="qr-container p-3">
                <QRCodeSVG
                  id="qr-code"
                  value={qrValue}
                  size={200}
                  level="H"
                  includeMargin={true}
                />
                <div className="mt-3">
                  <Button 
                    variant="outline-primary" 
                    className="me-2" 
                    onClick={downloadQRCode}
                  >
                    <FaDownload className="me-2" />
                    Download
                  </Button>
                  <Button 
                    variant="outline-primary" 
                    onClick={printQRCode}
                  >
                    <FaPrint className="me-2" />
                    Print
                  </Button>
                </div>
              </div>
            )}
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}

export default QRCodeGenerator;
