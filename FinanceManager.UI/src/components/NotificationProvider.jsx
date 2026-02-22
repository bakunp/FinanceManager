import { createContext, useContext, useState, useCallback } from 'react';
import { Snackbar, Alert } from '@mui/material';

const NotificationContext = createContext(null);

export const useNotification = () => {
    const ctx = useContext(NotificationContext);
    if (!ctx) throw new Error('useNotification must be used within NotificationProvider');
    return ctx;
};

export default function NotificationProvider({ children }) {
    const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });

    const showSuccess = useCallback((message) => {
        setNotification({ open: true, message, severity: 'success' });
    }, []);

    const showError = useCallback((message) => {
        setNotification({ open: true, message, severity: 'error' });
    }, []);

    const showInfo = useCallback((message) => {
        setNotification({ open: true, message, severity: 'info' });
    }, []);

    const handleClose = (_, reason) => {
        if (reason === 'clickaway') return;
        setNotification(prev => ({ ...prev, open: false }));
    };

    return (
        <NotificationContext.Provider value={{ showSuccess, showError, showInfo }}>
            {children}
            <Snackbar
                open={notification.open}
                autoHideDuration={4000}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={handleClose}
                    severity={notification.severity}
                    variant="filled"
                    sx={{ width: '100%', borderRadius: 2, fontWeight: 500 }}
                >
                    {notification.message}
                </Alert>
            </Snackbar>
        </NotificationContext.Provider>
    );
}
