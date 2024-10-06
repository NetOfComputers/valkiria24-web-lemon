import React, { useEffect, useState } from 'react';
import { Typography, Button, Box, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  const [birdPosition, setBirdPosition] = useState(0);
  const [isBirdVisible, setIsBirdVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setBirdPosition((prev) => {
        if (prev >= 100) {
          setIsBirdVisible(false); // Hide the bird when it reaches the end
          setTimeout(() => {
            setBirdPosition(0); // Reset the bird's position to the left side
            setTimeout(() => {setIsBirdVisible(true);}, 1000) // Make the bird visible again
          }, 1000); // Add a small delay before reappearing
          return prev;
        }
        return prev + 1; // Move the bird 1% at a time
      });
    }, 50); // Adjust speed here

    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100vh',
        background: 'linear-gradient(45deg, #700255, #24019f)',
        backgroundSize: '400% 400%',
        animation: 'gradient 15s ease infinite',
        '@keyframes gradient': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      }}
    >
      {/* Bird element */}
      {isBirdVisible && ( // Conditionally render the bird
        <Box
          sx={{
            position: 'absolute',
            top: '30%', // Position the bird above the button
            left: `${birdPosition}%`, // Move bird horizontally across the button
            transition: 'left 0.05s linear',
            width: '200px',
            height: '200px',
            backgroundImage: 'url(https://i.pinimg.com/originals/a6/d4/7a/a6d47abcb3101e81f62a6041abed48eb.gif)', // Replace with your bird image URL or an icon
            backgroundSize: 'cover',
            // transform: 'scaleX(-1)', // Flip the bird horizontally
            opacity: birdPosition >= 100 ? 0 : 1, // Hide when it reaches 100%
          }}
        />
      )}
      <Box textAlign="center" mb={4} sx={{
        zIndex: 1,
      }}>
        <Typography
          variant="h2"
          sx={{
            fontWeight: 'bold',
            fontSize: { xs: '2rem', sm: '3rem' },
            color: '#fff',
            mb: 2,
          }}
        >
          Services
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: '1.25rem',
            color: '#eee',
            maxWidth: '500px',
            margin: 'auto',
          }}
        >
          Created by Jaime Roman. Appreciate
        </Typography>
      </Box>

      {/* Buttons with adjusted layout for mobile */}
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={10} sm={6} md={4}>
          <Box sx={{ position: 'relative', width: '100%' }}>

            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={() => navigate('/bird-view')}
              sx={{
                padding: '12px 24px',
                fontSize: '1rem',
                backgroundColor: '#000',
                maxWidth: { xs: '100%', sm: '100%', md: '100%' }, // Limit button width on mobile
                margin: '0 auto', // Center button on smaller screens
                '&:hover': {
                  backgroundColor: '#333',
                },
              }}
            >
              View Birds
            </Button>
          </Box>
        </Grid>
      </Grid>

      <Box mt={4} textAlign="center">
        <Typography
          variant="body1"
          sx={{
            color: 'whitesmoke',
            textDecoration: 'underline',
            cursor: 'pointer',
            '&:hover': {
              color: '#0056b3',
            },
          }}
          onClick={() => navigate('/admin')}
        >
          Are you admin?
        </Typography>
      </Box>
    </Box>
  );
}

export default Home;
