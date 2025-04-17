'use client';

import { COLORS_DARK } from '@/data';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import React, { ReactNode } from 'react';

interface ICartExpiredModalTypes {
    open: boolean;
    onClose?(): void;
    content?: string | ReactNode;
    title?: string | ReactNode;
    onConfirm(): void;
    disableEscapeKeyDown?: boolean;
}

export const CartConfirmModal = (props: ICartExpiredModalTypes) => {
    const { open, onClose, content, title, onConfirm, disableEscapeKeyDown = false } = props;
    return (
        <Dialog
            open={open}
            onClose={(event, reason) => {
                if (reason !== 'backdropClick') {
                    if (onClose) {
                        onClose();
                    }
                }
            }}
            disableEscapeKeyDown={disableEscapeKeyDown}
            sx={{
                '& .MuiDialog-container': {
                    alignItems: 'center',
                    justifyContent: 'center'
                },
                '& .MuiDialog-paper': {
                    backgroundColor: COLORS_DARK.background.main, // 다크모드에서 배경색 더 밝게
                    maxWidth: 'none',
                    padding: '30px',
                    borderRadius: '16px',
                    boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                    overflow: 'hidden',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                }
            }}
        >
            <DialogTitle textAlign={'center'} alignItems={'center'}>
                {title}
            </DialogTitle>
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
                <Button sx={{ border: `1px solid ${COLORS_DARK.accent.main}` }} onClick={onClose}>
                    취소
                </Button>
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
