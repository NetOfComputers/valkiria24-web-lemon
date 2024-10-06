import React, { useState } from 'react';
import { Box, IconButton, CircularProgress, Typography } from '@mui/material';
import ArrowBack from '@mui/icons-material/ArrowBack';
import ArrowForward from '@mui/icons-material/ArrowForward';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import SettingsIcon from '@mui/icons-material/Settings';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import StopIcon from '@mui/icons-material/Stop';

const VideoPlayer = ({ connectedVideo, imageRef, onSettingsOpen, sendControlMessage }) => {
  const [isRecording, setIsRecording] = useState(false);

  const handleFullscreenToggle = () => {
    // Fullscreen logic
  };

  const handleDeviceIndexChange = (change) => {
    sendControlMessage('deviceIndex', change);
  };

  const handleRecordingToggle = () => {
    setIsRecording((prev) => !prev);
    // Lógica para empezar o detener la grabación
  };

  // Actualización de estilos del botón de grabación basados en el estado
  const recordButtonStyles = {
    position: 'absolute',
    bottom: '10px',
    right: '78px',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: isRecording ? 'red' : '#fff',  // El botón cambia de color cuando está grabando
    zIndex: 2,  // Asegura que el botón de grabación esté por encima del video
  };

  return (
    <Box sx={videoContainerStyles}>
      {/* Left arrow (back) */}
      <IconButton onClick={() => handleDeviceIndexChange(-1)} sx={{ ...arrowButtonStyles, left: '10px' }}>
        <ArrowBack />
      </IconButton>

      {connectedVideo ? (
        <img ref={imageRef} alt="Live stream" style={videoStyles} />
      ) : (
        <Box display="flex" alignItems="center" flexDirection="column">
          <CircularProgress />
          <Typography variant="body1" color="error" mt={2}>
            Connecting to WebSocket for video...
          </Typography>
        </Box>
      )}

      {/* Right arrow (forward) */}
      <IconButton onClick={() => handleDeviceIndexChange(1)} sx={{ ...arrowButtonStyles, right: '10px' }}>
        <ArrowForward />
      </IconButton>

      {/* Fullscreen button */}
      <IconButton onClick={handleFullscreenToggle} sx={fullscreenButtonStyles}>
        {document.fullscreenElement ? <FullscreenExitIcon /> : <FullscreenIcon />}
      </IconButton>

      {/* Recording button */}
      <IconButton onClick={handleRecordingToggle} sx={recordButtonStyles}>
        {isRecording ? <StopIcon /> : <FiberManualRecordIcon />}
      </IconButton>

      {/* Settings button */}
      <IconButton onClick={onSettingsOpen} sx={settingsButtonStyles}>
        <SettingsIcon />
      </IconButton>
    </Box>
  );
};

const videoContainerStyles = {
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
};

const arrowButtonStyles = {
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  color: '#fff',
  zIndex: 2,  // Asegura que los botones de flecha estén por encima del video
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
};

const fullscreenButtonStyles = {
  position: 'absolute',
  bottom: '10px',
  right: '30px',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  color: '#fff',
  zIndex: 2,  // Asegura que el botón de pantalla completa esté por encima del video
};

const settingsButtonStyles = {
  position: 'absolute',
  bottom: '10px',
  right: '126px',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  color: '#fff',
  zIndex: 2,  // Asegura que el botón de configuración esté por encima del video
};

const videoStyles = {
  width: '100%',
  height: '100%',
  objectFit: 'contain',
  filter: 'brightness(1)',
  transform: 'rotate(180deg)',
  pointerEvents: 'none',  // Previene que el video bloquee la interacción con los botones
};
// const recordButtonStyles = {
//     position: 'absolute',
//     bottom: '10px',
//     right: '78px',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     color: isRecording ? 'red' : '#fff',  // El botón cambia de color cuando está grabando
//     zIndex: 2,  // Asegura que el botón de grabación esté por encima del video
// };
export default VideoPlayer;
