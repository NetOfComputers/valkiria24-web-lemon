// src/components/VideoStream.js

import React, { useEffect, useRef } from 'react';
import { Box, CircularProgress, Typography, IconButton } from '@mui/material';
import { ArrowBack, ArrowForward, Fullscreen as FullscreenIcon, FullscreenExit as FullscreenExitIcon } from '@mui/icons-material';

const WS_VIDEO_SERVER_URL = 'wss://bluejims.com:8765';

const VideoStream = ({ connectedVideo, setConnectedVideo, brightness, imageRef, handleDeviceIndexChange, handleFullscreenToggle }) => {
  const wsVideoRef = useRef(null);

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

        if (imageRef.current) {
          imageRef.current.src = url;
          setTimeout(() => URL.revokeObjectURL(url), 10000);
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
  }, [setConnectedVideo, imageRef]);

  return (
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
      <IconButton
        onClick={() => handleDeviceIndexChange(-1)}
        sx={{
          position: 'absolute',
          left: '10px',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 2,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          color: '#fff',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
          },
        }}
      >
        <ArrowBack />
      </IconButton>

      {connectedVideo ? (
        <img
          ref={imageRef}
          alt="Bird Viewer"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            filter: `brightness(${brightness})`,
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

      <IconButton
        onClick={() => handleDeviceIndexChange(1)}
        sx={{
          position: 'absolute',
          right: '10px',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 2,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          color: '#fff',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
          },
        }}
      >
        <ArrowForward />
      </IconButton>

      <IconButton
        onClick={handleFullscreenToggle}
        sx={{
          position: 'absolute',
          bottom: '10px',
          right: '40px',
          zIndex: 2,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          color: '#fff',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
          },
        }}
      >
        {document.fullscreenElement ? <FullscreenExitIcon /> : <FullscreenIcon />}
      </IconButton>
    </Box>
  );
};

export default VideoStream;
