'use client';
import React, { useEffect } from 'react';
import { Box, Typography, Container, Grid2 } from '@mui/material';
import { useModal } from '@/atom/common-atom';
import { InquiryModal } from '@/components/InquiryModal';

export default function Contact() {
    const { modal, openModal, closeModal } = useModal('inquiryModal');

    return (
        <Container component={'main'} maxWidth={'md'}>
            <Typography variant="h2">Contact Us</Typography>
            <Grid2 container>
                <Grid2 size={{ md: 12, xs: 12, lg: 12 }}>
                    <Box>
                        <Typography variant="h3" sx={{ color: 'primary.main' }}>
                            함께 하실래요?
                        </Typography>
                        <Typography variant="body1">
                            빵돌이 프로젝트에 함께할 열정적인 팀원을 찾고 있습니다. 우리는 캠퍼스 생활을 더 편리하게
                            만들기 위한 서비스를 개발하고 있어요.
                        </Typography>
                    </Box>
                </Grid2>
                <Grid2 size={9}>
                    <Typography variant="h3">Contact Us</Typography>
                </Grid2>
            </Grid2>
            <InquiryModal isOpen={modal.isOpen} onClose={closeModal} />
        </Container>
    );
}
