'use client';
import { Box, Button, Divider, Stack, Typography } from '@mui/material';
import Link from 'next/link';
import { ArrowLeft, HomeIcon } from 'lucide-react';
import React from 'react';
import styled from '@emotion/styled';
import { StyledBox } from '@/styles/exception/exception.styles';

const CTAButton = styled(Button)(({ theme }) => ({
    backgroundColor: '#d97706',
    color: 'white',
    padding: theme.spacing(1.5, 4),
    borderRadius: theme.spacing(1),
    fontWeight: 'medium',
    '&:hover': {
        backgroundColor: '#b45309'
    }
}));

const SecondaryButton = styled(Button)(({ theme }) => ({
    borderColor: '#d97706',
    color: '#d97706',
    padding: theme.spacing(1.5, 4),
    borderRadius: theme.spacing(1),
    fontWeight: 'medium',
    '&:hover': {
        borderColor: '#b45309',
        backgroundColor: 'rgba(217, 119, 6, 0.1)'
    }
}));

const notFound = () => {
    return (
        <StyledBox>
            {/*<Box textAlign="center" sx={{ maxWidth: 600 }}>*/}
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
                페이지를 찾을 수 없습니다
            </Typography>
            <Stack spacing={2} sx={{ mb: 6, color: '#d1d5db', textAlign: 'center' }}>
                <Typography variant="h6">앗! 길을 잃으셨나요? 😢</Typography>
                <Typography variant="body1">요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.</Typography>
                <Typography variant="body2" sx={{ color: '#9ca3af' }}>
                    주소를 다시 확인해보시거나 아래 버튼을 통해 이동해주세요.
                </Typography>
            </Stack>
            <Box padding={2}>
                <Divider sx={{ borderColor: '#404040', mb: 4 }} />
                <Stack spacing={3} alignItems={'center'} justifyContent="center">
                    <Link href={'/'}>
                        <CTAButton variant="contained" size="large" startIcon={<HomeIcon />}>
                            홈으로 가기
                        </CTAButton>
                        <SecondaryButton variant="outlined" size="large" startIcon={<ArrowLeft />}>
                            이전 페이지
                        </SecondaryButton>
                    </Link>
                </Stack>
            </Box>
            <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                justifyContent="center"
                alignItems="center"
                sx={{ mb: 6 }}
            >
                <Link href={'/'}>
                    <CTAButton variant="contained" size="large" startIcon={<HomeIcon />}>
                        홈으로 가기
                    </CTAButton>
                </Link>

                <SecondaryButton variant="outlined" size="large" startIcon={<ArrowLeft />}>
                    이전 페이지
                </SecondaryButton>
            </Stack>
            {/*</Box>*/}
        </StyledBox>
    );
};

export default notFound;
