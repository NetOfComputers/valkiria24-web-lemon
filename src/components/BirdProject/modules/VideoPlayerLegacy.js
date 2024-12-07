import React, { useState } from 'react';
import { Box, IconButton, CircularProgress, Typography, Button } from '@mui/material';
import ArrowBack from '@mui/icons-material/ArrowBack';
import ArrowForward from '@mui/icons-material/ArrowForward';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import SettingsIcon from '@mui/icons-material/Settings';
import CropRotateIcon from '@mui/icons-material/CropRotate';
const VideoPlayer = ({ connectedVideo, imageRef, onSettingsOpen, sendControlMessage, handleFullscreenToggle }) => {
    const [isRotated, setIsRotated] = useState(false);

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

    return (
        <Box sx={videoContainerStyles}>
            {/* Left arrow (back) */}
            <IconButton onClick={() => handleDeviceIndexChange(-1)} sx={{ ...arrowButtonStyles, left: '10px' }}>
                <ArrowBack />
            </IconButton>

            {connectedVideo ? (
                <img
                    ref={imageRef}
                    alt="Live stream"
                    style={{
                        ...videoStyles,
                        transform: isRotated ? 'rotate(180deg)' : 'none', // Dynamic rotation
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

            {/* Right arrow (forward) */}
            <IconButton onClick={() => handleDeviceIndexChange(1)} sx={{ ...arrowButtonStyles, right: '10px' }}>
                <ArrowForward />
            </IconButton>

            {/* Fullscreen button */}
            <IconButton onClick={handleFullscreenToggle} sx={fullscreenButtonStyles}>
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
            >
                
            </CropRotateIcon>
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
    height: '100%',
    objectFit: 'contain',
    filter: 'brightness(1)',
    pointerEvents: 'none',
};

export default VideoPlayer;
