import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import BRKSnackBar from '@/components/BRKSnackBar';
import { AlertColor } from '@mui/material';

interface SnackbarContextProps {
    showSnackbar: (message: string, severity?: AlertColor, duration?: number) => void;
}
const SnackbarContext = createContext<SnackbarContextProps | undefined>(undefined);

export const useSnackbar = () => {
    const context = useContext(SnackbarContext);
    if (!context) {
        throw new Error('context error');
    }
    return context;
};

export const SnackbarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');
    const [severity, setSeverity] = useState<AlertColor>('success');
    const [duration, setDuration] = useState<number>(3000);

    const showSnackbar = useCallback((msg: string, sev: AlertColor = 'info', dur = 2000) => {
        setMessage(msg);
        setSeverity(sev);
        setSnackbarOpen(true);
        setDuration(dur);
    }, []);
    const handleOnClose = () => {
        setSnackbarOpen(false);
    };

    return (
        <SnackbarContext.Provider value={{ showSnackbar }}>
            {children}

            <BRKSnackBar
                message={message}
                severity={severity}
                duration={duration}
                open={snackbarOpen}
                handleOnClose={handleOnClose}
            />
        </SnackbarContext.Provider>
    );
};
