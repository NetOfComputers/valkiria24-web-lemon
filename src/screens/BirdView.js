import React, { useEffect, useRef, useState } from 'react';
import { Container, Typography, Button, Box, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const WS_VIDEO_SERVER_URL = 'wss://bluejims.com:8765';  // WebSocket server for video
const WS_AUDIO_SERVER_URL = 'wss://bluejims.com:8766';  // WebSocket server for audio

function BirdView() {
  // State for video and audio WebSocket connections
  const [connectedVideo, setConnectedVideo] = useState(false);
  const [connectedAudio, setConnectedAudio] = useState(false);
  const [playingAudio, setPlayingAudio] = useState(false);
  
  // References
  const imageRef = useRef(null);  // To display video images
  const wsVideoRef = useRef(null);  // WebSocket for video
  const wsAudioRef = useRef(null);  // WebSocket for audio
  const audioContextRef = useRef(null);  // Audio context for playing audio
  const navigate = useNavigate();

  // WebSocket for video stream
  useEffect(() => {
    wsVideoRef.current = new WebSocket(WS_VIDEO_SERVER_URL);
    wsVideoRef.current.binaryType = 'arraybuffer';  // Handle binary data as ArrayBuffer

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
        const blob = new Blob([arrayBuffer], { type: 'image/jpeg' });  // Change type if necessary
        const url = URL.createObjectURL(blob);

        if (imageRef.current) {
          imageRef.current.src = url;
          setTimeout(() => URL.revokeObjectURL(url), 10000);  // Revoke URL to free memory
        }
      } catch (e) {
        console.error('Error handling video WebSocket message:', e);
      }
    };

    return () => {
      if (wsVideoRef.current) {
        wsVideoRef.current.close();
      }
    };
  }, []);

  // WebSocket for audio stream
  useEffect(() => {
    wsAudioRef.current = new WebSocket(WS_AUDIO_SERVER_URL);
    wsAudioRef.current.binaryType = 'arraybuffer';  // Handle binary data as ArrayBuffer

    // Initialize AudioContext for playing the audio
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();

    wsAudioRef.current.onopen = () => {
      console.log('WebSocket for audio connected');
      setConnectedAudio(true);
    };

    wsAudioRef.current.onclose = (event) => {
      console.log('WebSocket for audio disconnected', event);
      setConnectedAudio(false);
      setPlayingAudio(false);
    };

    wsAudioRef.current.onerror = (error) => {
      console.error('WebSocket for audio error:', error);
    };

    wsAudioRef.current.onmessage = async (event) => {
      try {
        if (!(event.data instanceof ArrayBuffer)) {
          throw new Error('Expected ArrayBuffer');
        }

        const audioData = event.data;

        const audioBuffer = await audioContextRef.current.decodeAudioData(audioData);

        const source = audioContextRef.current.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContextRef.current.destination);
        source.start(0);
        setPlayingAudio(true);
      } catch (e) {
        console.error('Error handling audio WebSocket message:', e);
      }
    };

    return () => {
      if (wsAudioRef.current) {
        wsAudioRef.current.close();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
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
            fontSize: { xs: '2rem', sm: '3rem' },
            color: '#333',
          }}
        >
          Bird Viewer with Audio
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
          View live video and listen to audio of your "perejiles" online.
        </Typography>
      </Box>

      {/* Display the video */}
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
        {connectedVideo ? (
          <img
            ref={imageRef}
            alt="Bird Viewer"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain'
              // transform: 'rotate(180deg)',  // Rotate the image 180 degrees
            }}
          />
        ) : (
          <Box display="flex" alignItems="center" flexDirection="column">
            <CircularProgress />
            <Typography variant="body1" color="error" mt={2}>
              Connecting to WebSocket for video...
            </Typography>
          </Box>
        )}
      </Box>

      {/* Display the audio status */}
      <Box
        sx={{
          width: '100%',
          height: '100px',
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
        {connectedAudio ? (
          playingAudio ? (
            <Typography variant="h5" color="success">
              Audio is playing...
            </Typography>
          ) : (
            <Typography variant="h5" color="warning">
              Waiting for audio stream...
            </Typography>
          )
        ) : (
          <Box display="flex" alignItems="center" flexDirection="column">
            <CircularProgress />
            <Typography variant="body1" color="error" mt={2}>
              Connecting to WebSocket for audio...
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

export default BirdView;
