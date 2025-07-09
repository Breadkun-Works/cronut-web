'use client';
import { Box, Button, Divider, Stack, Typography } from '@mui/material';
import { ArrowLeft, HomeIcon } from 'lucide-react';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useResponsive } from '@/utils/hook';

const NotFound = () => {
    const router = useRouter();
    const { isDesktop } = useResponsive();
    const goBack = () => {
        const prevPath = window.location.pathname;
        router.back();
        setTimeout(() => {
            if (window.location.pathname === prevPath) {
                router.push('/'); // 이전 페이지 이동 실패시 홈으로 강제 이동
            }
        }, 300);
    };

    return (
        <Box
            display={'flex'}
            minHeight="calc(100vh - 90px)"
            justifyContent={'center'}
            flexDirection={'column'}
            alignItems="center"
        >
            <Stack
                display={'flex'}
                flexDirection={'column'}
                alignItems="center"
                justifyContent="center"
                spacing={2}
                sx={{ mb: 2 }}
            >
                <img
                    alt={'moodyPullman'}
                    src={`${process.env.NEXT_PUBLIC_STORAGE_BASE_URL}images/logo/moodyPullman.webp`}
                    width={'27%'}
                    height={'27%'}
                ></img>
                <Typography
                    variant="h3"
                    component="h1"
                    fontWeight="bold"
                    textAlign={'center'}
                    sx={{
                        padding: '0 16px 0 16px',
                        whiteSpace: 'normal',
                        textAlign: 'center',
                        wordBreak: 'keep-all'
                    }}
                >
                    페이지를 찾을 수 없습니다
                </Typography>
            </Stack>
            <Stack spacing={2} sx={{ mb: 2, color: '#d1d5db', textAlign: 'center' }}>
                <Typography
                    variant="h6"
                    sx={{
                        padding: '0 16px 0 16px',
                        whiteSpace: 'normal',
                        textAlign: 'center',
                        wordBreak: 'keep-all'
                    }}
                >
                    앗! 길을 잃으셨나요? 😢
                </Typography>
                <Typography
                    variant="body1"
                    sx={{
                        padding: '0 20px',
                        whiteSpace: 'normal',
                        textAlign: 'center',
                        wordBreak: 'keep-all'
                    }}
                >
                    요청하신 페이지가 존재하지 않거나
                    {!isDesktop ? <br /> : ' '}
                    이동되었을 수 있습니다.
                </Typography>
            </Stack>
            <Box padding={2}>
                <Divider sx={{ borderColor: '#404040', mb: 4 }} />
                <Stack spacing={3} alignItems="center">
                    <Typography
                        variant="body2"
                        sx={{
                            color: '#9ca3af',
                            whiteSpace: 'normal',
                            textAlign: 'center',
                            wordBreak: 'keep-all'
                        }}
                    >
                        주소를 다시 확인해보시거나 아래 버튼을 통해 이동해주세요.
                    </Typography>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} width="100%" justifyContent="center">
                        <Button
                            startIcon={<HomeIcon />}
                            sx={{
                                backgroundColor: '#d97706',
                                color: 'white',
                                '&:hover': {
                                    backgroundColor: '#b45309'
                                },
                                padding: '8px 16px 8px 16px',
                                width: { xs: '100%', sm: 'auto' }
                            }}
                            onClick={() => router.push('/')}
                        >
                            홈으로 가기
                        </Button>
                        <Button
                            variant="outlined"
                            startIcon={<ArrowLeft />}
                            sx={{
                                borderColor: '#d97706',
                                color: '#d97706',
                                '&:hover': {
                                    borderColor: '#b45309',
                                    backgroundColor: 'rgba(217, 119, 6, 0.1)'
                                },
                                padding: '8px 16px 8px 16px',
                                width: { xs: '100%', sm: 'auto' }
                            }}
                            onClick={goBack}
                        >
                            이전 페이지
                        </Button>
                    </Stack>
                </Stack>
            </Box>
        </Box>
    );
};

export default NotFound;
