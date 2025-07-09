'use client';

import { Box, Button, Divider, Stack, Typography } from '@mui/material';
import { useModal } from '@/atom/common-atom';
import { InquiryModal } from '@/components/InquiryModal';

export const BusRenewal = () => {
    const { modal, openModal, closeModal } = useModal('contact');

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
                    alt={'pullman'}
                    src={`${process.env.NEXT_PUBLIC_STORAGE_BASE_URL}images/logo/pullman.webp`}
                    width={'25%'}
                    height={'25%'}
                ></img>
                {/*<img src={'/logo/breadkunSpinLogo.webp'} width={80} height={80}></img>*/}
                <Typography variant="h3" component="h1" fontWeight="bold">
                    버스 서비스 리뉴얼 중
                </Typography>
            </Stack>

            <Stack spacing={2} sx={{ mb: 2, color: '#d1d5db', textAlign: 'center' }}>
                <Typography variant="h6">버스가 곧 도착합니다... 🚌⏳</Typography>
                <Typography variant="body1">조금만 더 기다려주실래요?</Typography>
            </Stack>

            <Box padding={2}>
                <Divider sx={{ borderColor: '#404040', mb: 4 }} />
                <Stack spacing={3} alignItems="center">
                    <Typography variant="body2" sx={{ color: '#9ca3af', textAlign: 'center' }}>
                        원하시는 기능이 있다면 아래 문의하기를 통해 알려주세요!
                    </Typography>

                    <Button
                        variant="outlined"
                        sx={{
                            width: { xs: '100%', sm: 'auto' },
                            borderColor: '#d97706',
                            color: '#d97706',
                            padding: '8px 16px 8px 16px',
                            '&:hover': {
                                borderColor: '#b45309',
                                backgroundColor: 'rgba(217, 119, 6, 0.1)'
                            }
                        }}
                        onClick={openModal}
                    >
                        문의하기
                    </Button>

                    <Typography variant="body2" sx={{ color: '#9ca3af', textAlign: 'center' }}>
                        빠른 시일 내에 만나뵙겠습니다! 🍞
                    </Typography>
                </Stack>
            </Box>

            <InquiryModal isOpen={modal.isOpen} onClose={closeModal} inquiryType="other" />
        </Box>
    );
};
