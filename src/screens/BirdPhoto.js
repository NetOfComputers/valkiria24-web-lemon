import React, { useState } from 'react';
import { Container, Typography, Button, Box, TextField, Snackbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const WS_SERVER_URL = 'wss://bluejims.com:8764'; // Replace with your WebSocket server URL

function BirdPhoto() {
  const [params, setParams] = useState({
    width: '',
    height: '',
    brightness: '',
    iso: '',
    exposure_time: '',
    device_index: '',
  });
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [photoUrl, setPhotoUrl] = useState('');
  const navigate = useNavigate();

  // Function to handle parameter changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setParams((prevParams) => ({
      ...prevParams,
      [name]: value,
    }));
  };

  // Function to request a photo
  const requestPhoto = async () => {
    setLoading(true);
    try {
      const ws = new WebSocket(WS_SERVER_URL);
      ws.binaryType = 'arraybuffer'; // Handle binary data as ArrayBuffer

      ws.onopen = () => {
        ws.send(JSON.stringify(params)); // Send the parameters as a JSON string
      };

      ws.onmessage = (event) => {
        const blob = new Blob([event.data], { type: 'image/jpeg' }); // Assuming JPEG
        const url = URL.createObjectURL(blob);
        setPhotoUrl(url);
        setLoading(false);
        setSnackbarOpen(true); // Show snackbar after receiving photo
        ws.close(); // Close the WebSocket connection after receiving the photo
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setLoading(false);
      };

      ws.onclose = () => {
        console.log('WebSocket closed');
      };
    } catch (error) {
      console.error('Error requesting photo:', error);
      setLoading(false);
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '2rem',
        backgroundColor: '#f0f0f0',
      }}
    >
      <Typography variant="h4" gutterBottom>
        Request a Photo
      </Typography>

      {/* Input Fields for Parameters */}
      {Object.keys(params).map((key) => (
        <TextField
          key={key}
          name={key}
          label={key.charAt(0).toUpperCase() + key.slice(1)} // Capitalize first letter
          value={params[key]}
          onChange={handleChange}
          fullWidth
          margin="normal"
          type={key === 'exposure_time' ? 'number' : 'text'} // Treat exposure_time as a number
          required
        />
      ))}

      {/* Request Photo Button */}
      <Button
        variant="contained"
        color="primary"
        onClick={requestPhoto}
        disabled={loading}
        sx={{ marginTop: '1rem' }}
      >
        {loading ? 'Requesting...' : 'Request Photo'}
      </Button>

      {/* Display the received photo */}
      {photoUrl && (
        <Box mt={2}>
          <Typography variant="h6">Received Photo:</Typography>
          <img src={photoUrl} alt="Requested" style={{ width: '100%', height: 'auto', borderRadius: '8px', marginTop: '1rem' }} />
        </Box>
      )}

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message="Photo received!"
      />

      {/* Admin button */}
      <Button
        variant="outlined"
        color="secondary"
        onClick={() => navigate('/bird-viewer-admin')}
        sx={{ marginTop: '1rem' }}
      >
        Go to Admin
      </Button>
    </Container>
  );
}

export default BirdPhoto;
