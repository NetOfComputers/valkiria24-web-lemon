import React, { useEffect, useRef, useState } from 'react';
import { Typography, Button, Box, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import birdGif from '../media/bird2.gif'; // Import your bird GIF

function Home() {
  const initialWidth = useRef(window.innerWidth);
  const navigate = useNavigate();
  const resetDelay = 10000; // 10 seconds delay before bird starts again
  const [birdGroups, setBirdGroups] = useState({
    periquitos: {
      birds: [
        { x: -200, y: 100, delay: 0, speed: 5, isVisible: false, timeRemaining: resetDelay / 1000, name: 'Jim' },
        { x: -300, y: 200, delay: 500, speed: 8, isVisible: false, timeRemaining: resetDelay / 1000, name: 'Pollo' },
        { x: -400, y: 150, delay: 1000, speed: 4, isVisible: false, timeRemaining: resetDelay / 1000, name: 'Blue' },
        { x: -500, y: 250, delay: 1500, speed: 6, isVisible: false, timeRemaining: resetDelay / 1000, name: 'Pipa' },
      ]
    }
  });

  const [tooltip, setTooltip] = useState({ visible: false, name: '', x: 0, y: 0 });

  useEffect(() => {
    const intervals = birdGroups.periquitos.birds.map((bird, index) => {
      // Set an initial timeout for each bird to appear after its delay
      setTimeout(() => {
        setBirdGroups((prevBirdGroups) => {
          const updatedBirds = prevBirdGroups.periquitos.birds.map((b, i) => {
            if (i === index) {
              return { ...b, isVisible: true };
            }
            return b;
          });
          return { ...prevBirdGroups, periquitos: { birds: updatedBirds } };
        });
      }, bird.delay);

      //Preserve  the window size
      window.addEventListener('resize', () => {
        // console.log('Window resized', window.innerWidth);
        initialWidth.current = window.innerWidth;
      });

      // Start interval to move birds according to their speed
      return setInterval(() => {
        setBirdGroups((prevBirdGroups) => {
          const updatedBirds = prevBirdGroups.periquitos.birds.map((b, i) => {
            if (i === index) {
              
              if (b.x >= initialWidth.current) {
                // console.log('used window size', initialWidth);
                // When the bird goes off-screen, reset its position and start the countdown
                return { ...b, isVisible: false, x: -200, timeRemaining: resetDelay / 1000 };
              }

              if (b.x === -200 && !b.isVisible) {
                return b; // Wait until the countdown finishes
              }

              // Move bird to the right using its unique speed
              return { ...b, x: b.x + b.speed };
            }
            return b;
          });

          return {
            ...prevBirdGroups,
            periquitos: { birds: updatedBirds }
          };
        });
      }, 50); // Adjust movement interval (50ms means birds move every 50ms)
    });

    const countdownIntervals = birdGroups.periquitos.birds.map((bird, index) => {
      return setInterval(() => {
        setBirdGroups((prevBirdGroups) => {
          const updatedBirds = prevBirdGroups.periquitos.birds.map((b, i) => {
            if (i === index && !b.isVisible && b.timeRemaining > 0) {
              return { ...b, timeRemaining: b.timeRemaining - 1 }; // Decrease time remaining by 1 second
            }
            if (i === index && b.timeRemaining <= 0 && !b.isVisible) {
              return { ...b, isVisible: true }; // Show the bird again when the timer is up
            }
            return b;
          });

          return { ...prevBirdGroups, periquitos: { birds: updatedBirds } };
        });
      }, 1000); // Update the timer every 1 second
    });

    return () => {
      intervals.forEach(clearInterval); // Clean up intervals on unmount
      countdownIntervals.forEach(clearInterval); // Clean up countdown intervals
    };
  }, []);

  const handleMouseEnter = (bird) => {
    setTooltip({ visible: true, name: bird.name, x: bird.x + 50, y: bird.y }); // Position the tooltip to the right of the bird
  };

  const handleMouseLeave = () => {
    setTooltip({ visible: false, name: '', x: 0, y: 0 });
  };

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
      {/* Render each bird in the group */}
      {birdGroups.periquitos.birds.map((bird, index) => (
        <Box key={index}>
          {bird.isVisible ? (
            // Bird is visible and moving
            <Box
              onMouseEnter={() => handleMouseEnter(bird)}
              onMouseLeave={handleMouseLeave}
              sx={{
                position: 'absolute',
                top: `${bird.y}px`,  // Bird's vertical position
                left: `${bird.x}px`, // Bird's horizontal position (changing over time)
                width: '100px', // Adjust the bird's size as needed
                height: '100px',
                backgroundImage: `url(${birdGif})`, // Use bird GIF as background image
                backgroundSize: 'cover',
                transform: 'scaleX(-1)', // Flip bird horizontally if needed
                transition: 'left 0.05s linear',  // Smooth movement
              }}
            />
          ) : (
            // Bird is not visible, display time remaining
            <Box
              sx={{
                position: 'absolute',
                top: `${bird.y}px`,
                left: `20px`, // Fix position on the left side
                color: 'white',
                fontSize: '18px',
                backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background for readability
                padding: '5px',
                borderRadius: '5px',
                display: 'None', // Hide the countdown for now
              }}
            >
              {`Time until next flight: ${bird.timeRemaining}s`}
            </Box>
          )}
        </Box>
      ))}

      {/* Tooltip for displaying bird names */}
      {tooltip.visible && (
        <Box
          sx={{
            position: 'absolute',
            top: `${tooltip.y}px`,
            left: `${tooltip.x}px`,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            padding: '5px',
            borderRadius: '5px',
            zIndex: 10,
          }}
        >
          {tooltip.name}
        </Box>
      )}

      <Box textAlign="center" mb={4} sx={{ zIndex: 1 }}>
        <Typography
          variant="h2"
          sx={{
            fontWeight: 'bold',
            fontSize: { xs: '2rem', sm: '3rem' },
            color: '#fff',
            mb: 2,
          }}
        >
          Welcome to Valkiria24
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
