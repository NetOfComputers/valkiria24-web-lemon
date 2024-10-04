// src/components/ControlPanel.js

import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import SettingsIcon from '@mui/icons-material/Settings';

const ControlPanel = ({
  handleSettingsOpen,
  settingsOpen,
  handleSettingsClose,
  handleRescaleValueChange,
  handleChangeFps,
  handleBrightnessChange,
  isRecording,
  handleStartRecording,
  handleStopRecording,
}) => {
  return (
    <>
      <IconButton
        onClick={handleSettingsOpen}
        sx={{
          position: 'absolute',
          bottom: '10px',
          right: '10px',
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

      <Dialog open={settingsOpen} onClose={handleSettingsClose}>
        <DialogTitle>Settings</DialogTitle>
        <DialogContent>
          {/* Add form fields for rescale, fps, brightness, etc. */}
          <Typography gutterBottom>Adjust Brightness</Typography>
          <IconButton onClick={handleBrightnessChange(-0.1)}>
            <Brightness4Icon />
          </IconButton>
          <IconButton onClick={handleBrightnessChange(0.1)}>
            <Brightness7Icon />
          </IconButton>
          {/* Additional settings can be added here */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSettingsClose}>Close</Button>
        </DialogActions>
      </Dialog>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <IconButton onClick={handleRescaleValueChange(-1)}>
          <ArrowBackIcon />
        </IconButton>
        <IconButton onClick={handleRescaleValueChange(1)}>
          <ArrowForwardIcon />
        </IconButton>
        <Button
          variant="contained"
          onClick={isRecording ? handleStopRecording : handleStartRecording}
        >
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </Button>
      </Box>
    </>
  );
};

export default ControlPanel;
