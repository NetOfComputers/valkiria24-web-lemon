import React, { useState, useEffect } from 'react';
import { Box, IconButton, CircularProgress, Typography } from '@mui/material';
import ArrowBack from '@mui/icons-material/ArrowBack';
import ArrowForward from '@mui/icons-material/ArrowForward';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import SettingsIcon from '@mui/icons-material/Settings';
import CropRotateIcon from '@mui/icons-material/CropRotate';

const VideoPlayerLegacy = ({ connectedVideo, imageRef, onSettingsOpen, sendControlMessage, handleFullscreenToggle }) => {
  const [isRotated, setIsRotated] = useState(false);
  const [showRotatePrompt, setShowRotatePrompt] = useState(false);
  const [lastClickTime, setLastClickTime] = useState(0);
  const handleImageClick = (event) => {
    const now = Date.now();

    // If the time between clicks is less than 250ms, it's considered a double-click
    if (now - lastClickTime < 250) {
      console.log('Double left-click detected');
      if (!imageRef.current) return;

      // Get bounding rectangle of the image element
      const rect = imageRef.current.getBoundingClientRect();

      // Get the click position relative to the rescaled image
      const clickX = event.clientX - rect.left; // X-coordinate on the rescaled image
      const clickY = event.clientY - rect.top;  // Y-coordinate on the rescaled image

      // Normalize the coordinates (0 to 1)
      const normalizedX = clickX / rect.width;
      const normalizedY = clickY / rect.height;

      // Scale to original image size (1280x720)
      const originalX = normalizedX * 1280;
      const originalY = normalizedY * 720;
      console.log(`Relative click position within image: X=${originalX}, Y=${originalY}`);
      
      const offsetX = imageRef.current.naturalWidth/2
      const offsetY = imageRef.current.naturalHeight/2
      
      // console.log('Will send some like: ', {
      //   x: originalX - offsetX,
      //   y: originalY - offsetY
      // })
      // console.log('Will send some like: ', {
      //   x: originalX,
      //   y: originalY
      // })
      //IF THE CAMERA CUTS FRAMES BECAUSE IS BAD THIS IS NOT GOING TO WORK like with pool camera

      sendControlMessage('switchCropOrRescale', 'o')
      sendControlMessage('setCrop', {
        x: originalX - offsetX,
        y: originalY - offsetY
      })
    }
    setLastClickTime(now);
  };

  const handleDeviceIndexChange = (change) => {
    if (change > 0) {
      sendControlMessage('prevDevice', 'on_prevDevice');
    } else {
      sendControlMessage('nextDevice', 'on_nextDevice');
    }
  };

  const toggleRotation = () => {
    setIsRotated((prev) => !prev);
  };

  const isMobileDevice = () => {
    return /Mobi|Android/i.test(navigator.userAgent);
  };

  const checkMobileOrientation = async () => {
    if (isMobileDevice()) {
      const isMobilePortrait = window.matchMedia("(orientation: portrait)").matches;
      //   setShowRotatePrompt(isMobilePortrait);

      if (isMobilePortrait) {
        try {
          await window.screen.orientation.lock("landscape");
        } catch (error) {
          console.error("Orientation lock not supported or failed:", error);
        }
      }
    }
  };

  useEffect(() => {
    checkMobileOrientation();
    window.addEventListener('orientationchange', checkMobileOrientation);
    window.addEventListener('resize', checkMobileOrientation);

    return () => {
      window.removeEventListener('orientationchange', checkMobileOrientation);
      window.removeEventListener('resize', checkMobileOrientation);
    };
  }, []);

  const handleFullscreenButtonClick = async () => {
    if (isMobileDevice()) {
      try {
        await window.screen.orientation.lock("landscape");
      } catch (error) {
        console.error("Failed to lock screen orientation:", error);
      }
    }

    handleFullscreenToggle();
  };

  return (
    <Box sx={videoContainerStyles}>
      {/* Left arrow */}
      <IconButton onClick={() => handleDeviceIndexChange(-1)} sx={{ ...arrowButtonStyles, left: '10px' }}>
        <ArrowBack />
      </IconButton>

      {connectedVideo ? (
        <img
          ref={imageRef}
          onClick={handleImageClick}
          alt="Live stream"
          style={{
            ...videoStyles,
            transform: isRotated ? 'rotate(180deg)' : 'none',
            height: imageRef.current ? `${imageRef.current.height}px` : 'auto', // Dynamically set height
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

      {/* Right arrow */}
      <IconButton onClick={() => handleDeviceIndexChange(1)} sx={{ ...arrowButtonStyles, right: '10px' }}>
        <ArrowForward />
      </IconButton>

      {/* Fullscreen button */}
      <IconButton onClick={handleFullscreenButtonClick} sx={fullscreenButtonStyles}>
        {document.fullscreenElement ? <FullscreenExitIcon /> : <FullscreenIcon />}
      </IconButton>

      {/* Settings button */}
      <IconButton onClick={onSettingsOpen} sx={settingsButtonStyles}>
        <SettingsIcon />
      </IconButton>

      {/* Rotate button */}
      <CropRotateIcon
        onClick={toggleRotation}
        sx={{
          position: 'absolute',
          bottom: '10px',
          left: '10px',
          stroke: 'black',
          fill: 'white',
          zIndex: 20,
        }}
      />

      {/* Rotate Prompt UI */}
      {showRotatePrompt && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.7)',
            color: 'white',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            zIndex: 100,
          }}
        >
          <Typography variant="h6" mb={2}>
            Rotating your screen...
          </Typography>
        </Box>
      )}
    </Box>
  );
};

// Define missing styles
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
  zIndex: 2,
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
  zIndex: 2,
};

const settingsButtonStyles = {
  position: 'absolute',
  bottom: '10px',
  right: '78px',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  color: '#fff',
  zIndex: 2,
};

const videoStyles = {
  width: '100%',
  objectFit: 'contain',
  filter: 'brightness(1)',
  pointerEvents: 'cursor',
};

export default VideoPlayerLegacy;
