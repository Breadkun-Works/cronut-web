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
    Container,
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
import { getUserInitial, useMaxWidthByViewport, useResponsive } from '@/utils/hook';
import { useRouter, useSearchParams } from 'next/navigation';
import { deleteCartItem, useGetCartById } from '@/apis/cafe/cafe-api';
import { useQuery } from '@tanstack/react-query';
import PaymentModal from '@/app/cafe/cart/[id]/PaymentModal';
import { CafeCartItem, IDeleteCartItem } from '@/types/cart';
import { CartConfirmModal } from '@/components/page/cafe/modal/cart-confirm-modal';
import { CafeSummaryModal } from '@/components/page/cafe/modal/cafe-summary-modal';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { EllipsisTooltip } from '@/components/page/cafe/cafe-title-tooltip';
import { ShareCartDialog } from '@/components/page/cafe/modal/share-modal';
interface ConfirmClientPageProps {
    decryptedData?: { accountNumber: string; bankName: string };
    cartId: string;
    status: string;
    isCreator: boolean;
    user: {
        uuid?: string;
        userName?: string;
    };
}
interface CartItem {
    id: string;
    cafeCartId: string;
    cafeMenuId: number;
    isPersonalCup: boolean;
    quantity: number;
    imageUrl: string;
    createdAt: string;
    createdById: string;
    createdByName: string;
    drinkName: string;
    drinkPrice: number;
    drinkTotalPrice: number;
    drinkCategory: string;
    drinkTemperature: 'HOT' | 'ICED';
    drinkImageFilename: string;
    drinkImageUrl: string;
}

export const ConfirmClientV3 = ({ decryptedData, cartId, status, isCreator, user }: ConfirmClientPageProps) => {
    const { isMobile } = useResponsive();
    const searchParams = useSearchParams();
    const { data: cartBasic } = useGetCartById(cartId);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [unAccessibleCart, setUnAccessibleCart] = useState(false);
    const isCartReallyInactive = unAccessibleCart || cartBasic?.status === 'INACTIVE' || status === 'INACTIVE';

    // 샘플 공유 링크
    const shareLink = window.location.href;
    const [paymentModalOpen, setPaymentModalOpen] = useState<boolean>(false);
    const [reloadDialogOpen, setReloadDialogOpen] = useState<boolean>(false);
    const [open, setOpen] = useState(true);
    const [isCollapsed, setIsCollapsed] = useState(false); // Slide가 완전히 닫히고 나서 버튼 나게 나게 하기 위해
    const [headerModalOpen, setHeaderModalOpen] = useState({ type: '', open: false });
    const [snackbar, setSnackbar] = useState({ open: false, message: '', variant: '', device: '' });
    const { fontSize } = useMaxWidthByViewport();

    const router = useRouter();

    const bottomRef = useRef<HTMLDivElement>(null); // 펼쳐졌을 때 하단 영역
    const semiHeaderRef = useRef<HTMLDivElement>(null); // 세미 헤더 (있다면)
    const confirmHeaderRef = useRef<HTMLDivElement>(null);

    const [bottomHeight, setBottomHeight] = useState(160);

    // 링크 복사 함수
    const copyLinkToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(shareLink);
            setSnackbar({ open: true, message: '🔗 URL이 복사되었습니다!', variant: 'success', device: 'PC' });
        } catch (err) {
            console.error('Failed to copy link: ', err);
        }
    };

    const handleRefresh = () => {
        if (typeof window !== 'undefined') {
            window.location.reload();
        }
    };

    const removeItem = async (cafeCartId: string) => {
        if (user) {
            const res = await deleteCartItem({ cafeCartId, user } as IDeleteCartItem);
            if (res) setCartItems(cartItems.filter(item => item.id !== cafeCartId));
        }
    };

    const { data: initialCartItems = [], isLoading } = useQuery<CafeCartItem[]>({
        queryKey: ['orderItems', cartId],
        queryFn: async () => {
            const response = await fetch(`https://api.breadkun.com/api/cafe/carts/${cartId}/items?include=DETAILS`);
            if (!response.ok) throw new Error('네트워크 응답 실패');
            const json = await response.json();
            return json.data?.cafeCartItem || [];
        },
        staleTime: 0,
        refetchOnMount: 'always',
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

    useEffect(() => {
        // SSE 연결 설정
        const eventSource = new EventSource(`https://api.breadkun.com/sse/cafe/carts/${cartId}/items/subscribe`);
        const eventName = `cafe-cart-item-${cartId}`;
        const handleEvent = (e: MessageEvent) => {
            const eventData = JSON.parse(e.data);
            setCartItems(prevItems => {
                if (eventData.event === 'CREATED') {
                    return [
                        ...prevItems,
                        ...eventData.data.cafeCartItem.filter(
                            (newItem: CartItem) => !prevItems.some(item => item.id === newItem.id)
                        )
                    ];
                } else if (eventData.event === 'DELETED') {
                    return prevItems.filter(item => !eventData.data.id.includes(item.id));
                } else {
                    return prevItems;
                }
            });
        };
        eventSource.addEventListener(eventName, handleEvent);

        eventSource.onerror = err => {
            if (status === 'INACTIVE' || cartBasic?.status === 'INACTIVE') {
                setUnAccessibleCart(true);
            } else {
                setReloadDialogOpen(true);
            }

            console.error('SSE 에러 발생:', err);
            eventSource.close();
        };

        return () => {
            eventSource.removeEventListener(eventName, handleEvent);
            eventSource.close();
        };
    }, [cartId, cartBasic]);

    useEffect(() => {
        if (!isLoading && initialCartItems) {
            setCartItems(initialCartItems);
        }
    }, [initialCartItems, isLoading]);

    useEffect(() => {
        if (!bottomRef.current) return;

        const updateBottomHeight = () => {
            const bottom = bottomRef.current!.getBoundingClientRect().height + 20;
            setBottomHeight(bottom);
        };

        updateBottomHeight();

        const resizeObserver = new ResizeObserver(updateBottomHeight);
        if (bottomRef.current) resizeObserver.observe(bottomRef.current);

        window.addEventListener('resize', updateBottomHeight);

        return () => {
            resizeObserver.disconnect();
            window.removeEventListener('resize', updateBottomHeight);
        };
    }, []);

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
        <Container
            sx={{
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            <Box ref={semiHeaderRef}>
                {isCartReallyInactive && (
                    <CartWarningWrapper>
                        <CartWarningText>
                            ⚠️ 장바구니의 주문 가능 시간이 만료되었습니다. 메뉴 담기 및 송금이 불가합니다. ⚠️
                            &nbsp;&nbsp;&nbsp; ⚠️ 장바구니의 주문 가능 시간이 만료되었습니다. 메뉴 담기 및 송금이
                            불가합니다. ⚠️
                        </CartWarningText>
                    </CartWarningWrapper>
                )}

                <ConfirmHeader isMobile={isMobile}>
                    <Box sx={{ width: '60%' }} ref={confirmHeaderRef}>
                        {/*<ShoppingCart />*/}
                        <EllipsisTooltip
                            parentRef={confirmHeaderRef}
                            title={cartBasic?.title as string}
                            isMobile={isMobile}
                        />
                    </Box>

                    <Box
                        sx={{
                            width: '40%',
                            display: 'flex',
                            justifyContent: 'flex-end',
                            gap: 0.5,
                            marginTop: isMobile ? 0.5 : 0
                        }}
                    >
                        {!isMobile ? (
                            <Tooltip title="요약 보기" placement="top" arrow>
                                <IconButton
                                    onClick={() => setHeaderModalOpen({ type: 'summary', open: true })}
                                    sx={{ cursor: 'pointer' }}
                                >
                                    <ClipboardList />
                                </IconButton>
                            </Tooltip>
                        ) : (
                            <>
                                <Box
                                    onClick={() => setHeaderModalOpen({ type: 'summary', open: true })}
                                    sx={{ cursor: 'pointer', marginRight: 1 }}
                                >
                                    <ClipboardList />
                                </Box>
                                <Box
                                    sx={{ cursor: 'pointer' }}
                                    onClick={() => setHeaderModalOpen({ type: 'share', open: true })}
                                >
                                    <Share2 />
                                </Box>
                            </>
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
                                // disabled={isCartReallyInactive}
                                InputProps={{
                                    readOnly: true,
                                    style: { color: COLORS_DARK.text.primary },
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <Box display="flex" alignItems="center">
                                                <IconButton
                                                    edge="end"
                                                    // disabled={isCartReallyInactive}
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
            <ScrollableCartList bottomHeight={bottomHeight} isEmpty={cartItems.length === 0}>
                {cartItems.length === 0 ? (
                    <Box
                        sx={{
                            minHeight: `calc(100vh - 18vh - ${semiHeaderRef.current?.getBoundingClientRect().height}px - ${bottomHeight}px)`,
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
                                                        size="small"
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
                                                    <Trash2 fontSize={fontSize} />
                                                </IconButton>
                                            )}
                                        </Box>

                                        {/* 작성자 */}
                                        <Box display="flex" alignItems="center" mt={1}>
                                            <UserAvatar src={item.imageUrl} alt={item.createdByName}>
                                                {getUserInitial(item.createdByName)}
                                            </UserAvatar>
                                            <Typography>{item.createdByName}</Typography>
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
                        disableRipple
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
                            disableRipple
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

                    <Container disableGutters sx={{ maxWidth: '900px' }}>
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
                                    if (user.userName) {
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
                                    onClick={() => setPaymentModalOpen(true)}
                                >
                                    <ButtonIcon disabled={isCartReallyInactive}>
                                        <LockIcon />
                                    </ButtonIcon>
                                    주문 마감하기
                                </FooterButton>
                            ) : (
                                <FooterButton
                                    variant="contained"
                                    disabled={isCartReallyInactive}
                                    onClick={() => setPaymentModalOpen(true)}
                                >
                                    <ButtonIcon disabled={isCartReallyInactive}>
                                        <CircleDollarSign />
                                    </ButtonIcon>
                                    송금하기
                                </FooterButton>
                            )}
                        </ButtonsContainer>
                    </Container>
                </OrderFooter>
            </Slide>

            {reloadDialogOpen && (
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
                        {/*<SnackbarDialogIcon />*/}
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
        </Container>
    );
};
