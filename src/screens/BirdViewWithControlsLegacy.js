import React, { useEffect, useRef, useState } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import {
  Container,
  Box,
  Typography,
  IconButton,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  ArrowBack,
  ArrowForward,
  Brightness4 as Brightness4Icon,
  Brightness7 as Brightness7Icon,
  Fullscreen as FullscreenIcon,
  FullscreenExit as FullscreenExitIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';


import { useNavigate } from 'react-router-dom';

const WS_VIDEO_SERVER_URL = 'wss://bluejims.com:8765';
const WS_VIDEO_CONTROL_SERVER_URL = 'wss://bluejims.com:8764';
const WS_AUDIO_SERVER_URL = 'wss://bluejims.com:8766';

function BirdViewControls() {
  const [connectedVideo, setConnectedVideo] = useState(false);
  const [connectedVideoControl, setConnectedVideoControl] = useState(false);
  const [connectedAudio, setConnectedAudio] = useState(false);
  const [playingAudio, setPlayingAudio] = useState(false);
  const [deviceIndex, setDeviceIndex] = useState(0);
  const [brightness, setBrightness] = useState(1); // Default brightness at 1 (normal)
  const [isRecording, setIsRecording] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const imageRef = useRef(null);
  const wsVideoRef = useRef(null);
  const wsVideoControlRef = useRef(null);
  const wsAudioRef = useRef(null);
  const audioContextRef = useRef(null);
  const navigate = useNavigate();
  const handleFullscreenToggle = () => {
    if (!document.fullscreenElement) {
      // Request full-screen mode on the video container
      imageRef.current.parentNode.requestFullscreen();
    } else {
      // Exit full-screen mode
      document.exitFullscreen();
    }
  };
  const handleSettingsOpen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    setSettingsOpen(true);
  };

  const handleSettingsClose = () => {
    setSettingsOpen(false);
  };
  // WebSocket for video control
  useEffect(() => {
    wsVideoControlRef.current = new WebSocket(WS_VIDEO_CONTROL_SERVER_URL);

    wsVideoControlRef.current.onopen = () => {
      console.log('WebSocket for videoControl connected');
      setConnectedVideoControl(true);
    };

    wsVideoControlRef.current.onclose = (event) => {
      console.log('WebSocket for videoControl disconnected', event);
      setConnectedVideoControl(false);
    };

    wsVideoControlRef.current.onerror = (error) => {
      console.error('WebSocket for videoControl error:', error);
    };

    wsVideoControlRef.current.onmessage = (event) => {
      console.log('Received message at videoControl', event);
    };

    return () => {
      if (wsVideoControlRef.current) {
        wsVideoControlRef.current.close();
      }
    };
  }, []);

  const sendControlMessage = (action, value) => {
    if (wsVideoControlRef.current && wsVideoControlRef.current.readyState === WebSocket.OPEN) {
      const message = JSON.stringify({ action, value });
      console.log('sending', message)
      wsVideoControlRef.current.send(message);
    }
  };

  const handleDeviceIndexChange = (change) => {
    //This is unnecesxary
    const newIndex = deviceIndex + change;
    setDeviceIndex(newIndex);


    sendControlMessage('deviceIndex', change);
  };

  const handleRescaleValueChange = (change) => {
    sendControlMessage('rescale', change);
  };
  const handleBrightnessChange = (change) => {
    sendControlMessage('brightness', change);
  };
  const handleChangeFps = (change) => {
    sendControlMessage('fps', change);
  };
  const handleStartRecording = () => {
    setIsRecording(true);
    sendControlMessage('startRecording', true);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    sendControlMessage('stopRecording', true);
  };

  // WebSocket for video stream (same as before)
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
  }, []);

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
          BIRD VIEWER
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
      {/* Display the video */}
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
        {/* Left Arrow */}
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

        {/* Video */}
        {connectedVideo ? (
          <img
            ref={imageRef}
            alt=""
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              filter: `brightness(${brightness})`,
              transform: 'rotate(180deg)', // This adds the rotation
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

        {/* Right Arrow */}
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

        {/* Fullscreen Button */}
        <IconButton
          onClick={handleFullscreenToggle}
          sx={{
            position: 'absolute',
            bottom: '10px',
            right: '30px',
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

        {/* Settings Button */}
        <IconButton
          onClick={handleSettingsOpen}
          sx={{
            position: 'absolute',
            bottom: '10px',
            right: '78px',
            zIndex: 2,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            color: '#fff',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
            },
          }}
        >
          <SettingsIcon />
        </IconButton>
      </Box>

      {/* Settings Dialog */}
      <Dialog open={settingsOpen} onClose={handleSettingsClose}>
        <DialogTitle>Settings</DialogTitle>
        <DialogContent>
          {/* Device rescale factor Controls */}
          <Box mb={2}>
            <IconButton onClick={() => handleRescaleValueChange(-0.1)}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6" display="inline" sx={{ mx: 2 }}>
              Rescale Factor: Unknown
            </Typography>
            <IconButton onClick={() => handleRescaleValueChange(0.1)}>
              <ArrowForwardIcon />
            </IconButton>
          </Box>

          {/* Device fps Controls */}
          <Box mb={2}>
            <IconButton onClick={() => handleChangeFps(-5)}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6" display="inline" sx={{ mx: 2 }}>
              Fps: Unknown
            </Typography>
            <IconButton onClick={() => handleChangeFps(5)}>
              <ArrowForwardIcon />
            </IconButton>
          </Box>

          {/* Brightness Controls */}
          <Box mb={2}>
            <IconButton onClick={() => handleBrightnessChange(-6)}>
              <Brightness4Icon />
            </IconButton>
            <Typography variant="h6" display="inline" sx={{ mx: 2 }}>
              Brightness
            </Typography>
            <IconButton onClick={() => handleBrightnessChange(6)}>
              <Brightness7Icon />
            </IconButton>
          </Box>

          {/* Recording Controls */}
          {/* <Box mb={2}>
            {isRecording ? (
              <Button variant="contained" color="error" onClick={handleStopRecording}>
                Stop Recording
              </Button>
            ) : (
              <Button variant="contained" color="primary" onClick={handleStartRecording}>
                Start Recording
              </Button>
            )}
          </Box> */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSettingsClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default BirdViewControls;