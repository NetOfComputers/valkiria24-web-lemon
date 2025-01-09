import React, { useEffect, useRef, useState } from 'react';

import BirdViewControls from '../components/BirdProject/PitViewWithControls';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Box, Grid } from '@mui/material';
import TunerViewWithPitchJs from '../components/TunerProject/TunerViewWithPitchJs'

function PitViewWithControlsScreen() {
  const navigate = useNavigate();
  return (
    
      // <BirdViewControls></BirdViewControls>
      <TunerViewWithPitchJs></TunerViewWithPitchJs>
    
  )
};

export default PitViewWithControlsScreen;