'use client';

import React, { useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { getCookie } from '@/utils/cookie';
import { useRouter } from 'next/navigation';
import { useResponsive } from '@/utils/hook';
import CafeMenu from '@/components/page/cafe/menu/index';
import { CommonModal } from '@/components/page/cafe/modal/common-modal';
import { useModal } from '@/atom/common-atom';
import { EllipsisTooltip } from '@/components/common/EllipsisTooltip';

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
    const { isMobile } = useResponsive();
    const name = getCookie('BRK-UserName') || '사용자';
    const expiredModal = useModal('expiredModal');

    useEffect(() => {
        if (cartBasic?.status === 'INACTIVE') {
            expiredModal.openModal();
        }
    }, [cartBasic]);

    const handleClose = () => {
        expiredModal.closeModal();
        router.push('/cafe/cart');
    };

    return (
        <>
            {cartBasic?.status === 'INACTIVE' && (
                <CommonModal
                    open={expiredModal.modal.isOpen}
                    title={'장바구니 만료'}
                    content={
                        <Box>
                            <Typography variant="body1" fontWeight={'bold'}>
                                {cartBasic.title} 장바구니의
                            </Typography>
                            이용 가능 시간이 만료되었습니다.
                        </Box>
                    }
                    onClose={handleClose}
                />
            )}

            {cartBasic.status === 'ACTIVE' && (
                <CafeMenu
                    entry={entry}
                    cartBasic={cartBasic}
                    title={
                        <>
                            <EllipsisTooltip title={name}>
                                <Typography
                                    noWrap
                                    sx={{
                                        display: 'inline-block',
                                        maxWidth: '200px', // 최대 너비 설정 (조정 가능)
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        verticalAlign: 'middle'
                                    }}
                                >
                                    {name}
                                </Typography>
                            </EllipsisTooltip>
                            님, {isMobile ? '\n' : ' '}카페 메뉴를 선택해주세요.
                        </>
                    }
                    cartId={cartId}
                />
            )}
        </>
    );
};

export default CartMenuById;
