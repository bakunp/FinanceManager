import { useState, useEffect, useCallback } from 'react';
import {
    Box, Container, Grid, Paper, Typography, useTheme, CircularProgress
} from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { googleLogin } from '../services/authService';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

export default function LandingPage({ onLogin }) {
    const theme = useTheme();
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [error, setError] = useState(null);

    const handleCredentialResponse = useCallback(async (response) => {
        setIsLoggingIn(true);
        setError(null);
        try {
            await googleLogin(response.credential);
            if (onLogin) onLogin();
        } catch (err) {
            console.error('Login failed:', err);
            setError('Login failed. Please try again.');
            setIsLoggingIn(false);
        }
    }, [onLogin]);

    useEffect(() => {
        // Wait for the Google Identity Services script to load
        const initGoogleSignIn = () => {
            if (window.google?.accounts?.id) {
                window.google.accounts.id.initialize({
                    client_id: GOOGLE_CLIENT_ID,
                    callback: handleCredentialResponse,
                });

                // Render the button in a hidden container — we use our own styled button
                const buttonContainer = document.getElementById('google-signin-btn');
                if (buttonContainer) {
                    window.google.accounts.id.renderButton(buttonContainer, {
                        theme: 'outline',
                        size: 'large',
                        text: 'continue_with',
                        shape: 'pill',
                        width: 280,
                    });
                }
            }
        };

        // If the script is already loaded
        if (window.google?.accounts?.id) {
            initGoogleSignIn();
        } else {
            // Wait for script to load
            window.handleGoogleScriptLoad = initGoogleSignIn;
            const checkInterval = setInterval(() => {
                if (window.google?.accounts?.id) {
                    clearInterval(checkInterval);
                    initGoogleSignIn();
                }
            }, 100);

            return () => clearInterval(checkInterval);
        }
    }, [handleCredentialResponse]);

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
            </Box>

            {/* Hero Section */}
            <Container maxWidth="lg" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', py: 8 }}>
                <Grid container spacing={6} alignItems="center">
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Typography variant="h2" component="h1" fontWeight="900" sx={{ mb: 2, lineHeight: 1.1 }}>
                            Smart way to <br />
                            manage your <Box component="span" sx={{
                                background: 'linear-gradient(135deg, #4F46E5 0%, #818CF8 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}>finances</Box>
                        </Typography>
                        <Typography variant="h6" color="text.secondary" sx={{ mb: 4, fontWeight: 400, maxWidth: 500 }}>
                            Track your expenses, set savings goals, and visualize your financial health in one place.
                        </Typography>

                        {error && (
                            <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>
                        )}

                        {/* Google's rendered Sign-In button */}
                        <Box id="google-signin-btn" sx={{ mb: 2 }}>
                            {/* Google Identity Services will render its button here */}
                        </Box>

                        {isLoggingIn && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
                                <CircularProgress size={20} />
                                <Typography variant="body2" color="text.secondary">Signing in...</Typography>
                            </Box>
                        )}
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <Box sx={{ position: 'relative', p: 2 }}>
                            {/* Abstract Background Shape */}
                            <Box sx={{
                                position: 'absolute',
                                top: '10%',
                                right: '10%',
                                width: '80%',
                                height: '80%',
                                borderRadius: '50%',
                                background: `radial-gradient(circle, ${theme.palette.primary.main} 0%, transparent 70%)`,
                                opacity: 0.15,
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
                                    <Box sx={{ flex: 1, p: 2, borderRadius: 2, bgcolor: 'background.surface' }}>
                                        <Typography variant="caption" color="text.secondary">Income</Typography>
                                        <Typography variant="subtitle1" color="success.main" fontWeight="bold">+8,250</Typography>
                                    </Box>
                                    <Box sx={{ flex: 1, p: 2, borderRadius: 2, bgcolor: 'background.surface' }}>
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
                                    transform: 'translate(20px, 20px)',
                                    border: '1px solid',
                                    borderColor: 'divider'
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                    <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'secondary.main', color: '#1E1B4B' }}>
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
