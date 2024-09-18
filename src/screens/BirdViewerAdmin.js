import React, { useEffect, useState } from 'react';
import { Container, Typography, Button, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

// URL for the Socket.io server
const SOCKET_SERVER_URL = 'http://95.217.178.151:5000';  // Ensure to include the protocol (http or https)

function BirdViewerAdmin() {
  const navigate = useNavigate();
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState('');
  const [messageOut, setMessageOut] = useState('');

  useEffect(() => {
    // Create a connection to the socket.io server
    const newSocket = io(SOCKET_SERVER_URL);
    setSocket(newSocket);
    newSocket.emit('register_controller', "developer")

    newSocket.on('ret_service_call_stdout', (stdout)=>{
      console.log('Execution Results', stdout)
      setMessageOut(stdout)
    })

    // Clean up the socket when the component unmounts
    return () => {
      newSocket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (socket && message) {
      // Emit the message to the server
      socket.emit('send_command', message);
      console.log('Message sent:', message);
    }
  };

  const sendCommand = (command) => {
    if (socket) {
      socket.emit('send_command', command);
      console.log('Command sent:', command);
    }
  };

  return (
    <Container>
      <Typography variant="h2">Bird Viewer Admin</Typography>
      <Typography variant="body1">Allows me to see my 'perejiles' online</Typography>

      {/* Input field for writing messages */}
      <TextField
        label="Server input"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        fullWidth
        margin="normal"
      />

      {/* Button to send the message */}
      <Button variant="contained" color="black" onClick={sendMessage} sx={{ margin: "10px" }}>
        Send Message
      </Button>
      <Button variant="contained" color="red" onClick={() => navigate('/bird-viewer')}>
        BirdViewer
      </Button>
      {/* Input field for writing messages */}
      <TextField
        label="Server Output"
        value={messageOut}
        onChange={(e) => setMessageOut(e.target.value)}
        fullWidth
        margin="normal"
      />
      {/* Buttons for predefined commands */}
      <Container>
        <Button variant="contained" color="primary" onClick={() => setMessage('start videoshare')} sx={{ margin: "10px" }}>
          Start Video Share
        </Button>
        <Button variant="contained" color="secondary" onClick={() => setMessage('stop videoshare -f')} sx={{ margin: "10px" }}>
          Stop Video Share
        </Button>
        <Button variant="contained" color="success" onClick={() => setMessage('evalString cd .. && cd valkiria24-engines-tcp-video-out-client && git pull && dir')} sx={{ margin: "10px" }}>
          Update Video Config
        </Button>
        <Button variant="contained" color="warning" onClick={() => setMessage('run update')} sx={{ margin: "10px" }}>
          Update Controlled Client
        </Button>
        <Button variant="contained" color="error" onClick={() => setMessage('run reboot')} sx={{ margin: "10px" }}>
          Reboot System
        </Button>
      </Container>


    </Container>
  );
}

export default BirdViewerAdmin;
