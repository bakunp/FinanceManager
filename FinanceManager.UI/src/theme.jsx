import { createContext, useState, useMemo, useContext } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

export const ColorModeContext = createContext({ toggleColorMode: () => { } });

export const useColorMode = () => useContext(ColorModeContext);

const getDesignTokens = (mode) => ({
    palette: {
        mode,
        ...(mode === 'light'
            ? {
                primary: { main: '#4F46E5' },       // indigo-600
                secondary: { main: '#F59E0B' },      // amber-500 (accent)
                divider: '#E2E8F0',
                background: {
                    default: '#F5F3FF',              // lekki fiolet
                    paper: '#FFFFFF',
                    surface: '#EDE9FE',              // indigo-50-ish
                    elevated: '#E0E7FF',             // indigo-100
                },
                text: {
                    primary: '#1E1B4B',              // indigo-950
                    secondary: '#6366F1',            // indigo-500 muted
                },
                accent: {
                    main: '#F59E0B',
                    light: '#FDE68A',
                    dark: '#D97706',
                    contrastText: '#FFFFFF',
                },
            }
            : {
                primary: { main: '#818CF8' },        // indigo-400
                secondary: { main: '#FBBF24' },      // amber-400 (accent)
                divider: 'rgba(129, 140, 248, 0.15)',
                background: {
                    default: '#0F0E1A',              // deep dark indigo
                    paper: '#1A1830',                // card surfaces
                    surface: '#252340',              // elevated surfaces
                    elevated: 'rgba(129, 140, 248, 0.08)',
                },
                text: {
                    primary: '#E0E7FF',              // indigo-100
                    secondary: '#A5B4FC',            // indigo-300
                },
                accent: {
                    main: '#FBBF24',
                    light: '#FDE68A',
                    dark: '#F59E0B',
                    contrastText: '#1E1B4B',
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
    const [mode, setMode] = useState(() => {
        const saved = localStorage.getItem('themeMode');
        return saved === 'dark' || saved === 'light' ? saved : 'light';
    });

    const colorMode = useMemo(
        () => ({
            toggleColorMode: () => {
                setMode((prevMode) => {
                    const newMode = prevMode === 'light' ? 'dark' : 'light';
                    localStorage.setItem('themeMode', newMode);
                    return newMode;
                });
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