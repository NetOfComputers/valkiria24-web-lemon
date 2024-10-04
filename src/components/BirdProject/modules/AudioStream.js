// src/components/AudioStream.js

import React, { useEffect, useRef } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const WS_AUDIO_SERVER_URL = 'wss://bluejims.com:8766';

const AudioStream = ({ setConnectedAudio, connectedAudio, setPlayingAudio }) => {
  const wsAudioRef = useRef(null);
  const audioContextRef = useRef(null);

  useEffect(() => {
    wsAudioRef.current = new WebSocket(WS_AUDIO_SERVER_URL);
    wsAudioRef.current.binaryType = 'arraybuffer';

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
  }, [setConnectedAudio, setPlayingAudio]);

  return (
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
        <Typography variant="h5" color="success">
          Audio is playing...
        </Typography>
      ) : (
        <Box display="flex" alignItems="center" flexDirection="column">
          <CircularProgress />
          <Typography variant="body1" color="error" mt={2}>
            Connecting to WebSocket for audio...
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default AudioStream;
