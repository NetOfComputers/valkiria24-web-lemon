import React from 'react';
import { Container, Typography } from '@mui/material';

function Footer() {
  return (
    <footer style={{ marginTop: 'auto', padding: '1rem', textAlign: 'center' }}>
      <Container>
        <Typography variant="body1">© 2024 NOC</Typography>
      </Container>
    </footer>
  );
}

export default Footer;
