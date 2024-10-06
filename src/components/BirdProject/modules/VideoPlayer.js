import React, { useState } from 'react';
import { Box, IconButton, CircularProgress, Typography } from '@mui/material';
import ArrowBack from '@mui/icons-material/ArrowBack';
import ArrowForward from '@mui/icons-material/ArrowForward';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import SettingsIcon from '@mui/icons-material/Settings';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import StopIcon from '@mui/icons-material/Stop';

const VideoPlayer = ({ connectedVideo, imageRef, onSettingsOpen, sendControlMessage, handleStartRecording, handleStopRecording }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [frames, setFrames] = useState([]); // Store frames

    const handleRecordingToggle = () => {
        setIsRecording((prev) => !prev);

        if (isRecording) {
            console.log('stop recording');
            handleStopRecording();
            generateVideo(); // Generate and download the video when stopping
        } else {
            console.log('start recording');
            handleStartRecording();
        }
    };

    const generateVideo = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (frames.length === 0) {
            console.error("No frames captured to create video.");
            return;
        }

        const img = new Image();
        img.src = frames[0];
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;

            const videoChunks = [];

            const drawFrame = (src) => {
                return new Promise((resolve) => {
                    const img = new Image();
                    img.src = src;
                    img.onload = () => {
                        ctx.drawImage(img, 0, 0);
                        canvas.toBlob((blob) => {
                            videoChunks.push(blob);
                            resolve();
                        }, 'video/webm');
                    };
                });
            };

            const drawFrames = async () => {
                for (const frame of frames) {
                    await drawFrame(frame);
                }

                const videoBlob = new Blob(videoChunks, { type: 'video/webm' });
                const videoUrl = URL.createObjectURL(videoBlob);
                const link = document.createElement('a');
                link.href = videoUrl;
                link.download = 'output.webm';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(videoUrl);
            };

            drawFrames();
        };
    };

    return (
        <Box sx={videoContainerStyles}>
            {/* Replace with your image display logic */}
            <img ref={imageRef} alt="Live stream" style={{ width: '100%', height: 'auto' }} />
            <IconButton onClick={handleRecordingToggle} sx={recordButtonStyles}>
                {isRecording ? <StopIcon /> : <FiberManualRecordIcon />}
            </IconButton>
        </Box>
    );
};

const recordButtonStyles = {
    position: 'absolute',
    bottom: '10px',
    right: '78px',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: isRecording ? 'red' : '#fff',  // El botón cambia de color cuando está grabando
    zIndex: 2,  // Asegura que el botón de grabación esté por encima del video
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

export default VideoPlayer;
