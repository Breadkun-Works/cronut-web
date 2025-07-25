'use client';
import { Box, IconButton, Slide, Typography } from '@mui/material';
import { COLORS_DARK } from '@/data';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import React, { forwardRef } from 'react';
import {
    ButtonIcon,
    ButtonsContainer,
    FooterButton,
    OrderAmountCard,
    OrderFooter,
    OrderLabelTypography,
    OrderPriceTypography
} from '@/styles/cart/cart.styles';
import { CircleDollarSign, CupSoda, LockIcon } from 'lucide-react';
import { IUserInfo } from '@/types/cart';
import { useRouter, useSearchParams } from 'next/navigation';
import { snackBarAtom, useModal } from '@/atom/common-atom';
import { CommonModal } from '@/components/page/cafe/modal/common-modal';
import { useResponsiveConfig } from '@/utils/hook';
import { expireCart } from '@/apis/cafe/cafe-api';
import { useQueryClient } from '@tanstack/react-query';
import { useAtom } from 'jotai';
import { CartFooterBottom } from '@/styles/components/page/cart/cart-footer.styles';

interface ICartFooterProps {
    isCollapsed: boolean;
    setIsCollapsed: (value: boolean) => void;
    footerOpen: boolean;
    setFooterOpen: (value: boolean) => void;
    cartInfo: { isCartInactive: boolean; cartId: string; user: IUserInfo; totalPrice: number; isCreator: boolean };
    decryptedData: { accountNumber: string; bankName: string } | undefined;
}

export const CartFooter = forwardRef<HTMLDivElement, ICartFooterProps>(
    ({ isCollapsed, setIsCollapsed, footerOpen, setFooterOpen, cartInfo, decryptedData }, ref) => {
        const { isCartInactive, cartId, user, totalPrice, isCreator } = cartInfo;
        const { fontSize, iconSize } = useResponsiveConfig('cart');
        const [, setSnackbarContent] = useAtom(snackBarAtom);

        const router = useRouter();
        const searchParams = useSearchParams();

        const paymentModal = useModal('paymentModal');
        const confirmModal = useModal('confirmModal');
        const expiredModal = useModal('expiredModal');

        const handleExpireCart = async () => {
            const res = await expireCart({ cafeCartId: cartId, user });
            if (res) {
                setSnackbarContent({ open: true, message: '주문이 마감되었습니다.', severity: 'info' });
                window.location.reload();
            } else {
                setSnackbarContent({ open: true, message: '마감중 오류가 발생했습니다.', severity: 'error' });
            }
        };

        return (
            <>
                {isCollapsed && (
                    <Box
                        sx={{
                            position: 'fixed',
                            bottom: 0,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            zIndex: 1000
                        }}
                    >
                        <IconButton
                            disableFocusRipple
                            onClick={() => {
                                setFooterOpen(true);
                                setIsCollapsed(false);
                            }}
                            sx={{
                                width: 80,
                                height: 25,
                                borderRadius: '10px 10px 0 0',
                                backgroundColor: COLORS_DARK.theme.blue,
                                color: '#fff',
                                transition: 'none !important'
                            }}
                        >
                            <ExpandLess />
                        </IconButton>
                    </Box>
                )}
                <Slide
                    in={footerOpen}
                    onExited={() => setIsCollapsed(true)}
                    direction="up"
                    mountOnEnter
                    unmountOnExit
                    timeout={300}
                >
                    <OrderFooter ref={ref}>
                        {/* 접기 버튼 */}
                        <Box
                            sx={{
                                position: 'absolute',
                                bottom: '100%',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                zIndex: 1200
                            }}
                        >
                            <IconButton
                                disableFocusRipple
                                onClick={() => setFooterOpen(false)}
                                sx={{
                                    width: 80,
                                    height: 20,
                                    borderRadius: '10px 10px 0 0',
                                    backgroundColor: COLORS_DARK.theme.blue,
                                    transform: 'translateY(10%)',
                                    color: '#fff',
                                    '&:hover': {
                                        backgroundColor: `${COLORS_DARK.theme.blue} !important`
                                    }
                                }}
                            >
                                <ExpandMore />
                            </IconButton>
                        </Box>

                        <CartFooterBottom>
                            {!isCartInactive && (
                                <OrderAmountCard>
                                    <Box display="flex" justifyContent="space-between" alignItems="center">
                                        <OrderLabelTypography>내 주문 금액</OrderLabelTypography>
                                        <OrderPriceTypography>{totalPrice.toLocaleString()}원</OrderPriceTypography>
                                    </Box>
                                </OrderAmountCard>
                            )}

                            <ButtonsContainer disabledAll={isCartInactive}>
                                <FooterButton
                                    sx={{ fontSize }}
                                    variant={!decryptedData && !isCreator ? 'contained' : undefined}
                                    onClick={() => {
                                        if (cartInfo.isCartInactive) {
                                            expiredModal.openModal();
                                        } else {
                                            if (user.userName && user.userProfile) {
                                                router.push(`/cafe/cart/menu/${cartId}?${searchParams}`);
                                            } else {
                                                router.push(`/cafe/cart/register/${cartId}?${searchParams}`);
                                            }
                                        }
                                    }}
                                    disabled={isCartInactive}
                                >
                                    <ButtonIcon
                                        disabled={isCartInactive}
                                        iconColor={
                                            !decryptedData && !isCreator
                                                ? COLORS_DARK.text.primary
                                                : COLORS_DARK.accent.dark
                                        }
                                        iconSize={(iconSize as number) + 2}
                                    >
                                        <CupSoda />
                                    </ButtonIcon>
                                    메뉴 담기
                                </FooterButton>

                                {isCreator ? (
                                    <FooterButton
                                        sx={{ fontSize }}
                                        disabled={isCartInactive}
                                        variant="contained"
                                        onClick={() => confirmModal.openModal()}
                                    >
                                        <ButtonIcon
                                            disabled={isCartInactive}
                                            iconColor={COLORS_DARK.text.primary}
                                            iconSize={(iconSize as number) + 2}
                                        >
                                            <LockIcon />
                                        </ButtonIcon>
                                        마감하기
                                    </FooterButton>
                                ) : (
                                    <>
                                        {decryptedData && (
                                            <FooterButton
                                                sx={{ fontSize }}
                                                variant="contained"
                                                disabled={isCartInactive || !decryptedData}
                                                onClick={() => paymentModal.openModal()}
                                            >
                                                <ButtonIcon
                                                    iconSize={(iconSize as number) + 2}
                                                    iconColor={COLORS_DARK.text.primary}
                                                >
                                                    <CircleDollarSign />
                                                </ButtonIcon>
                                                송금하기
                                            </FooterButton>
                                        )}
                                    </>
                                )}
                            </ButtonsContainer>
                        </CartFooterBottom>
                    </OrderFooter>
                </Slide>

                <CommonModal
                    open={confirmModal.modal.isOpen}
                    onClose={() => confirmModal.closeModal()}
                    title={'장바구니 마감'}
                    onConfirm={handleExpireCart}
                    confirmText={'마감'}
                    content={
                        <Box display={'flex'} justifyContent={'center'} alignItems={'center'}>
                            <Typography
                                sx={{
                                    whiteSpace: 'pre-line',
                                    textAlign: 'center',
                                    wordBreak: 'keep-all',
                                    overflowWrap: 'break-word',
                                    maxWidth: '90%',
                                    fontSize: fontSize,
                                    lineHeight: 1.4
                                }}
                            >
                                공유받은 사용자는 장바구니 메뉴{' '}
                                {/*마감 시, 이 장바구니에 접근한 모든 사용자는 더 이상{' '}*/}
                                <strong style={{ textDecoration: 'underline' }}>추가/수정</strong> 및{' '}
                                <strong style={{ textDecoration: 'underline' }}>송금</strong>이 제한됩니다😭
                                {/*<strong style={{ textDecoration: 'underline' }}>메뉴 담기</strong>를 할 수 없습니다.😭*/}
                                <br />
                                <br />
                                정말 마감하시겠습니까?
                                {/*주문 마감 시, 이 장바구니에 접근한 모든 사용자가 더 이상 상품을{' '}*/}
                                {/*<strong style={{ textDecoration: 'underline' }}>추가</strong>하거나{' '}*/}
                                {/*<strong style={{ textDecoration: 'underline' }}>수정</strong>할 수 없습니다😭*/}
                                {/*<br />*/}
                                {/*<br />*/}
                                {/*마감하시겠습니까?*/}
                            </Typography>
                        </Box>
                    }
                />
            </>
        );
    }
);

CartFooter.displayName = 'CartFooter';
