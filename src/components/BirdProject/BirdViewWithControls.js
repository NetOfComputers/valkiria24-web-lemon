import React, { useEffect, useRef, useState } from 'react';
import { Container, Box, Typography, CircularProgress } from '@mui/material';
import AudioStatus from './modules/AudioStatus';
import VideoPlayer from './modules/VideoPlayer';
import SettingsDialog from './modules/SettingsDialog';
import { useNavigate } from 'react-router-dom';
// import { WS_VIDEO_SERVER_URL, WS_VIDEO_CONTROL_SERVER_URL, WS_AUDIO_SERVER_URL } from './constants';
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

  const [frames, setFrames] = useState([]); // Array to hold image URLs


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

  // WebSocket for audio stream
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
  }, [imageRef]);

  

  return (
    <Container maxWidth="md" sx={containerStyles}>
      <Box mb={3}>
        <Typography variant="h2" sx={titleStyles}>BIRD VIEWER</Typography>
        <Typography variant="body1" sx={subTitleStyles}>
          View live video and listen to audio of your "perejiles" online.
        </Typography>
      </Box>

      {/* AudioStatus Component */}
      <AudioStatus connectedAudio={connectedAudio} playingAudio={playingAudio} />

      {/* VideoPlayer Component */}
      <VideoPlayer
        connectedVideo={connectedVideo}
        imageRef={imageRef}
        sendControlMessage={sendControlMessage}
        handleStartRecording={handleStartRecording}
        handleStopRecording={handleStopRecording}
        onSettingsOpen={handleSettingsOpen}
      />

      {/* Settings Dialog */}
      <SettingsDialog
        open={settingsOpen}
        onClose={handleSettingsClose}
        sendControlMessage={sendControlMessage}
      />
    </Container>
  );
}

const containerStyles = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  padding: '2rem',
  backgroundColor: '#f0f0f0',
  textAlign: 'center',
};

const titleStyles = {
  fontWeight: 'bold',
  fontSize: { xs: '2rem', sm: '3rem' },
  color: '#333',
};

const subTitleStyles = {
  fontSize: '1.25rem',
  color: '#666',
  maxWidth: '600px',
  margin: 'auto',
};

export default BirdViewControls;