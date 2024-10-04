// src/AdminLogin.js

import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Snackbar, Box } from '@mui/material';

function AdminLogin() {
  const [hash, setHash] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    localStorage.setItem('hash', hash); // Store the hash in localStorage
    setSnackbarMessage('Hash stored successfully!');
    setSnackbarOpen(true);
    setHash(''); // Clear the input field
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container
      maxWidth="sm"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh', // Full viewport height for vertical centering
      }}
    >
      <Typography variant="h4" style={{ marginBottom: '20px' }}>
        Admin Login
      </Typography>
      <form onSubmit={handleSubmit} style={{ width: '100%' }}>
        <Box display="flex" flexDirection="column" alignItems="center">
          <TextField
            label="Enter Hash"
            variant="outlined"
            fullWidth
            value={hash}
            onChange={(e) => setHash(e.target.value)}
            required
            style={{ marginBottom: '20px' }}
          />
          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
        </Box>
      </form>
      <Snackbar
        open={snackbarOpen}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        autoHideDuration={3000}
      />
    </Container>
  );
}

export default AdminLogin;
