import React, { useEffect, useRef, useState } from 'react';
import { Typography, Button, Box, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import CreateABird from '../components/BirdProject/modules/CreateABird';
function Home() {


  const initialWidth = useRef(window.innerWidth);
  const initialHeight = useRef(window.innerHeight);
  const navigate = useNavigate();
  const resetDelay = 2000; // 10 seconds delay before bird starts again
  const [labelsVisible, setLabelsVisible] = useState(true);

  const b1 = './bird_position/1b.gif';
  const b2 = './bird_position/2b.gif';
  const b3 = './bird_position/3b.gif';
  const b4 = './bird_position/4b.gif';
  const b5 = './bird_position/5b.gif';
  const b6 = './bird_position/6b.gif';
  const b7 = './bird_position/7b.gif';
  const b8 = './bird_position/8b.gif';
  const birdPositions = [
    b1, b2, b3, b4, b5, b6, b7, b8
  ]
  const minRandomSpeed = 0;
  const maxRandomSpeed = 0;
  const maxRandomHeight = 0;
  const minRandomHeight = 0;

  const getRandomHeight = () => {
    return Math.random() * ((initialHeight.current / 1.5) - 100) + 100
  }
  const getRandomDelay = () => {
    return Math.random() * ((2000 - 0) + 0)
  }
  const getRandomSpeed = () => {
    return (Math.random() * (12 - 6) + 6) * 0.75;
  }

  const getRandomScale = () => {
    return Math.floor(Math.random() * (80 - 40 + 1)) + 80
  }

  const getRandomGif = () => {
    return birdPositions[Math.floor(Math.random() * (1 - 8 + 1)) + 8]
  }

  const [birdGroups, setBirdGroups] = useState({
    periquitos: {
      birds: [
        // { x: -200, y: 100, delay: 0, speed: 5*0.75, isVisible: false, timeRemaining: resetDelay / 1000, name: 'Jim', class: 'periquito_special', scale: 100},
        // { x: -200, y: 100, delay: 0, speed: 5*0.75, isVisible: false, timeRemaining: resetDelay / 1000, name: 'Jim', class: 'periquito_special', scale: 100 },
        { x: -300, y: 200, delay: 500, speed: 8 * 0.75, isVisible: false, timeRemaining: resetDelay / 1000, name: 'Pollo', class: 'periquito', scale: 100, delay: 1, gifSrc: getRandomGif() },
        { x: -400, y: 150, delay: 1000, speed: 4 * 0.75, isVisible: false, timeRemaining: resetDelay / 1000, name: 'Blue', class: 'periquito', scale: 100, delay: 1, gifSrc: getRandomGif() },
        { x: -500, y: 250, delay: 1500, speed: 6 * 0.75, isVisible: false, timeRemaining: resetDelay / 1000, name: 'Pipa', class: 'periquito', scale: 100, delay: 1, gifSrc: getRandomGif() },
        { x: -500, y: getRandomHeight(), delay: getRandomDelay(), speed: getRandomSpeed(), isVisible: false, timeRemaining: resetDelay / 1000, name: '', class: 'periquito', scale: getRandomScale(), gifSrc: getRandomGif() },
        { x: -500, y: getRandomHeight(), delay: getRandomDelay(), speed: getRandomSpeed(), isVisible: false, timeRemaining: resetDelay / 1000, name: '', class: 'periquito', scale: getRandomScale(), gifSrc: getRandomGif() },
        { x: -500, y: getRandomHeight(), delay: getRandomDelay(), speed: getRandomSpeed(), isVisible: false, timeRemaining: resetDelay / 1000, name: '', class: 'periquito', scale: getRandomScale(), gifSrc: getRandomGif() },
        { x: -500, y: getRandomHeight(), delay: getRandomDelay(), speed: getRandomSpeed(), isVisible: false, timeRemaining: resetDelay / 1000, name: '', class: 'periquito', scale: getRandomScale(), gifSrc: getRandomGif() },
        { x: -500, y: getRandomHeight(), delay: getRandomDelay(), speed: getRandomSpeed(), isVisible: false, timeRemaining: resetDelay / 1000, name: '', class: 'periquito', scale: getRandomScale(), gifSrc: getRandomGif() },
        { x: -500, y: getRandomHeight(), delay: getRandomDelay(), speed: getRandomSpeed(), isVisible: false, timeRemaining: resetDelay / 1000, name: '', class: 'periquito', scale: getRandomScale(), gifSrc: getRandomGif() },
        { x: -500, y: getRandomHeight(), delay: getRandomDelay(), speed: getRandomSpeed(), isVisible: false, timeRemaining: resetDelay / 1000, name: '', class: 'periquito', scale: getRandomScale(), gifSrc: getRandomGif() },
        { x: -500, y: getRandomHeight(), delay: getRandomDelay(), speed: getRandomSpeed(), isVisible: false, timeRemaining: resetDelay / 1000, name: '', class: 'periquito', scale: getRandomScale(), gifSrc: getRandomGif() },
        { x: -500, y: getRandomHeight(), delay: getRandomDelay(), speed: getRandomSpeed(), isVisible: false, timeRemaining: resetDelay / 1000, name: '', class: 'periquito', scale: getRandomScale(), gifSrc: getRandomGif() },
        { x: -500, y: getRandomHeight(), delay: getRandomDelay(), speed: getRandomSpeed(), isVisible: false, timeRemaining: resetDelay / 1000, name: '', class: 'periquito', scale: getRandomScale(), gifSrc: getRandomGif() },
        { x: -500, y: getRandomHeight(), delay: getRandomDelay(), speed: getRandomSpeed(), isVisible: false, timeRemaining: resetDelay / 1000, name: '', class: 'periquito', scale: getRandomScale(), gifSrc: getRandomGif() },
        { x: -500, y: getRandomHeight(), delay: getRandomDelay(), speed: getRandomSpeed(), isVisible: false, timeRemaining: resetDelay / 1000, name: '', class: 'periquito', scale: getRandomScale(), gifSrc: getRandomGif() },
        { x: -500, y: getRandomHeight(), delay: getRandomDelay(), speed: getRandomSpeed(), isVisible: false, timeRemaining: resetDelay / 1000, name: '', class: 'periquito', scale: getRandomScale(), gifSrc: getRandomGif() },
        { x: -500, y: getRandomHeight(), delay: getRandomDelay(), speed: getRandomSpeed(), isVisible: false, timeRemaining: resetDelay / 1000, name: '', class: 'periquito', scale: getRandomScale(), gifSrc: getRandomGif() },
        { x: -500, y: getRandomHeight(), delay: getRandomDelay(), speed: getRandomSpeed(), isVisible: false, timeRemaining: resetDelay / 1000, name: '', class: 'periquito', scale: getRandomScale(), gifSrc: getRandomGif() },
        { x: -500, y: getRandomHeight(), delay: getRandomDelay(), speed: getRandomSpeed(), isVisible: false, timeRemaining: resetDelay / 1000, name: '', class: 'periquito', scale: getRandomScale(), gifSrc: getRandomGif() },

      ]
    }
  })


  useEffect(() => {
    // Set overflow hidden on body when component mounts
    document.body.style.overflow = 'hidden';

    console.warn('periquitos', birdGroups)

    return () => {
      // Restore overflow when component unmounts
      document.body.style.overflow = 'auto'; // or 'visible' depending on your layout
    };
  }, []);
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
        // initialHeight.current = window.innerHeight;
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
              return { ...b, x: (b.x + b.speed) };
            }
            return b;
          });

          return {
            ...prevBirdGroups,
            periquitos: { birds: updatedBirds }
          };
        });
      }, 30); // Adjust movement interval (50ms means birds move every 50ms)
    });

    const countdownIntervals = birdGroups.periquitos.birds.map((bird, index) => {
      return setInterval(() => {
        setBirdGroups((prevBirdGroups) => {
          const updatedBirds = prevBirdGroups.periquitos.birds.map((b, i) => {
            if (i === index && !b.isVisible && b.timeRemaining > 0) {
              return { ...b, timeRemaining: b.timeRemaining - 1 }; // Decrease time remaining by 1 second
            }
            if (i === index && b.timeRemaining <= 0 && !b.isVisible) {
              //Calculate new random vertical position for that bird

              // b.y = Math.random() * ((initialHeight.current/1.5) - 100) + 100;
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
    // Immediately set the tooltip position based on the bird's current position when hovered
    // setTooltip({
    //   visible: true,
    //   name: bird.name,
    //   x: bird.x + 50, // Tooltip position will be slightly offset to the right of the bird
    //   y: bird.y
    // });
  };

  const handleMouseLeave = () => {
    // setTooltip({ visible: false, name: '', x: 0, y: 0 });
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
        background: 'linear-gradient(15deg, #124568 0%, #246f64 100%)',
        // backgroundSize: '400% 400%',
        // // animation: 'gradient 15s ease infinite',
        // // '@keyframes gradient': {
        // //   '0%': { backgroundPosition: '0% 50%' },
        // //   '50%': { backgroundPosition: '100% 50%' },
        // //   '100%': { backgroundPosition: '0% 50%' },
        // // },
      }}
    >
      {/* Render each bird in the group */}
      {birdGroups.periquitos.birds.map((bird, index) => (
        <Box key={index}>
          {bird.isVisible ? (
            // Bird is visible and moving
            <>
              <Box
                onMouseEnter={() => handleMouseEnter(bird)}
                onMouseLeave={handleMouseLeave}
                sx={{
                  position: 'absolute',
                  top: `${bird.y}px`,  // Bird's vertical position
                  left: `${bird.x}px`, // Bird's horizontal position (changing over time)
                  width: `${bird.scale}px`, // Adjust the bird's size as needed
                  height: `${bird.scale}px`,
                  backgroundImage: `url(${bird.gifSrc})`, // Use bird GIF as background image
                  backgroundSize: 'cover',
                  transform: 'scaleX(-1)', // Flip bird horizontally if needed
                  transition: 'left 0.05s linear',  // Smooth movement
                  filter: `invert(${bird.class === 'periquito' ? 0 : 1})`, // Invert colors for dark birds
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
      {/* {tooltip.visible && ( */}
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
      {/* )} */}

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


      <Button
        variant="contained"
        color="secondary"
        onClick={() => setLabelsVisible((prev) => !prev)}
        sx={{
          position: 'absolute',
          top: '70px', // Adjust for spacing
          right: '16px', // Adjust for spacing
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
