'use client';

import { Box, Button, Container, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { getCookie } from '@/utils/cookie';
import CafeMenu from '@/components/page/cafe/menu';
import { useGetCartById } from '@/apis/cafe/cafe-api';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { COLORS_DARK } from '@/data';

const CartMenuById = ({ params }: { params: { id: string; userId: string } }) => {
    const name = getCookie('BRK-UserName');
    const { data: cartInfo, isLoading, isSuccess } = useGetCartById(params.id);
    const router = useRouter();
    const [openModal, setOpenModal] = useState(false);

    const handleClose = () => {
        setOpenModal(false);
        router.push('/cafe/cart');
    };

    useEffect(() => {
        if (isSuccess && cartInfo?.status === 'INACTIVE') {
            setOpenModal(true);
        }
    }, [cartInfo, isSuccess]);

    if (isSuccess && cartInfo && cartInfo.status !== 'ACTIVE') {
        return (
            <Dialog
                open={openModal}
                onClose={handleClose}
                sx={{
                    '& .MuiDialog-container': {
                        alignItems: 'center',
                        justifyContent: 'center'
                    },
                    '& .MuiDialog-paper': {
                        backgroundColor: COLORS_DARK.background.main, // 다크모드에서 배경색 더 밝게
                        maxWidth: 'none',
                        margin: 0,
                        borderRadius: '16px',
                        boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                        // boxShadow: isDarkMode
                        //     ? '0 -4px 20px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)'
                        //     : '0 -4px 20px rgba(0, 0, 0, 0.3)',
                        overflow: 'hidden',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                        // border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.1)' : 'none'
                    }
                }}
            >
                <DialogContent
                    sx={{
                        color: COLORS_DARK.text.primary,
                        padding: '24px',
                        textAlign: 'center'
                    }}
                >
                    <Typography variant="body1">이 장바구니는 접근할 수 없습니다.</Typography>
                </DialogContent>
                <DialogActions
                    sx={{
                        padding: '12px 24px',
                        display: 'flex',
                        justifyContent: 'center'
                    }}
                >
                    <Button
                        onClick={handleClose}
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
    } else {
        return (
            <CafeMenu
                entry={'personalCart'}
                title={`${name}님, 장바구니에 담을 메뉴를 선택해주세요.`}
                cartId={params.id}
            />
        );
    }
};

export default CartMenuById;
