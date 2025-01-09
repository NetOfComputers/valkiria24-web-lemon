import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, IconButton, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const SettingsDialog = ({ open, onClose, sendControlMessage, stats }) => {
  console.log('stats are', stats)
  const { controls } = stats || {};
  console.log('controls are', controls)

  const handleControlChange = (controlName, change) => {
    const control = controls[controlName];
    if (!control) return;
    let newValue = 0
    if (!control.is_menu) {
      // Calculate new value
      newValue = Math.min(
        control.max ?? Infinity,
        Math.max(control.min ?? -Infinity, control.value + change)
      );
    }else{

      const kys = Object.keys(control.options).map(n=>parseInt(n))
      const cIndex = Object.keys(control.options).map(n=>parseInt(n)).indexOf(parseInt(control.value))
      const ch = (change === "+1" ? 1 : -1);
      const nIndex = (cIndex + ch + kys.length) % kys.length;
      const nValue = kys[nIndex]
      // const nValue2 = Object.keys(control.options).map(n=>parseInt(n))[((Object.keys(control.options).map(n=>parseInt(n)).indexOf(parseInt(control.value)) + ((change === "+1" ? 1 : -1)) + Object.keys(control.options).map(n=>parseInt(n)).length) % Object.keys(control.options).map(n=>parseInt(n)).length)]
      newValue = nValue
    }
    // Send control update message
    sendControlMessage(`set_${controlName}_value`, newValue);
  };

  const handleBrightnessChange = (change) => {
    // Send brightness change WebSocket message
    sendControlMessage('incrementBrightness', change);
  };

  const handleRescaleValueChange = (change) => {
    // Send rescale change WebSocket message
    sendControlMessage('incrementRescale', change);
  };
  const handleCompressionValueChange = (change) => {
    sendControlMessage('incrementCompression', change)
  }
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

        <Box mb={2}>
          <IconButton onClick={() => handleCompressionValueChange(-5)}><ArrowBackIcon /></IconButton>
          <Typography variant="h6" display="inline" sx={{ mx: 2 }}>COMP: Unknown</Typography>
          <IconButton onClick={() => handleCompressionValueChange(5)}><ArrowForwardIcon /></IconButton>
        </Box>

        {/* <Box mb={2}>
          <IconButton onClick={() => handleBrightnessChange(-10)}><Brightness4Icon /></IconButton>
          <Typography variant="h6" display="inline" sx={{ mx: 2 }}>Brightness: Unknown</Typography>
          <IconButton onClick={() => handleBrightnessChange(10)}><Brightness7Icon /></IconButton>
        </Box> */}

        {/* <Box mb={2}>
          <IconButton onClick={() => handleBrightnessChange(-10)}>off</IconButton>
          <Typography variant="h6" display="inline" sx={{ mx: 2 }}>manual mode</Typography>
          <IconButton onClick={() => handleBrightnessChange(10)}>on</IconButton>
        </Box>

        
        <Box mb={2}>
          <IconButton onClick={() => handleBrightnessChange(-10)}><Brightness4Icon /></IconButton>
          <Typography variant="h6" display="inline" sx={{ mx: 2 }}>Brightness: Unknown</Typography>
          <IconButton onClick={() => handleBrightnessChange(10)}><Brightness7Icon /></IconButton>
        </Box> */}

        {/* GET TEST */}
        {/* <Box mb={2}>
          <IconButton onClick={() => currentDevice()}><Brightness4Icon /></IconButton>
          <Typography variant="h6" display="inline" sx={{ mx: 2 }}>Brightness: Unknown</Typography>
          <IconButton onClick={() => currentDevice()}><Brightness7Icon /></IconButton>
        </Box> */}
        <>
          {controls &&
            Object.keys(controls).map((controlName) => {
              const control = controls[controlName];
              return (
                <Box key={controlName} mb={2}>
                  <IconButton
                    disabled={control.min === null && control.data_type!="bool"}
                    onClick={() => handleControlChange(controlName, -(control.step || 1))}
                  >
                    <ArrowBackIcon />
                  </IconButton>
                  <Typography variant="h6" display="inline" sx={{ mx: 2 }}>
                    {control.name.charAt(0).toUpperCase() + control.name.slice(1)}: {control.value}
                  </Typography>
                  <IconButton
                    disabled={control.max === null}
                    onClick={() => handleControlChange(controlName, control.step || 1)}
                  >
                    <ArrowForwardIcon />
                  </IconButton>
                </Box>
              );
            })}
        </>

      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default SettingsDialog;
