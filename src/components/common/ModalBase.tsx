import React from 'react';
import { Modal, Box, IconButton, Typography } from '@mui/material';
import { Close } from '@mui/icons-material';
import { Stack } from '@/components/ui/Stack/Stack';

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
                    <Stack gap={10} align={'center'}>
                        <img src="/logo/breadkunSpinLogo.webp" alt={title} width={28} height={28} />
                        <Typography fontWeight="bold" color="#fb923c" fontSize={24}>
                            {title}
                        </Typography>
                    </Stack>
                    <IconButton onClick={onClose} sx={{ padding: '0', color: '#94a3b8' }}>
                        <Close />
                    </IconButton>
                </Box>
                <Box mt={3}>{children}</Box>
            </Box>
        </Modal>
    );
};

export default ModalBase;
