import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';

const AudioStatus = ({ connectedAudio, playingAudio }) => {
  return (
    <Box sx={audioStatusStyles}>
      {connectedAudio ? (
        playingAudio ? (
          <Typography variant="h5" color="success">Audio is playing...</Typography>
        ) : (
          <Typography variant="h5" color="warning">Waiting for audio stream...</Typography>
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
  );
};

const audioStatusStyles = {
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
};

export default AudioStatus;
