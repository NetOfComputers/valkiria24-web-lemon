// src/components/BirdViewControls.js

import React, { useRef, useState } from 'react';
import { Box } from '@mui/material';
import VideoStream from './modules/VideoStream';
import AudioStream from './modules/AudioStream';
import ControlPanel from './modules/VideoControl';

const BirdViewControls = () => {
  const imageRef = useRef(null);
  const [connectedVideo, setConnectedVideo] = useState(false);
  const [connectedAudio, setConnectedAudio] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [brightness, setBrightness] = useState('100%');
  const [playingAudio, setPlayingAudio] = useState(false);

  const handleSettingsOpen = () => setSettingsOpen(true);
  const handleSettingsClose = () => setSettingsOpen(false);

  const handleBrightnessChange = (change) => () => {
    setBrightness((prev) => {
      const newValue = Math.min(Math.max(parseFloat(prev) + change * 100, 0), 100);
      return `${newValue}%`;
    });
  };

  const handleRescaleValueChange = (direction) => () => {
    // Your rescale logic here
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    // Start recording logic here
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    // Stop recording logic here
  };

  const handleDeviceIndexChange = (direction) => {
    // Your device change logic here
  };

  const handleFullscreenToggle = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <Box>
      <VideoStream
        connectedVideo={connectedVideo}
        setConnectedVideo={setConnectedVideo}
        brightness={brightness}
        imageRef={imageRef}
        handleDeviceIndexChange={handleDeviceIndexChange}
        handleFullscreenToggle={handleFullscreenToggle}
      />
      <AudioStream
        connectedAudio={connectedAudio}
        setConnectedAudio={setConnectedAudio}
        setPlayingAudio={setPlayingAudio}
      />
      <ControlPanel
        handleSettingsOpen={handleSettingsOpen}
        settingsOpen={settingsOpen}
        handleSettingsClose={handleSettingsClose}
        handleRescaleValueChange={handleRescaleValueChange}
        handleBrightnessChange={handleBrightnessChange}
        isRecording={isRecording}
        handleStartRecording={handleStartRecording}
        handleStopRecording={handleStopRecording}
      />aaaaaa
    </Box>
  );
};

export default BirdViewControls;
