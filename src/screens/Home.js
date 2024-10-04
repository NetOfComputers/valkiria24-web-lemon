import React from 'react';
import { Container, Typography, Button, Box, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <Container
      maxWidth="md"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(45deg, #700255, #24019f)', // Gradient background
        backgroundSize: '400% 400%', // Allow the background to shift
        animation: 'gradient 15s ease infinite', // Animation for smooth transition
        padding: '2rem',
        '@keyframes gradient': {
          '0%': {
            backgroundPosition: '0% 50%',
          },
          '50%': {
            backgroundPosition: '100% 50%',
          },
          '100%': {
            backgroundPosition: '0% 50%',
          },
        },
      }}
    >
      <Box textAlign="center" mb={4}>
        <Typography
          variant="h2"
          sx={{
            fontWeight: 'bold',
            fontSize: { xs: '2rem', sm: '3rem' }, // Responsive font size
            color: '#fff', // Change text color to white for better contrast
            mb: 2,
          }}
        >
          Services
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: '1.25rem',
            color: '#eee', // Slightly lighter text color for better readability
            maxWidth: '500px',
            margin: 'auto',
          }}
        >
          Made by Jaime Roman. Appreciate
        </Typography>
      </Box>

      {/* Buttons with better layout */}
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} sm={6}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={() => navigate('/bird-view')}
            sx={{
              padding: '12px 24px',
              fontSize: '1rem',
              backgroundColor: '#000',
              '&:hover': {
                backgroundColor: '#333',
              },
            }}
          >
            View Birds
          </Button>
        </Grid>
        {/* Uncomment this section if you want to include it */}
        {/* <Grid item xs={12} sm={6}>
          <Button
            fullWidth
            variant="outlined"
            color="primary"
            onClick={() => navigate('/active-workers')}
            sx={{
              padding: '12px 24px',
              fontSize: '1rem',
              color: '#000',
              borderColor: '#000',
              '&:hover': {
                backgroundColor: '#000',
                color: '#fff',
              },
            }}
          >
            Active Workers
          </Button>
        </Grid> */}
      </Grid>

      {/* New section for "Are you admin?" link */}
      <Box mt={4} textAlign="center">
        {/* <Typography variant="body1" sx={{ color: '#eee' }}>
          Are you admin?
        </Typography> */}
        <Typography
          variant="body1"
          sx={{
            color: 'whitesmoke', // Blue link
            textDecoration: 'underline',
            cursor: 'pointer',
            '&:hover': {
              color: '#0056b3', // Darker blue on hover
            },
          }}
          onClick={() => navigate('/admin')}
        >
          Are you admin?
        </Typography>
      </Box>
    </Container>
  );
}

export default Home;
