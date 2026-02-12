import React, { useState } from 'react';
import { Box, Button, Container, Grid, Paper, Typography, useTheme, CircularProgress } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

export default function LandingPage({ onLogin }) {
    const theme = useTheme();
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    const handleGoogleLogin = () => {
        setIsLoggingIn(true);
        // Symulacja procesu logowania (np. oczekiwanie na API lub Google)
        setTimeout(() => {
            setIsLoggingIn(false);
            if (onLogin) onLogin();
        }, 1500);
    };

    return (
        <Box sx={{ 
            minHeight: '100vh', 
            display: 'flex', 
            flexDirection: 'column',
            bgcolor: theme.palette.background.default,
            color: theme.palette.text.primary
        }}>
            {/* Navbar */}
            <Box component="nav" sx={{ px: 4, py: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AccountBalanceWalletIcon color="primary" fontSize="large" />
                    <Typography variant="h5" fontWeight="bold" sx={{ letterSpacing: '-0.5px' }}>
                        Finance<Box component="span" sx={{ color: 'primary.main' }}>Manager</Box>
                    </Typography>
                </Box>
                <Button 
                    variant="outlined" 
                    startIcon={<GoogleIcon />} 
                    onClick={handleGoogleLogin}
                    disabled={isLoggingIn}
                    sx={{ borderRadius: 5, textTransform: 'none', fontWeight: 600 }}
                >
                    Sign in
                </Button>
            </Box>

            {/* Hero Section */}
            <Container maxWidth="lg" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', py: 8 }}>
                <Grid container spacing={6} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <Typography variant="h2" component="h1" fontWeight="900" sx={{ mb: 2, lineHeight: 1.1 }}>
                            Smart way to <br />
                            manage your <Box component="span" sx={{ color: 'primary.main' }}>finances</Box>
                        </Typography>
                        <Typography variant="h6" color="text.secondary" sx={{ mb: 4, fontWeight: 400, maxWidth: 500 }}>
                            Track your expenses, set savings goals, and visualize your financial health in one place.
                        </Typography>
                        
                        <Button 
                            variant="contained" 
                            size="large" 
                            startIcon={isLoggingIn ? <CircularProgress size={20} color="inherit" /> : <GoogleIcon />}
                            onClick={handleGoogleLogin}
                            disabled={isLoggingIn}
                            sx={{ 
                                py: 1.5, 
                                px: 4, 
                                borderRadius: 8, 
                                fontSize: '1.1rem',
                                textTransform: 'none',
                                fontWeight: 600,
                                boxShadow: theme.shadows[4]
                            }}
                        >
                            Continue with Google
                        </Button>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Box sx={{ position: 'relative', p: 2 }}>
                            {/* Abstract Background Shape */}
                            <Box sx={{ 
                                position: 'absolute', 
                                top: '10%', 
                                right: '10%', 
                                width: '80%', 
                                height: '80%', 
                                borderRadius: '50%', 
                                background: `radial-gradient(circle, ${theme.palette.primary.light} 0%, transparent 70%)`, 
                                opacity: 0.2,
                                zIndex: 0
                            }} />

                            {/* Main Card */}
                            <Paper 
                                elevation={6} 
                                sx={{ 
                                    p: 4, 
                                    borderRadius: 4, 
                                    position: 'relative', 
                                    zIndex: 1,
                                    bgcolor: 'background.paper',
                                    transform: 'rotate(-2deg)',
                                    border: '1px solid',
                                    borderColor: 'divider'
                                }}
                            >
                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                    Total Balance
                                </Typography>
                                <Typography variant="h3" fontWeight="800" sx={{ mb: 3 }}>
                                    24,500 <Typography component="span" variant="h5" color="text.secondary">PLN</Typography>
                                </Typography>
                                
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <Box sx={{ flex: 1, p: 2, borderRadius: 2, bgcolor: 'action.hover' }}>
                                        <Typography variant="caption" color="text.secondary">Income</Typography>
                                        <Typography variant="subtitle1" color="success.main" fontWeight="bold">+8,250</Typography>
                                    </Box>
                                    <Box sx={{ flex: 1, p: 2, borderRadius: 2, bgcolor: 'action.hover' }}>
                                        <Typography variant="caption" color="text.secondary">Expenses</Typography>
                                        <Typography variant="subtitle1" color="error.main" fontWeight="bold">-3,400</Typography>
                                    </Box>
                                </Box>
                            </Paper>

                            {/* Floating Card */}
                            <Paper 
                                elevation={8}
                                sx={{ 
                                    p: 2, 
                                    borderRadius: 3, 
                                    position: 'absolute', 
                                    bottom: 0, 
                                    right: 0, 
                                    width: 220,
                                    zIndex: 2,
                                    bgcolor: 'background.paper',
                                    transform: 'translate(20px, 20px)'
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                    <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'primary.main', color: 'white' }}>
                                        <AccountBalanceWalletIcon fontSize="small" />
                                    </Box>
                                    <Box>
                                        <Typography variant="subtitle2" fontWeight="bold">Savings Goal</Typography>
                                        <Typography variant="caption" color="text.secondary">On track</Typography>
                                    </Box>
                                </Box>
                            </Paper>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}
