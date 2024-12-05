import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, IconButton, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const SettingsDialog = ({ open, onClose, sendControlMessage}) => {
  const handleBrightnessChange = (change) => {
    // Send brightness change WebSocket message
    sendControlMessage(change);
  };

  const handleRescaleValueChange = (change) => {
    // Send rescale change WebSocket message
    sendControlMessage('incrementRescale', change);
  };

  const handleChangeFps = (change) => {
    // Send FPS change WebSocket message
    sendControlMessage(change);
  };

  //This is the model to follow for creating more mehods
  const currentDevice = () => {
    // send action to do and return point of the result
    sendControlMessage('currentDevice', 'on_currentDevice')
  }
  const updateStats = () => {
    //?????
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Settings</DialogTitle>
      <DialogContent>
        <Box mb={2}>
          <IconButton onClick={() => handleRescaleValueChange(-0.035)}><ArrowBackIcon /></IconButton>
          <Typography variant="h6" display="inline" sx={{ mx: 2 }}>Rescale Factor: Unknown</Typography>
          <IconButton onClick={() => handleRescaleValueChange(0.035)}><ArrowForwardIcon /></IconButton>
        </Box>

        {/* <Box mb={2}>
          <IconButton onClick={() => handleChangeFps(-1)}><ArrowBackIcon /></IconButton>
          <Typography variant="h6" display="inline" sx={{ mx: 2 }}>FPS: Unknown</Typography>
          <IconButton onClick={() => handleChangeFps(1)}><ArrowForwardIcon /></IconButton>
        </Box> */}

        {/* <Box mb={2}>
          <IconButton onClick={() => handleBrightnessChange(-0.1)}><Brightness4Icon /></IconButton>
          <Typography variant="h6" display="inline" sx={{ mx: 2 }}>Brightness: Unknown</Typography>
          <IconButton onClick={() => handleBrightnessChange(0.1)}><Brightness7Icon /></IconButton>
        </Box> */}

        {/* GET TEST */}
        {/* <Box mb={2}>
          <IconButton onClick={() => currentDevice()}><Brightness4Icon /></IconButton>
          <Typography variant="h6" display="inline" sx={{ mx: 2 }}>Brightness: Unknown</Typography>
          <IconButton onClick={() => currentDevice()}><Brightness7Icon /></IconButton>
        </Box> */}


      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default SettingsDialog;
