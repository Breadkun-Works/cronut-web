'use client';

import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, Typography } from '@mui/material';
import { getCookie } from '@/utils/cookie';
import { useRouter } from 'next/navigation';
import { COLORS_DARK } from '@/data';
import { useResponsive } from '@/utils/hook';
import CafeMenu from '@/components/page/cafe/menu/index';

interface CartMenuByIdProps {
    cartBasic: {
        title: string;
        status: string;
        cafeLocation: string;
    };
    cartId: string;
    entry?: string;
}

const CartMenuById = ({ cartBasic, cartId, entry }: CartMenuByIdProps) => {
    const router = useRouter();
    const [openModal, setOpenModal] = useState(false);
    const { isMobile } = useResponsive();
    const name = getCookie('BRK-UserName') || '사용자';

    useEffect(() => {
        if (cartBasic?.status === 'INACTIVE') {
            setOpenModal(true);
        }
    }, [cartBasic]);

    const handleClose = () => {
        setOpenModal(false);
        router.push('/cafe/cart');
    };

    console.log(cartBasic);

    return (
        <>
            {/* ✅ 만료된 상태 - Alert */}
            {cartBasic?.status === 'INACTIVE' && (
                <Dialog
                    open={openModal}
                    onClose={handleClose}
                    sx={{
                        '& .MuiDialog-container': {
                            alignItems: 'center',
                            justifyContent: 'center'
                        },
                        '& .MuiDialog-paper': {
                            backgroundColor: COLORS_DARK.background.main,
                            maxWidth: 'none',
                            borderRadius: '16px',
                            boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                            overflow: 'hidden',
                            border: '1px solid rgba(255, 255, 255, 0.1)'
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
                        <Typography variant="body1">
                            {cartBasic.title} 장바구니의 이용 가능 시간이 만료되었습니다.
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>확인</Button>
                    </DialogActions>
                </Dialog>
            )}
            {/* ✅ 정상 상태 - 카페 메뉴 */}
            {cartBasic.status === 'ACTIVE' && (
                <CafeMenu
                    entry={entry}
                    cartBasic={cartBasic}
                    title={`${name}님,${isMobile ? '\n' : ' '}카페 메뉴를 선택해주세요.`}
                    cartId={cartId}
                />
            )}
        </>
    );
};

export default CartMenuById;
