import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Typography, Button, Box, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import birdGif from '../media/bird2.gif';

function Home() {
  const initialWidth = useRef(window.innerWidth);
  const initialHeight = useRef(window.innerHeight);
  const navigate = useNavigate();
  const resetDelay = 2000; // 2 seconds delay before bird starts again
  const [labelsVisible, setLabelsVisible] = useState(true);
  const [birdGroups, setBirdGroups] = useState({ periquitos: [] });

  const generateBirds = (numBirds) => {
    const birds = [];
    for (let i = 0; i < numBirds; i++) {
      birds.push({
        x: -200,
        y: Math.random() * ((initialHeight.current / 1.5) - 100) + 100,
        delay: Math.random() * 2000,
        speed: (Math.random() * (12 - 2) + 2) *0.4,
        isVisible: false,
        timeRemaining: resetDelay / 1000,
        name: `Bird ${i + 1}`,
        class: 'periquito',
      });
    }
    return birds;
  };

  const initialBirds = useMemo(() => {
    return {
      periquitos: generateBirds(6) // Adjust the number of birds as needed
    };
  }, []);

  useEffect(() => {
    setBirdGroups(initialBirds);
    const intervalId = setInterval(() => {
      setBirdGroups((prevBirdGroups) => {
        const updatedBirds = prevBirdGroups.periquitos.map(bird => {
          if (bird.isVisible) {
            // Move bird to the right using its unique speed
            bird.x += bird.speed;
            // Check if the bird goes off-screen
            if (bird.x >= initialWidth.current) {
              return { ...bird, isVisible: false, x: -200, timeRemaining: resetDelay / 1000 };
            }
          } else if (bird.timeRemaining > 0) {
            bird.timeRemaining -= 1;
          } else if (bird.timeRemaining <= 0) {
            // Reset and make visible again
            return {
              ...bird,
              isVisible: true,
              y: Math.random() * ((initialHeight.current / 1.5) - 100) + 100,
              timeRemaining: resetDelay / 1000,
              x: -200, // Reset position
            };
          }
          return bird;
        });
        return { periquitos: updatedBirds };
      });
    }, 0);

    // Handle resize event
    const handleResize = () => {
      initialWidth.current = window.innerWidth;
      initialHeight.current = window.innerHeight;
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      clearInterval(intervalId);
      window.removeEventListener('resize', handleResize);
    };
  }, [initialBirds]);

  const handleMouseEnter = (bird) => {
    // Handle mouse enter for tooltip (if needed)
  };

  const handleMouseLeave = () => {
    // Handle mouse leave for tooltip (if needed)
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
      {birdGroups.periquitos.map((bird, index) => (
        <Box key={index}>
          {bird.isVisible ? (
            <>
              <Box
                onMouseEnter={() => handleMouseEnter(bird)}
                onMouseLeave={handleMouseLeave}
                sx={{
                  position: 'absolute',
                  top: `${bird.y}px`,
                  left: `${bird.x}px`,
                  width: '100px',
                  height: '100px',
                  backgroundImage: `url(${birdGif})`,
                  backgroundSize: 'cover',
                  transform: 'scaleX(-1)',
                  transition: 'left 0.05s linear',
                  filter: `invert(${bird.class === 'periquito' ? 0 : 1})`,
                }}
              />
              {labelsVisible && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: `${bird.y}px`,
                    left: `${bird.x}px`,
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    color: 'white',
                    padding: '5px',
                    borderRadius: '5px',
                    zIndex: 10,
                  }}
                >
                  {bird.name}
                </Box>
              )}
            </>
          ) : (
            <Box
              sx={{
                position: 'absolute',
                top: `${bird.y}px`,
                left: `20px`,
                color: 'white',
                fontSize: '18px',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                padding: '5px',
                borderRadius: '5px',
                display: 'none', // Hide the countdown for now
              }}
            >
              {`Time until next flight: ${bird.timeRemaining}s`}
            </Box>
          )}
        </Box>
      ))}

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
                margin: '0 auto',
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

      <Button
        variant="contained"
        color="secondary"
        onClick={() => setLabelsVisible((prev) => !prev)}
        sx={{
          position: 'absolute',
          top: '70px',
          right: '16px',
          zIndex: 10,
          backgroundColor: 'transparent',
        }}
      >
        {labelsVisible ? <Visibility /> : <VisibilityOff />}
      </Button>
    </Box>
  );
}

export default Home;
