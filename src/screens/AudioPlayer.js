import React, { useEffect, useRef, useState } from 'react';
import { Container, Typography, Button, Box, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const WS_AUDIO_SERVER_URL = 'wss://bluejims.com:8766';  // WebSocket server for audio

function AudioPlayer() {
  const [connected, setConnected] = useState(false);
  const [playing, setPlaying] = useState(false);
  const wsRef = useRef(null);
  const audioContextRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Create WebSocket connection
    wsRef.current = new WebSocket(WS_AUDIO_SERVER_URL);
    wsRef.current.binaryType = 'arraybuffer';  // Handle binary data as ArrayBuffer

    // Initialize AudioContext for playing the audio
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();

    wsRef.current.onopen = () => {
      console.log('WebSocket connected');
      setConnected(true);
    };

    wsRef.current.onclose = (event) => {
      console.log('WebSocket disconnected', event);
      setConnected(false);
      setPlaying(false);
    };

    wsRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    wsRef.current.onmessage = async (event) => {
      try {
        // Check if the data is an ArrayBuffer
        if (!(event.data instanceof ArrayBuffer)) {
          throw new Error('Expected ArrayBuffer');
        }

        const audioData = event.data;

        // Decode the audio data
        const audioBuffer = await audioContextRef.current.decodeAudioData(audioData);
        // console.log('Audio data decoded successfully');

        // Play the audio
        const source = audioContextRef.current.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContextRef.current.destination);
        source.start(0);
        setPlaying(true);
      } catch (e) {
        console.error('Error handling WebSocket audio message:', e);
      }
    };

    // Cleanup on component unmount
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
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
          Audio Player
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
          Listen to live audio stream from the server.
        </Typography>
      </Box>

      {/* Display connection status and audio controls */}
      <Box
        sx={{
          width: '100%',
          height: '200px',
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
          playing ? (
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
              Connecting to WebSocket...
            </Typography>
          </Box>
        )}
      </Box>

      {/* Admin button */}
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate('/audio-admin')}
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

export default AudioPlayer;
