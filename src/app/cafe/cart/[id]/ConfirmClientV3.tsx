'use client';

import {
    ButtonIcon,
    ButtonsContainer,
    CartItemCard,
    CartItemContent,
    CartWarningText,
    CartWarningWrapper,
    ConfirmHeader,
    ConfirmTemperatureBadge,
    DrinkNameTypography,
    FooterButton,
    ItemImage,
    LinkShareCard,
    LinkShareContent,
    OrderAmountCard,
    OrderFooter,
    OrderLabelTypography,
    OrderPriceTypography,
    PriceTypography,
    QuantityTypography,
    ScrollableCartList,
    ShoppingCartIcon,
    SnackbarDialogContent,
    SnackbarDialogText,
    UserAvatar
} from '@/styles/cart/cart.styles';
import { CircleDollarSign, ClipboardList, CopyIcon, CupSoda, LockIcon, Share2, Trash2 } from 'lucide-react';
import {
    Box,
    CardMedia,
    Dialog,
    IconButton,
    InputAdornment,
    Slide,
    Snackbar,
    TextField,
    Tooltip,
    Typography
} from '@mui/material';
import { COLORS_DARK } from '@/data';
import React, { useEffect, useRef, useState } from 'react';
import { expireCart, deleteCartItem, useGetCartById, getInitialCartItems } from '@/apis/cafe/cafe-api';
import { IUserInfo, CafeCartItem, IDeleteCartItem } from '@/types/cart';
import { getUserInitial, useBottomHeight, useCartSync, useResponsive, useResponsiveConfig } from '@/utils/hook';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import PaymentModal from '@/app/cafe/cart/[id]/PaymentModal';
import { CartConfirmModal } from '@/components/page/cafe/modal/cart-confirm-modal';
import { CafeSummaryModal } from '@/components/page/cafe/modal/cafe-summary-modal';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { EllipsisTooltip } from '@/components/page/cafe/cafe-title-tooltip';
import { ShareCartDialog } from '@/components/page/cafe/modal/share-modal';
import ClapAnimation from '@/components/page/cafe/ClapAnimation';
import { handleRefresh } from '@/utils/util';
import { CommonModal } from '@/components/page/cafe/modal/common-modal';
import { useAtom } from 'jotai';
import { cartItemsAtom } from '@/atom/cart-atom';
import { snackBarAtom } from '@/atom/common-atom';
interface ConfirmClientPageProps {
    decryptedData?: { accountNumber: string; bankName: string };
    cartId: string;
    status: string;
    isCreator: boolean;
    user: IUserInfo;
}

export const ConfirmClientV3 = ({ decryptedData, cartId, status, isCreator, user }: ConfirmClientPageProps) => {
    const { isMobile } = useResponsive();
    const searchParams = useSearchParams();
    const { data: cartBasic } = useGetCartById(cartId);
    const [cartItems, setCartItems] = useAtom(cartItemsAtom);

    const [unAccessibleCart, setUnAccessibleCart] = useState(false);
    const isCartReallyInactive = unAccessibleCart || cartBasic?.status === 'INACTIVE' || status === 'INACTIVE';
    const [, setSnackbarContent] = useAtom(snackBarAtom);
    // 샘플 공유 링크
    const shareLink = window.location.href;
    const [paymentModalOpen, setPaymentModalOpen] = useState<boolean>(false);
    const [reloadDialogOpen, setReloadDialogOpen] = useState<boolean>(false);
    const [open, setOpen] = useState(true);
    const [isCollapsed, setIsCollapsed] = useState(false); // Slide가 완전히 닫히고 나서 버튼 나게 나게 하기 위해
    const [headerModalOpen, setHeaderModalOpen] = useState({ type: '', open: false });
    const [snackbar, setSnackbar] = useState({ open: false, message: '', variant: '', device: '' });
    const [openConfirmDialog, setOpenConfirmDialog] = useState<boolean>(false);
    const { fontSize, iconSize, chipSize } = useResponsiveConfig('cart');
    const router = useRouter();
    const queryClient = useQueryClient();

    const bottomRef = useRef<HTMLDivElement>(null); // 펼쳐졌을 때 하단 영역
    const semiHeaderRef = useRef<HTMLDivElement>(null); // 세미 헤더 (있다면)
    const confirmHeaderRef = useRef<HTMLDivElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isScrollable, setIsScrollable] = useState(false);
    const cartItemsRef = useRef<CafeCartItem[]>([]);

    const bottomHeight = useBottomHeight(bottomRef, [open]);

    // 링크 복사 함수
    const copyLinkToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(shareLink);
            setSnackbar({ open: true, message: '🔗 URL이 복사되었습니다!', variant: 'success', device: 'PC' });
        } catch (err) {
            console.error('Failed to copy link: ', err);
        }
    };

    const removeItem = async (cafeCartId: string) => {
        if (!user) return;
        console.log('entered');
        const res = await deleteCartItem({ cafeCartId, user } as IDeleteCartItem);
        console.log(res, 'res');
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
        .filter(item => item.createdById === user.uuid)
        .reduce((sum, item) => sum + item.drinkTotalPrice, 0);

    const handleCloseSnackbar = () => {
        setSnackbar({ open: false, message: '', variant: '', device: '' });
    };

    const showSnackbar = (message: string, variant: 'success' | 'error' = 'success') => {
        setSnackbar({ open: true, message, variant, device: 'MOBILE' });
    };

    const { clapPositions } = useCartSync(cartId, true);

    //최초 진입시 장바구니 아이템 set하기
    useEffect(() => {
        if (!isLoading && initialCartItems) {
            cartItemsRef.current = initialCartItems;
            setCartItems([...cartItemsRef.current]);
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

    useEffect(() => {
        const el = scrollRef.current;
        if (el) {
            setIsScrollable(el.scrollHeight > window.innerHeight);
        }
    }, [cartItems.length, open]);

    const handleExpireCart = async () => {
        const res = await expireCart({ cafeCartId: cartId, user });
        if (res) {
            setSnackbarContent({ open: true, message: '주문이 마감되었습니다.', severity: 'info' });
            queryClient.setQueryData(['cart', cartId], (oldData: any) => ({
                ...oldData,
                status: 'INACTIVE'
            }));
        } else {
            setSnackbarContent({ open: true, message: '마감중 오류가 발생했습니다.', severity: 'error' });
        }
        setOpenConfirmDialog(false);
    };
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
                px: { xs: 2, sm: 2, md: 3 },
                position: 'relative'
            }}
            ref={scrollRef}
        >
            <Box ref={semiHeaderRef}>
                {isCartReallyInactive && (
                    <CartWarningWrapper>
                        <CartWarningText>
                            ⚠️ 장바구니의 주문 가능 시간이 만료되었습니다. 메뉴 담기 및 송금이 불가합니다. ⚠️
                            {isMobile && (
                                <>
                                    &nbsp;&nbsp;&nbsp; ⚠️ 장바구니의 주문 가능 시간이 만료되었습니다. 메뉴 담기 및
                                    송금이 불가합니다. ⚠️
                                </>
                            )}
                        </CartWarningText>
                    </CartWarningWrapper>
                )}

                <ConfirmHeader isMobile={isMobile}>
                    <Box sx={{ width: '80%' }} ref={confirmHeaderRef}>
                        <EllipsisTooltip
                            parentRef={confirmHeaderRef}
                            title={cartBasic?.title as string}
                            isMobile={isMobile}
                        />
                    </Box>

                    <Box
                        sx={{
                            width: '20%',
                            display: 'flex',
                            justifyContent: 'flex-end',
                            gap: 0.5,
                            marginTop: isMobile ? 0.5 : 0
                        }}
                    >
                        {!isMobile ? (
                            <Tooltip title="요약 보기" placement="top" arrow>
                                <IconButton
                                    disabled={cartItems.length === 0}
                                    onClick={() => setHeaderModalOpen({ type: 'summary', open: true })}
                                    sx={{ cursor: 'pointer', padding: '8px 0 0 8px' }}
                                >
                                    <ClipboardList />
                                </IconButton>
                            </Tooltip>
                        ) : (
                            <Box sx={{ display: 'flex', gap: 1.5 }}>
                                <IconButton
                                    disabled={cartItems.length === 0}
                                    onClick={() =>
                                        cartItems.length > 0 && setHeaderModalOpen({ type: 'summary', open: true })
                                    }
                                    sx={{ cursor: 'pointer', padding: 0 }}
                                >
                                    <ClipboardList />
                                </IconButton>
                                <IconButton
                                    sx={{ cursor: 'pointer', padding: 0 }}
                                    onClick={() => setHeaderModalOpen({ type: 'share', open: true })}
                                >
                                    <Share2 />
                                </IconButton>
                            </Box>
                        )}
                    </Box>
                </ConfirmHeader>
            </Box>

            {!isMobile && (
                <LinkShareCard>
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
            <ScrollableCartList
                isScrollable={isScrollable}
                bottomHeight={bottomHeight}
                isEmpty={cartItems.length === 0}
                footerOpen={open}
            >
                {cartItems.length === 0 ? (
                    <Box
                        sx={{
                            minHeight: `calc(100vh - 9vh - ${semiHeaderRef.current?.getBoundingClientRect().height}px - ${bottomHeight}px)`,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '16px',
                            textAlign: 'center',
                            borderRadius: 3
                        }}
                    >
                        <ShoppingCartIcon />
                        <Typography
                            sx={{
                                whiteSpace: 'nowrap',
                                fontWeight: 'bold',
                                fontSize: 'clamp(0.75rem, 4vw, 1.125rem)', // 📌 작으면 0.75rem, 크면 1.125rem
                                lineHeight: 1.4
                            }}
                        >
                            장바구니가 비어있습니다
                        </Typography>

                        <Typography
                            variant="body2"
                            sx={{
                                color: COLORS_DARK.text.secondary,
                                fontSize: 'clamp(0.75rem, 3.5vw, 0.875rem)',
                                maxWidth: '100%',
                                lineHeight: 1.4,
                                whiteSpace: 'normal',
                                wordBreak: 'keep-all'
                            }}
                        >
                            메뉴를 추가하여 함께 주문해보세요
                        </Typography>
                    </Box>
                ) : (
                    cartItems.map(item => (
                        <CartItemCard key={item.id}>
                            <CartItemContent>
                                <Box display="flex" alignItems="stretch" justifyContent={'space-between'}>
                                    {/* 이미지 */}
                                    <ItemImage>
                                        <CardMedia
                                            component="img"
                                            image={item.drinkImageUrl}
                                            alt={item.drinkName}
                                            sx={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover'
                                            }}
                                        />
                                    </ItemImage>

                                    {/* 텍스트 콘텐츠 */}
                                    <Box
                                        display="flex"
                                        flexDirection="column"
                                        justifyContent="space-between"
                                        flex={1}
                                        ml={{ xs: 1.5, md: 2 }}
                                    >
                                        {/* 상단 (이름/온도/삭제) */}
                                        <Box
                                            display="flex"
                                            position="relative"
                                            justifyContent="space-between"
                                            alignItems="flex-start"
                                        >
                                            <Box display="flex" alignItems="center">
                                                <DrinkNameTypography fontSize={fontSize}>
                                                    {item.drinkName}
                                                </DrinkNameTypography>
                                                {item.drinkTemperature && (
                                                    <ConfirmTemperatureBadge
                                                        temperature={item.drinkTemperature}
                                                        label={item.drinkTemperature}
                                                        height={chipSize as number}
                                                    />
                                                )}
                                            </Box>
                                            {item.createdById === user.uuid && cartBasic?.status !== 'INACTIVE' && (
                                                <IconButton
                                                    size="small"
                                                    onClick={() => removeItem(item.id)}
                                                    sx={{
                                                        position: 'absolute',
                                                        right: 0,
                                                        bottom: 1.5,
                                                        color: COLORS_DARK.text.secondary,
                                                        p: 0
                                                    }}
                                                >
                                                    <Trash2 size={iconSize} />
                                                </IconButton>
                                            )}
                                        </Box>

                                        {/* 작성자 */}
                                        <Box display="flex" alignItems="center" mt={1}>
                                            <UserAvatar src={item.imageUrl} alt={item.createdByName}>
                                                {getUserInitial(item.createdByName)}
                                            </UserAvatar>
                                            <Typography fontSize={'0.9rem'}>{item.createdByName}</Typography>
                                        </Box>

                                        <Box
                                            display="flex"
                                            justifyContent="space-between"
                                            alignItems="flex-end"
                                            width="100%"
                                            mt={{ xs: 1.5, md: 'auto' }}
                                            flexDirection={{ xs: 'row', md: 'row' }}
                                        >
                                            <QuantityTypography>수량: {item.quantity}잔</QuantityTypography>
                                            <PriceTypography>
                                                {item.drinkTotalPrice.toLocaleString()} 원
                                            </PriceTypography>
                                        </Box>
                                    </Box>
                                </Box>
                            </CartItemContent>
                        </CartItemCard>
                    ))
                )}
            </ScrollableCartList>

            {/* 펼치기 버튼 */}
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
                            setOpen(true);
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

            {/* Slide로 감싼 OrderFooter */}
            <Slide
                in={open}
                onExited={() => setIsCollapsed(true)}
                direction="up"
                mountOnEnter
                unmountOnExit
                timeout={300}
            >
                <OrderFooter ref={bottomRef}>
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
                            onClick={() => setOpen(false)}
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

                    <Box sx={{ width: '100%', maxWidth: '902px', margin: '0 auto' }}>
                        {!isCartReallyInactive && (
                            <OrderAmountCard>
                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                    <OrderLabelTypography variant="subtitle1">내 주문 금액</OrderLabelTypography>
                                    <OrderPriceTypography variant="h5">
                                        {totalPrice.toLocaleString()}원
                                    </OrderPriceTypography>
                                </Box>
                            </OrderAmountCard>
                        )}

                        <ButtonsContainer disabledAll={isCartReallyInactive}>
                            <FooterButton
                                onClick={() => {
                                    if (user.userName && user.userProfile) {
                                        router.push(`/cafe/cart/menu/${cartId}?${searchParams}`);
                                    } else {
                                        router.push(`/cafe/cart/register/${cartId}?${searchParams}`);
                                    }
                                }}
                                disabled={isCartReallyInactive}
                            >
                                <ButtonIcon disabled={isCartReallyInactive}>
                                    <CupSoda />
                                </ButtonIcon>
                                메뉴 담기
                            </FooterButton>

                            {isCreator ? (
                                <FooterButton
                                    disabled={isCartReallyInactive}
                                    variant="contained"
                                    onClick={() => setOpenConfirmDialog(open)}
                                >
                                    <ButtonIcon disabled={isCartReallyInactive}>
                                        <LockIcon />
                                    </ButtonIcon>
                                    주문 마감하기
                                </FooterButton>
                            ) : (
                                <FooterButton
                                    variant="contained"
                                    disabled={isCartReallyInactive || !decryptedData}
                                    onClick={() => setPaymentModalOpen(true)}
                                >
                                    <ButtonIcon disabled={isCartReallyInactive}>
                                        <CircleDollarSign />
                                    </ButtonIcon>
                                    송금하기
                                </FooterButton>
                            )}
                        </ButtonsContainer>
                    </Box>
                </OrderFooter>
            </Slide>

            {reloadDialogOpen && !isCartReallyInactive && (
                <CartConfirmModal
                    open={reloadDialogOpen}
                    disableEscapeKeyDown
                    onConfirm={() => handleRefresh()}
                    title={'세션 만료'}
                    content={<>페이지를 새로고침 해주세여.</>}
                />
            )}

            {decryptedData && (
                <PaymentModal
                    open={paymentModalOpen}
                    setOpen={setPaymentModalOpen}
                    cafeAccount={decryptedData}
                    totalPrice={totalPrice}
                    handlePayment={setPaymentModalOpen}
                />
            )}
            {headerModalOpen.open && headerModalOpen.type === 'summary' && (
                <CafeSummaryModal
                    cartItems={cartItems}
                    open={headerModalOpen.open}
                    onClose={() => setHeaderModalOpen({ type: '', open: false })}
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

            {headerModalOpen.open && headerModalOpen.type === 'share' && (
                <ShareCartDialog
                    cartTitle={cartBasic?.title as string}
                    open={headerModalOpen.open && headerModalOpen.type === 'share'}
                    onClose={() => {
                        setHeaderModalOpen({ open: false, type: '' });
                    }}
                    showToast={showSnackbar}
                />
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
            <CommonModal
                open={openConfirmDialog}
                onClose={() => setOpenConfirmDialog(false)}
                title={'주문 마감'}
                onConfirm={handleExpireCart}
                confirmText={'마감'}
                content={
                    <Box padding={1.5}>
                        <Typography
                            sx={{
                                whiteSpace: 'pre-wrap',
                                overflowWrap: 'break-word',
                                maxWidth: '90%',
                                fontSize: fontSize,
                                lineHeight: 1.4,
                                textAlign: 'center',
                                margin: 1
                            }}
                        >
                            주문 마감 시, 이 장바구니에 접근한 모든 사용자가
                            <br />더 이상 상품을 <strong style={{ textDecoration: 'underline' }}>
                                추가
                            </strong>하거나 <strong style={{ textDecoration: 'underline' }}>수정</strong>할 수
                            없습니다😭
                            <br />
                            <br />
                            마감하시겠습니까?
                        </Typography>
                    </Box>
                }
            />

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
