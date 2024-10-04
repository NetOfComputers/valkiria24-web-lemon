import React, { useEffect, useRef, useState } from 'react';
import { Container, Typography, Button, Box, CircularProgress } from '@mui/material';

const WS_VIDEO_SERVER_URL = 'wss://bluejims.com:8765';

function BirdViewRecorder() {
  const [connectedVideo, setConnectedVideo] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const imageRef = useRef(null);
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const wsVideoRef = useRef(null);
  const frameIntervalRef = useRef(null); // To control frame rate

  useEffect(() => {
    wsVideoRef.current = new WebSocket(WS_VIDEO_SERVER_URL);
    wsVideoRef.current.binaryType = 'arraybuffer';

    wsVideoRef.current.onopen = () => {
      console.log('WebSocket for video connected');
      setConnectedVideo(true);
    };

    wsVideoRef.current.onclose = (event) => {
      console.log('WebSocket for video disconnected', event);
      setConnectedVideo(false);
    };

    wsVideoRef.current.onerror = (error) => {
      console.error('WebSocket for video error:', error);
    };

    wsVideoRef.current.onmessage = (event) => {
      try {
        const arrayBuffer = event.data;
        const blob = new Blob([arrayBuffer], { type: 'image/jpeg' });
        const url = URL.createObjectURL(blob);

        const img = new Image();
        img.src = url;
        img.onload = () => {
          const canvas = canvasRef.current;
          const ctx = canvas.getContext('2d');
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          if (imageRef.current) {
            imageRef.current.src = url;
          }
          setTimeout(() => URL.revokeObjectURL(url), 10000);
        };
      } catch (e) {
        console.error('Error handling video WebSocket message:', e);
      }
    };

    return () => {
      if (wsVideoRef.current) {
        wsVideoRef.current.close();
      }
      clearInterval(frameIntervalRef.current);
    };
  }, []);

  const handleStartRecording = () => {
    setIsRecording(true);

    // Capture the canvas at 30 fps
    const canvasStream = canvasRef.current.captureStream(30); // 30 fps

    const recorder = new MediaRecorder(canvasStream, {
      mimeType: 'video/webm; codecs=vp9',
    });

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        setRecordedChunks((prev) => [...prev, event.data]);
      }
    };

    recorder.start();
    setMediaRecorder(recorder);

    // Control frame updates at a steady 30fps (33ms per frame)
    frameIntervalRef.current = setInterval(() => {
      wsVideoRef.current.send('frame-request'); // Optionally request a new frame if needed
    }, 1000 / 30);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    clearInterval(frameIntervalRef.current); // Stop the frame requests
    mediaRecorder.stop();
    setMediaRecorder(null);
  };

  const handleDownloadRecording = () => {
    const blob = new Blob(recordedChunks, {
      type: 'video/webm',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'recording.webm';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Container
      maxWidth="md"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '2rem',
        backgroundColor: '#f0f0f0',
        textAlign: 'center',
      }}
    >
      <Box mb={3}>
        <Typography variant="h2" sx={{ fontWeight: 'bold', fontSize: { xs: '2rem', sm: '3rem' }, color: '#333' }}>
          Bird View Video
        </Typography>
        <Typography variant="body1" sx={{ fontSize: '1.25rem', color: '#666', maxWidth: '600px', margin: 'auto' }}>
          View live video of your "perejiles" online.
        </Typography>
      </Box>

      {/* Video Display */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: '500px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#fff',
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
          mb: 4,
        }}
      >
        {connectedVideo ? (
          <img ref={imageRef} alt="Bird Viewer" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        ) : (
          <Box display="flex" alignItems="center" flexDirection="column">
            <CircularProgress />
            <Typography variant="body1" color="error" mt={2}>
              Connecting to WebSocket for video...
            </Typography>
          </Box>
        )}
      </Box>

      {/* Hidden Canvas for Capturing Frames */}
      <canvas ref={canvasRef} width={1280} height={720} style={{ display: 'none' }}></canvas>

      {/* Recording Controls */}
      <Box mb={2}>
        {isRecording ? (
          <Button variant="contained" color="error" onClick={handleStopRecording}>
            Stop Recording
          </Button>
        ) : (
          <Button variant="contained" color="primary" onClick={handleStartRecording}>
            Start Recording
          </Button>
        )}
      </Box>

      {recordedChunks.length > 0 && (
        <Button variant="contained" color="success" onClick={handleDownloadRecording}>
          Download Recording
        </Button>
      )}
    </Container>
  );
}

export default BirdViewRecorder;
