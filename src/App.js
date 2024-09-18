import React from 'react';
import AppRoutes from './Routes';
import { ThemeProvider, createTheme } from '@mui/material/styles';
function App() {
  const theme = createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: '#000', // Black primary color
      },
      background: {
        default: '#f4f4f4', // Light gray background
      },
      text: {
        primary: '#000', // Black text color
      },
    },
    typography: {
      h2: {
        fontSize: '2.5rem',
        fontWeight: 'bold',
        color: '#000', // Black for headings
      },
      body1: {
        fontSize: '1.2rem',
        color: '#333', // Dark gray for the body text
      },
    },
  });
  return (
    <ThemeProvider theme={theme}>
      <AppRoutes />
    </ThemeProvider>);
}

export default App;


// import React from 'react';
// import { Container, Typography, Button, Box } from '@mui/material';

// function App() {
//   return (
//     <Container>
//       <Box mt={4} textAlign="center">
//         <Typography variant="h2" component="h1" gutterBottom>
//           Welcome to My React App
//         </Typography>
//         <Typography variant="h5" component="h2" gutterBottom>
//           This is a simple React app using Material-UI.
//         </Typography>
//         <Button variant="contained" color="primary">
//           Click Me
//         </Button>
//       </Box>
//     </Container>
//   );
// }

// export default App;
