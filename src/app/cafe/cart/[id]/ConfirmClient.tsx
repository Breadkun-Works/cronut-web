'use client';

import { LinkShareCard, LinkShareContent, SnackbarDialogContent, SnackbarDialogText } from '@/styles/cart/cart.styles';
import { CopyIcon, Share2 } from 'lucide-react';
import { Box, Dialog, IconButton, InputAdornment, Snackbar, TextField, Typography } from '@mui/material';
import { COLORS_DARK } from '@/data';
import React, { useEffect, useRef, useState } from 'react';
import { getInitialCartItems } from '@/apis/cafe/cafe-api';
import { IUserInfo, CafeCartItem, ICartInfo } from '@/types/cart';
import { useBottomHeight, useCartSync, useResponsive } from '@/utils/hook';
import { useQuery } from '@tanstack/react-query';
import PaymentModal from '@/app/cafe/cart/[id]/PaymentModal';
import { CartConfirmModal } from '@/components/page/cafe/modal/cart-confirm-modal';
import ClapAnimation from '@/components/page/cafe/ClapAnimation';
import { handleRefresh, isMobileDevice } from '@/utils/util';
import { useAtom } from 'jotai';
import { cartItemsAtom } from '@/atom/cart-atom';
import { useModal } from '@/atom/common-atom';
import { ScrollableCartList } from '@/components/page/cart/scrollable-cart-list';
import { CartWaring } from '@/components/page/cart/cart-warning';
import { CartHeader } from '@/components/page/cart/cart-header';
import { CartFooter } from '@/components/page/cart/cart-footer';
import { getCookie } from '@/utils/cookie';

interface ConfirmClientPageProps {
    decryptedData?: { accountNumber: string; bankName: string };
    cartId: string;
    cartData?: ICartInfo;
}

export const ConfirmClient = ({ decryptedData, cartId, cartData }: ConfirmClientPageProps) => {
    const { isMobile } = useResponsive();
    const [cartItems, setCartItems] = useAtom(cartItemsAtom);
    const paymentModal = useModal('paymentModal');
    const [userInfo, setUserInfo] = useState<IUserInfo>({
        uuid: '',
        userName: '',
        userProfile: ''
    });

    useEffect(() => {
        const uuid = getCookie('BRK-UUID');
        const userName = getCookie('BRK-UserName');
        const userProfile = getCookie('BRK-UserProfile');
        setUserInfo({ uuid, userName, userProfile });
    }, []);

    const isCreator = userInfo.uuid === cartData?.createdById;
    const isCartInactive = cartData?.status === 'INACTIVE';

    // 샘플 공유 링크
    const shareLink = window.location.href;
    const [open, setOpen] = useState(true);
    const [isCollapsed, setIsCollapsed] = useState(false); // Slide가 완전히 닫히고 나서 버튼 나게 나게 하기 위해
    const [snackbar, setSnackbar] = useState<{
        open: boolean;
        message?: string;
        variant?: 'success' | 'error';
        device?: 'PC' | 'MOBILE';
    }>({ open: false, message: '', variant: 'success', device: 'PC' });

    const bottomRef = useRef<HTMLDivElement>(null); // 펼쳐졌을 때 하단 영역
    const semiHeaderRef = useRef<HTMLDivElement>(null); // 세미 헤더 (있다면)
    const linkShareCardRef = useRef<HTMLDivElement>(null);
    const cartItemsRef = useRef<CafeCartItem[]>([]);

    const bottomHeight = useBottomHeight(bottomRef, [open]);

    const semiHeaderHeight = semiHeaderRef.current?.getBoundingClientRect().height ?? 0;
    const linkShareCardHeight = linkShareCardRef.current?.getBoundingClientRect().height ?? 0;
    const calculatedBottomHeight = bottomHeight || 0;

    const minHeightValue = `calc(100vh - ${window.innerWidth < 768 ? 64 : 80}px - ${semiHeaderHeight ? `${semiHeaderHeight}px` : '0px'} - ${linkShareCardHeight ? `${linkShareCardHeight}px` : '0px'} - ${calculatedBottomHeight ? `${calculatedBottomHeight}px` : '0px'})`;

    // 링크 복사 함수
    const copyLinkToClipboard = async () => {
        try {
            if (typeof navigator.clipboard !== 'undefined') {
                await navigator.clipboard.writeText(shareLink);
                setSnackbar({ open: true, message: '🔗 URL이 복사되었습니다!', variant: 'success', device: 'PC' });
            }
        } catch (err) {
            console.error('Failed to copy link: ', err);
        }
    };

    const { data: initialCartItems = [], isLoading } = useQuery<CafeCartItem[]>({
        queryKey: ['orderItems', cartId],
        queryFn: () => getInitialCartItems(cartId),
        staleTime: 0,
        enabled: !!cartId,
        refetchOnWindowFocus: false,
        retry: 1
    });

    const totalPrice = cartItems
        .filter(item => item.createdById === userInfo.uuid)
        .reduce((sum, item) => sum + item.drinkTotalPrice, 0);

    const handleCloseSnackbar = () => {
        setSnackbar({ open: false, message: '', variant: 'success', device: 'PC' });
    };

    const { clapPositions, sessionExpired } = useCartSync(cartId as string, false, cartData?.status === 'INACTIVE');

    const reloadModal = useModal('reloadModal');

    //최초 진입시 장바구니 아이템 set하기
    useEffect(() => {
        if (!isLoading && initialCartItems) {
            cartItemsRef.current = initialCartItems;
            setCartItems([...cartItemsRef.current]);
            if (!isCartInactive && sessionExpired) {
                reloadModal.openModal();
            }
        }
    }, [initialCartItems, isLoading]);

    useEffect(() => {
        if (snackbar.open && snackbar.device === 'PC') {
            const timer = setTimeout(() => {
                setSnackbar(prev => ({ ...prev, open: false }));
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [snackbar.open, snackbar.device]);

    if (isLoading) {
        return (
            <Box
                sx={{
                    minHeight: '100svh',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <Typography>로딩 중...</Typography>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                px: { xs: 2, sm: 2.5, md: 3 },
                position: 'relative'
            }}
        >
            <Box ref={semiHeaderRef}>
                <CartWaring isCartInactive={isCartInactive} />
                <CartHeader
                    title={cartData?.title as string}
                    cafeLocation={cartData?.cafeLocation as string}
                    snackbar={snackbar}
                    setSnackbar={setSnackbar}
                />
            </Box>

            {!isMobileDevice() && !isMobile && (
                <LinkShareCard ref={linkShareCardRef}>
                    <LinkShareContent>
                        <Box display="flex" alignItems="center" mb={'8px'}>
                            <Share2
                                size={24}
                                style={{
                                    marginRight: '8px',
                                    color: COLORS_DARK.accent.main
                                }}
                            />
                            <Typography variant="subtitle2" fontSize={'1rem'} fontWeight="medium">
                                장바구니 공유하기
                            </Typography>
                        </Box>
                        <Box display="flex" alignItems="center">
                            <TextField
                                fullWidth
                                variant="outlined"
                                size="small"
                                value={shareLink}
                                InputProps={{
                                    readOnly: true,
                                    style: { color: COLORS_DARK.text.primary },
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <Box display="flex" alignItems="center">
                                                <IconButton
                                                    edge="end"
                                                    onClick={copyLinkToClipboard}
                                                    sx={{
                                                        color: COLORS_DARK.accent.main,
                                                        '&:hover': {
                                                            backgroundColor: `${COLORS_DARK.accent.main}20`
                                                        },
                                                        fontSize: '1.2rem'
                                                    }}
                                                >
                                                    <CopyIcon fontSize="small" />
                                                </IconButton>
                                            </Box>
                                        </InputAdornment>
                                    )
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        border: 'none !important'
                                    },
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                        border: 'none !important'
                                    },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                        border: 'none !important'
                                    },
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 12,
                                        backgroundColor: COLORS_DARK.background.main
                                    }
                                }}
                            />
                        </Box>
                    </LinkShareContent>
                </LinkShareCard>
            )}

            {/*카페 장바구니 아이템 영역*/}
            <ScrollableCartList
                footerOpen={open}
                bottomHeight={bottomHeight}
                minHeight={minHeightValue}
                user={userInfo}
                cartInfo={cartData}
            />

            <CartFooter
                ref={bottomRef}
                isCollapsed={isCollapsed}
                setIsCollapsed={setIsCollapsed}
                footerOpen={open}
                setFooterOpen={setOpen}
                cartInfo={{ isCartInactive, cartId, user: userInfo, totalPrice, isCreator }}
                decryptedData={decryptedData}
            />

            {reloadModal.modal.isOpen && !isCartInactive && (
                <CartConfirmModal
                    open={reloadModal.modal.isOpen}
                    disableEscapeKeyDown
                    onConfirm={() => {
                        handleRefresh();
                        reloadModal.closeModal();
                    }}
                    title={'세션 만료'}
                    content={<>페이지를 새로고침 해주세여.</>}
                />
            )}

            {decryptedData && (
                <PaymentModal
                    open={paymentModal.modal.isOpen}
                    handleClose={paymentModal.closeModal}
                    cafeAccount={decryptedData}
                    totalPrice={totalPrice}
                />
            )}

            {snackbar.open && snackbar.device === 'PC' && (
                <Dialog
                    open={snackbar.open && snackbar.device === 'PC'}
                    onClose={handleCloseSnackbar}
                    PaperProps={{
                        sx: {
                            backgroundColor: 'transparent',
                            boxShadow: 'none',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: '16px'
                        }
                    }}
                >
                    <SnackbarDialogContent>
                        <SnackbarDialogText>{snackbar.message}</SnackbarDialogText>
                    </SnackbarDialogContent>
                </Dialog>
            )}

            {snackbar.open && snackbar.device === 'MOBILE' && (
                <Snackbar
                    open={snackbar.open && snackbar.device === 'MOBILE'}
                    autoHideDuration={2000}
                    onClose={handleCloseSnackbar}
                    message={snackbar.message}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                    ContentProps={{
                        sx: {
                            backgroundColor: COLORS_DARK.accent.main,
                            color: '#fff',
                            fontSize: 14,
                            fontWeight: 'bold'
                        }
                    }}
                />
            )}

            {clapPositions.map(pos => (
                <Box
                    key={pos.id}
                    sx={{
                        position: 'fixed',
                        left: `${pos.x}px`,
                        bottom: bottomRef.current
                            ? `${window.innerHeight - bottomRef.current.getBoundingClientRect().top}px`
                            : '120px',
                        zIndex: 9999,
                        pointerEvents: 'none',
                        transform: 'translateX(-50%)'
                    }}
                >
                    <ClapAnimation />
                </Box>
            ))}
        </Box>
    );
};
