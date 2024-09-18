import React, { useEffect, useRef, useState } from 'react';
import { Container, Typography, Button, Box, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const WS_SERVER_URL = 'ws://95.217.178.151:8765';  // WebSocket server URL

function BirdViewer() {
  const [connected, setConnected] = useState(false);
  const imageRef = useRef(null); // To display images
  const wsRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Create WebSocket connection
    wsRef.current = new WebSocket(WS_SERVER_URL);
    wsRef.current.binaryType = 'arraybuffer';  // Handle binary data as ArrayBuffer

    wsRef.current.onopen = () => {
      console.log('WebSocket connected');
      setConnected(true);
    };

    wsRef.current.onclose = (event) => {
      console.log('WebSocket disconnected', event);
      setConnected(false);
    };

    wsRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    wsRef.current.onmessage = (event) => {
      try {
        // Convert received data to Blob and create an Object URL
        const arrayBuffer = event.data;
        const blob = new Blob([arrayBuffer], { type: 'image/jpeg' }); // Change type if necessary
        const url = URL.createObjectURL(blob);

        // Set the image source to the Object URL
        if (imageRef.current) {
          imageRef.current.src = url;
          // Optionally revoke the Object URL after some time to free memory
          setTimeout(() => URL.revokeObjectURL(url), 10000);
        }
      } catch (e) {
        console.error('Error handling WebSocket message:', e);
      }
    };

    // Cleanup on component unmount
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

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
        <Typography
          variant="h2"
          sx={{
            fontWeight: 'bold',
            fontSize: { xs: '2rem', sm: '3rem' },  // Responsive font size
            color: '#333',
          }}
        >
          Bird Viewer
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: '1.25rem',
            color: '#666',
            maxWidth: '600px',
            margin: 'auto',
          }}
        >
          View live images of your "perejiles" online.
        </Typography>
      </Box>

      {/* Display the image or show a loading indicator */}
      <Box
        sx={{
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
        {connected ? (
          <img
            ref={imageRef}
            alt="Bird Viewer"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',  // Ensures the image fits without distortion
            }}
          />
        ) : (
          <Box display="flex" alignItems="center" flexDirection="column">
            <CircularProgress />
            <Typography variant="body1" color="error" mt={2}>
              Connecting to WebSocket...
            </Typography>
          </Box>
        )}
      </Box>

      {/* Admin button */}
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate('/bird-viewer-admin')}
        sx={{
          padding: '12px 24px',
          fontSize: '1rem',
          backgroundColor: '#000',
          '&:hover': {
            backgroundColor: '#333',
          },
        }}
      >
        Go to Admin
      </Button>
    </Container>
  );
}

export default BirdViewer;
