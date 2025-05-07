'use client';

import { COLORS_DARK } from '@/data';
import { Backdrop, Box, Button, IconButton, Typography, useMediaQuery, useTheme } from '@mui/material';
import { ICommonModalTypes } from '@/types/common';
import { useMaxWidthByViewport, useResponsive } from '@/utils/hook';
import { X } from 'lucide-react';

export const CommonModal = (props: ICommonModalTypes) => {
    const { open, onClose, content, title, onConfirm, confirmText } = props;
    const { isMobile } = useResponsive();
    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.between('xs', 'sm')); // <360
    const isMd = useMediaQuery(theme.breakpoints.between('sm', 'md')); // 360 ~ 479
    const { maxWidth, fontSize } = useMaxWidthByViewport();

    return (
        <Backdrop
            open={open}
            onClick={onClose}
            sx={{
                zIndex: 1300,
                backgroundColor: 'rgba(0, 0, 0, 0.75)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >
            <Box
                onClick={e => e.stopPropagation()}
                sx={{
                    width: '90%',
                    maxWidth: 500,
                    maxHeight: '90vh',
                    backgroundColor: COLORS_DARK.background.main,
                    borderRadius: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    border: '1px solid rgba(255,255,255,0.1)',
                    boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.5)'
                }}
            >
                <Box
                    sx={{
                        position: 'relative',
                        textAlign: 'center',
                        px: 2,
                        py: 2,
                        borderBottom: '1px solid rgba(255,255,255,0.05)'
                    }}
                >
                    {title && (
                        <Typography fontSize={isSm ? 18 : isMd ? 20 : 22} fontWeight="bold">
                            {title}
                        </Typography>
                    )}
                    {onClose && (
                        <IconButton
                            onClick={onClose}
                            size="small"
                            sx={{
                                position: 'absolute',
                                right: 12,
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: '#fff'
                            }}
                        >
                            <X size={18} />
                        </IconButton>
                    )}
                </Box>
                {content}
            </Box>
            <Box
                sx={{
                    py: 1.5,
                    px: 2,
                    borderTop: '1px solid rgba(255,255,255,0.05)',
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 2
                }}
            >
                <Button
                    onClick={onClose}
                    sx={{
                        backgroundColor: onConfirm ? '#fff' : 'transparent',
                        color: COLORS_DARK.accent.main,
                        border: `2px solid ${COLORS_DARK.accent.main}`,
                        // color: COLORS_DARK.accent.main,
                        fontWeight: 'bold',
                        fontSize,
                        px: 4,
                        py: 1,
                        borderRadius: 2
                    }}
                >
                    닫기
                </Button>
                {onConfirm && (
                    <Button
                        onClick={onConfirm}
                        sx={{
                            backgroundColor: COLORS_DARK.accent.main,
                            color: '#fff',
                            // border: `2px solid ${COLORS_DARK.accent.main}`,
                            // color: COLORS_DARK.accent.main,
                            fontWeight: 'bold',
                            fontSize,
                            px: 4,
                            py: 1,
                            borderRadius: 2
                        }}
                    >
                        {confirmText ?? '확인'}
                    </Button>
                )}
            </Box>
        </Backdrop>
    );
};
