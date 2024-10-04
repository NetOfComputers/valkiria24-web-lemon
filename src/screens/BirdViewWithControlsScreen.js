import React, { useEffect, useRef, useState } from 'react';

import BirdViewControls from '../components/BirdProject/BirdViewWithControls';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Box, Grid } from '@mui/material';


function BirdViewWithControlsScreen() {
  const navigate = useNavigate();
  return (
    <>
      <BirdViewControls></BirdViewControls>
      <Box mt={4} textAlign="center">
        {/* <Typography variant="body1" sx={{ color: '#eee' }}>
          Are you admin?
        </Typography> */}
        <Typography
          variant="body1"
          sx={{
            color: 'red', // Blue link
            textDecoration: 'underline',
            cursor: 'pointer',
            '&:hover': {
              color: 'red', // Darker blue on hover
            },
          }}
          onClick={() => navigate('/bird-view-controls-legacy')}
        >
          Having render issues?
        </Typography>
      </Box>
    </>
  )
};

export default BirdViewWithControlsScreen;