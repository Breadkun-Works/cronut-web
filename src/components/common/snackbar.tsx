import BRKSnackBar from '@/components/BRKSnackBar';
import React from 'react';
import { snackBarAtom } from '@/atom/common-atom';
import { useAtom } from 'jotai';
import { AlertColor } from '@mui/material';

export interface ISnackbarTypes {
    message: string;
    severity: AlertColor;
    duration?: number;
    open: boolean;
    handleOnClose?: () => void;
    device?: string;
}

export const Snackbar = () => {
    const [snackBar] = useAtom(snackBarAtom);
    return (
        <>
            {snackBar.open && (
                <BRKSnackBar
                    message={snackBar.message}
                    severity={snackBar.severity}
                    duration={snackBar.duration}
                    open={snackBar.open}
                    handleOnClose={snackBar.handleOnClose}
                />
            )}
        </>
    );
};
