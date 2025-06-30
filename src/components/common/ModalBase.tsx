import React from 'react';
import { Modal, Box, IconButton, Typography } from '@mui/material';
import { Close } from '@mui/icons-material';

interface ModalBaseProps {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
    maxWidth?: string | number;
    title: string;
}

const ModalBase: React.FC<ModalBaseProps> = ({ open, onClose, children, maxWidth = 'sm', title }) => {
    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '90%',
                    maxWidth: 600,
                    bgcolor: '#212529',
                    color: 'white',
                    p: 4,
                    pt: 2,
                    borderRadius: 2,
                    outline: 'none'
                }}
            >
                <Box display="flex" alignItems="center" gap={1} mb={1} justifyContent="space-between">
                    <Box display="flex" alignItems="center" gap={1}>
                        <img src="/logo/breadkunSpinLogo.webp" alt={title} width={24} height={24} />
                        <Typography fontWeight="bold" color="#fb923c" fontSize={20}>
                            {title}
                        </Typography>
                    </Box>
                    <IconButton onClick={onClose} sx={{ color: '#94a3b8' }}>
                        <Close />
                    </IconButton>
                </Box>
                <Box mt={3}>{children}</Box>
            </Box>
        </Modal>
    );
};

export default ModalBase;
