import React, { useEffect, useRef, useState } from 'react';

import BirdViewControls from '../components/BirdProject/BirdViewWithControls';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Box, Grid } from '@mui/material';


function BirdViewWithControlsScreen() {
  const navigate = useNavigate();
  return (
    
      <BirdViewControls></BirdViewControls>
    
  )
};

export default BirdViewWithControlsScreen;