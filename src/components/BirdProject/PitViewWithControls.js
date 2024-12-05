import React, { useEffect, useRef, useState } from 'react';
import { Container, Box, Typography } from '@mui/material';
import AudioStatus from './modules/AudioStatus';
import VideoPlayer from './modules/VideoPitPlayerLegacy';
import SettingsDialog from './modules/SettingsDialog';
import { useNavigate } from 'react-router-dom';

// import { WS_VIDEO_SERVER_URL, WS_VIDEO_CONTROL_SERVER_URL, WS_AUDIO_SERVER_URL } from './constants';
const WS_VIDEO_SERVER_URL = 'wss://bluejims.com:8762';
const WS_VIDEO_CONTROL_SERVER_URL = 'wss://bluejims.com:8642';
const WS_AUDIO_SERVER_URL = 'wss://bluejims.com:7662';

function BirdViewControls() {
  const [connectedVideo, setConnectedVideo] = useState(false);
  const [connectedVideoControl, setConnectedVideoControl] = useState(false);
  const [connectedAudio, setConnectedAudio] = useState(false);
  const [playingAudio, setPlayingAudio] = useState(false);
  const [deviceIndex, setDeviceIndex] = useState(0);
  const [brightness, setBrightness] = useState(1); // Default brightness at 1 (normal)
  const [isRecording, setIsRecording] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [stats, setStats] = useState({});
  const imageRef = useRef(null);
  const wsVideoRef = useRef(null);
  const wsVideoControlRef = useRef(null);
  const wsAudioRef = useRef(null);
  const audioContextRef = useRef(null);

  const navigate = useNavigate();

  const handleFullscreenToggle = () => {
    if (!document.fullscreenElement) {
      imageRef.current.parentNode.requestFullscreen();
    } else {
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
      wsVideoControlRef.current.send(JSON.stringify({ role: 'webclient', value: 'nothing' }));
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
      console.log('Received message at videoControl', event.data);

      if (JSON.parse(event.data).action == 'currentStats') {
        try {
          const stats = JSON.parse(event.data).result;
          setStats(stats);
        } catch (error) {
          console.error('Error parsing stats message:', error);
        }
      }
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
      console.log('sending', message);
      wsVideoControlRef.current.send(message);
    }
  };

  const handleDeviceIndexChange = (change) => {
    const newIndex = deviceIndex + change;
    setDeviceIndex(newIndex);
    sendControlMessage('deviceIndex', change);
  };

  const handleBrightnessChange = (change) => {
    sendControlMessage('brightness', change);
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    sendControlMessage('startRecording', true);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    sendControlMessage('stopRecording', true);
  };

  // Poll FPS from wsVideoRef
  useEffect(() => {
    const fetchStats = () => {
      /*if (wsVideoRef.current) {
        wsVideoRef.current.send(JSON.stringify({ action: 'currentStats' }));
      }*/
      sendControlMessage('currentStats', 'on_currentStats');
    };

    /*const handleStatsMessage = (event) => {
      try {
        const stats = JSON.parse(event.data);
        if (stats.fps !== undefined) {
          setFps(stats.fps);
        }
      } catch (error) {
        console.error('Error parsing stats message:', error);
      }
    };*/

    if (wsVideoRef.current) {
      // wsVideoRef.current.addEventListener('message', handleStatsMessage);
    }

    const interval = setInterval(fetchStats, 6000);

    return () => {
      if (wsVideoRef.current) {
        // wsVideoRef.current.removeEventListener('message', handleStatsMessage);
      }
      clearInterval(interval);
    };
  }, []);

  // WebSocket for video stream
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

  //Webscoket for audio stream
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

  //set video connected to true after 3 seconds
  useEffect(() => {
    const timeout = setTimeout(() => {
      setConnectedVideo(true);
    }, 3000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <Container maxWidth="md" sx={containerStyles}>
      <Box mb={3}>
        <Typography variant="h2" sx={titleStyles}>PITs VIEWER</Typography>
        <Typography variant="body1" sx={subTitleStyles}>
          Lots of pits, like 2 or something! Enjoy the view and control the camera.
        </Typography>
        {JSON.stringify(stats) !== '{}' && (
          <>
            <Typography variant="body2" sx={{ color: '#999', marginTop: '10px' }}>
              FPS: {stats.fps}
            </Typography>
            <Typography variant="body2" sx={{ color: '#999', marginTop: '10px' }}>
              MBs: {stats.mbs}
            </Typography>
          </>

        )}
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
        handleFullscreenToggle={handleFullscreenToggle}
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