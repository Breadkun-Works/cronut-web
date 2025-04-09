'use client';

import { COLORS_DARK } from '@/data';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import React, { ReactNode } from 'react';

interface ICartExpiredModalTypes {
    open: boolean;
    onClose?(): void;
    content?: string | ReactNode;
    title?: string;
    onConfirm(): void;
}

export const ExpiredModal = (props: ICartExpiredModalTypes) => {
    const { open, onClose, content, title, onConfirm } = props;
    return (
        <Dialog
            open={open}
            onClose={onClose}
            sx={{
                '& .MuiDialog-container': {
                    alignItems: 'center',
                    justifyContent: 'center'
                },
                '& .MuiDialog-paper': {
                    backgroundColor: COLORS_DARK.background.main, // 다크모드에서 배경색 더 밝게
                    maxWidth: 'none',
                    borderRadius: '16px',
                    boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                    overflow: 'hidden',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                }
            }}
        >
            <DialogTitle>{title}</DialogTitle>
            <DialogContent
                sx={{
                    color: COLORS_DARK.text.primary,
                    padding: '24px',
                    textAlign: 'center'
                }}
            >
                {content}
            </DialogContent>
            <DialogActions
                sx={{
                    padding: '12px 24px',
                    display: 'flex',
                    justifyContent: 'center'
                }}
            >
                <Button
                    onClick={onConfirm}
                    sx={{
                        backgroundColor: COLORS_DARK.accent.main,
                        color: '#fff',
                        '&:hover': {
                            backgroundColor: COLORS_DARK.accent.dark
                        },
                        padding: '8px 16px',
                        borderRadius: '4px',
                        fontWeight: 'medium'
                    }}
                >
                    확인
                </Button>
            </DialogActions>
        </Dialog>
    );
};
