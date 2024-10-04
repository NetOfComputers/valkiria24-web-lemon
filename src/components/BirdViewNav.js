import { Container, Typography, Button, Box, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function BirdViewNav({ navItems }) { // Accepting navItems as a prop
    const navigate = useNavigate();

    return (
        <Grid container spacing={2} justifyContent="center">
            {navItems.map((item, index) => (
                <Grid item xs={12} sm={6} key={index}>
                    <Button
                        fullWidth
                        variant={item.variant || 'outlined'}
                        color={item.color || 'primary'}
                        onClick={() => navigate(item.url)}
                        sx={{
                            padding: '12px 24px',
                            fontSize: '1rem',
                            color: item.textColor || '#000',
                            borderColor: item.borderColor || '#000',
                            backgroundColor: item.backgroundColor || 'transparent',
                            '&:hover': {
                                backgroundColor: item.hoverBackgroundColor || '#000',
                                color: item.hoverTextColor || '#fff',
                            },
                        }}
                    >
                        {item.name}
                    </Button>
                </Grid>
            ))}
        </Grid>
    );

}
export default BirdViewNav;