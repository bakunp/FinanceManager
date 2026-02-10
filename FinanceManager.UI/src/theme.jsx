import { createContext, useState, useMemo, useContext } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

export const ColorModeContext = createContext({ toggleColorMode: () => {} });

export const useColorMode = () => useContext(ColorModeContext);

const getDesignTokens = (mode) => ({
    palette: {
        mode,
        ...(mode === 'light'
        ? {
            // palette values for light mode
            primary: { main: '#2563EB' },
            secondary: { main: '#475569' },
            divider: '#E2E8F0',
            background: {
                default: '#F1F5F9',
                paper: '#FFFFFF',
            },
            text: {
                primary: '#0F172A',
                secondary: '#475569',
            },
        }
        : {
            // palette values for dark mode
            primary: { main: '#38BDF8' }, // A vibrant cyan
            secondary: { main: '#94A3B8' },
            divider: 'rgba(148, 163, 184, 0.2)',
            background: {
                default: '#020617', // Very dark navy
                paper: '#0F172A', // Slightly lighter navy for surfaces
            },
            text: {
                primary: '#E2E8F0',
                secondary: '#94A3B8',
            },
        }),
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h3: { fontWeight: 900 },
        h4: { fontWeight: 800 },
        h5: { fontWeight: 700 },
        h6: { fontWeight: 700 },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    textTransform: 'none',
                }
            }
        }
    }
});

export const AppThemeProvider = ({ children }) => {
    const [mode, setMode] = useState('light');
    const colorMode = useMemo(
        () => ({
            toggleColorMode: () => {
                setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
            },
        }),
        [],
    );

    const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

    return (
        <ColorModeContext.Provider value={colorMode}>
            <MuiThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </MuiThemeProvider>
        </ColorModeContext.Provider>
    );
};