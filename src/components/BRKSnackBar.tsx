'use client';
import React, { useState, useEffect } from 'react';
import { Snackbar, AlertColor } from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

interface ISnackBarProps {
    open: boolean;
    message: string;
    duration?: number;
    severity?: AlertColor;
    handleOnClose: () => void;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const BRKSnackBar: React.FC<ISnackBarProps> = ({
    open,
    handleOnClose,
    message,
    duration = 2000,
    severity = 'info'
}) => {
    const style = () => {
        switch (severity) {
            case 'warning':
                return { backgroundColor: '#cf7500', fontWeight: 'bold', color: 'white' };
            case 'error':
                return { backgroundColor: '#d32f2f', fontWeight: 'bold', color: 'white' };
            case 'info':
                return { backgroundColor: '#1976d2', fontWeight: 'bold', color: 'white' };
            case 'success':
                return { backgroundColor: '#388e3c', fontWeight: 'bold', color: 'white' };
            default:
                return {};
        }
    };
    return (
        <Snackbar
            open={open}
            autoHideDuration={duration}
            onClose={handleOnClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            sx={{ marginBottom: '80px', width: { sx: '90%', sm: '90%' } }}
        >
            <Alert
                onClose={handleOnClose}
                severity={severity}
                sx={{ width: '100%', whiteSpace: 'pre-line', ...style() }}
            >
                {message}
            </Alert>
        </Snackbar>
    );
};

export default BRKSnackBar;
