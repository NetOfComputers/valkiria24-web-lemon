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
        backgroundColor: '#f4f4f4', // Light background for modern look
        padding: '2rem',
      }}
    >
      <Box textAlign="center" mb={4}>
        <Typography
          variant="h2"
          sx={{
            fontWeight: 'bold',
            fontSize: { xs: '2rem', sm: '3rem' }, // Responsive font size
            color: '#000',
            mb: 2,
          }}
        >
          Services
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: '1.25rem',
            color: '#555',
            maxWidth: '500px',
            margin: 'auto',
          }}
        >
          This web is hosted by JaimeRoman. Explore our services to learn more.
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
        <Grid item xs={12} sm={6}>
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
        </Grid>
      </Grid>
    </Container>
  );
}

export default Home;
