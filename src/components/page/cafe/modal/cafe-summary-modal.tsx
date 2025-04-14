'use client';
import { Button, Dialog, DialogActions, DialogTitle } from '@mui/material';
import React from 'react';
import { COLORS_DARK } from '@/data';

export const CafeSummaryModal = ({ open, onClose }: any) => {
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
        >
            <DialogTitle>메뉴 요약 보기</DialogTitle>
            <DialogActions
                sx={{
                    padding: '12px 24px',
                    display: 'flex',
                    justifyContent: 'center'
                }}
            >
                {/*<Button sx={{ border: `1px solid ${COLORS_DARK.accent.main}` }} onClick={onClose}>*/}
                {/*    취소*/}
                {/*</Button>*/}
                <Button
                    onClick={onClose}
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
