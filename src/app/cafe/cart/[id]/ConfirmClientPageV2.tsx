'use client';

import React, { useState, useEffect } from 'react';
import {
    IconButton,
    Typography,
    Container,
    CardMedia,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    InputAdornment,
    TextField
} from '@mui/material';
import axios from 'axios';
import {
    ChevronLeft,
    Trash2,
    CupSodaIcon as Cup,
    CopyIcon,
    ShareIcon,
    Share2,
    ShoppingCart,
    HandCoins,
    CupSoda,
    LockIcon,
    CircleDollarSign,
    DeleteIcon,
    Bold
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getCookie } from '@/utils/cookie';
import { useQuery } from '@tanstack/react-query';

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
import {
    ActionButton,
    BottomSummary,
    ButtonIcon,
    ButtonsContainer,
    CartConfirmContainer,
    CartItemCard,
    CartItemContent,
    ConfirmHeader,
    ConfirmTemperatureBadge,
    Header,
    HeaderContent,
    ItemDetails,
    ItemImage,
    LinkShareCard,
    LinkShareContent,
    ScrollableContent,
    StyledMenuTitle,
    TemperatureBadge,
    UserAvatar,
    WhiteButton
} from '@/styles/cart/cart.styles';
import { useIsMobile } from '@/utils/hook';
import { COLORS_DARK } from '@/data';
import { useGetCartById } from '@/apis/cafe/cafe-api';
import { ExpiredModal } from '@/components/page/cafe/modal/expired-modal';
interface ConfirmClientPageProps {
    decryptedData?: { acctNo: string; acctNm: string };
    cartId: string;
    status: string;
}

export default function OrderConfirmation({ decryptedData, cartId, status }: ConfirmClientPageProps) {
    const router = useRouter();
    const isMobile = useIsMobile();
    const searchParams = useSearchParams();

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [speedDialOpen, setSpeedDialOpen] = useState(false);
    const [isCreator, setIsCreator] = useState(false);

    const uuid = getCookie('BRK-UUID');
    const userName = getCookie('BRK-UserName');

    const { data: initialCartItems = [], isLoading } = useQuery({
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

    const { data: cartBasic } = useGetCartById(cartId);

    console.log(cartBasic);

    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [reloadDialogOpen, setReloadDialogOpen] = useState<boolean>(false);
    const [inactiveDialogOpen, setInactiveDialogOpen] = useState<boolean>(false);

    useEffect(() => {
        if (!isLoading && initialCartItems) {
            setCartItems(initialCartItems);
        }
    }, [initialCartItems, isLoading]);

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
            if (cartBasic?.status === 'INACTIVE') {
                return;
            }

            console.error('SSE 에러 발생:', err);
            eventSource.close();
        };

        return () => {
            eventSource.removeEventListener(eventName, handleEvent);
            eventSource.close();
        };
    }, [cartId]);

    useEffect(() => {
        if (cartBasic) {
            if (cartBasic.status === 'INACTIVE') {
                setInactiveDialogOpen(true);
            }
            if (cartBasic.createdById === uuid) {
                setIsCreator(true);
            }
        }
    }, [cartBasic]);

    const handleRefresh = () => {
        window.location.reload();
    };

    const deleteCartItem = async (id: string) => {
        try {
            const res = await axios.post(`https://api.breadkun.com/api/cafe/carts/items/delete`, { ids: [id] });
            return res.status === 204;
        } catch (e) {
            console.error(e);
        }
    };

    const removeItem = async (id: string) => {
        const res = await deleteCartItem(id);
        if (res) setCartItems(cartItems.filter(item => item.id !== id));
    };

    const totalPrice = cartItems
        .filter(item => item.createdById === uuid)
        .reduce((sum, item) => sum + item.drinkTotalPrice, 0);

    if (isLoading) {
        return (
            <Box
                sx={{
                    minHeight: '100vh',
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

    // 샘플 공유 링크
    const shareLink = window.location.href;

    // 링크 복사 함수
    const copyLinkToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(shareLink);
            setSnackbarOpen(true);
            setSpeedDialOpen(false);
        } catch (err) {
            console.error('Failed to copy link: ', err);
        }
    };

    // 사용자 이니셜 가져오기 (이미지가 없을 경우 대체용)
    const getUserInitial = (name: string) => {
        return name.charAt(0);
    };

    return (
        <CartConfirmContainer>
            <ConfirmHeader>
                <ShoppingCart className={'mt-1'} />
                <Typography variant="h6" fontWeight="bold" sx={{ color: COLORS_DARK.text.primary, marginLeft: '1rem' }}>
                    {cartBasic?.title}
                </Typography>
                {/*<Typography variant="subtitle1" sx={{ color: COLORS_DARK.text.secondary, mb: 0.5 }}>*/}
                {/*    장바구니*/}
                {/*</Typography>*/}
            </ConfirmHeader>
            <ScrollableContent className={isMobile ? 'mobile' : ''}>
                <Container disableGutters>
                    {!isMobile && (
                        <LinkShareCard>
                            <LinkShareContent>
                                <Box display="flex" alignItems="center" mb={1}>
                                    <Share2
                                        size={24}
                                        style={{
                                            marginRight: '8px',
                                            color: COLORS_DARK.accent.main
                                        }}
                                    />
                                    <Typography variant="subtitle2" fontWeight="medium">
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
                                                    <IconButton
                                                        edge="end"
                                                        onClick={copyLinkToClipboard}
                                                        sx={{
                                                            color: COLORS_DARK.accent.main,
                                                            '&:hover': {
                                                                backgroundColor: `${COLORS_DARK.accent.main}20`
                                                            }
                                                        }}
                                                    >
                                                        <CopyIcon fontSize="small" />
                                                    </IconButton>
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
                    {cartItems.length === 0 ? (
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                py: 8,
                                px: 4,
                                textAlign: 'center',
                                backgroundColor: COLORS_DARK.background.lighter,
                                borderRadius: 3,
                                mt: 2
                            }}
                        >
                            <ShoppingCart
                                size={60}
                                style={{ color: COLORS_DARK.text.tertiary, marginBottom: '24px' }}
                            />
                            <Typography variant="h6" fontWeight="bold" sx={{ color: COLORS_DARK.text.primary, mb: 1 }}>
                                장바구니가 비어있습니다
                            </Typography>
                            <Typography variant="body2" sx={{ color: COLORS_DARK.text.secondary, mb: 4 }}>
                                메뉴를 추가하여 함께 주문해보세요
                            </Typography>
                        </Box>
                    ) : (
                        <>
                            {cartItems.map(item => {
                                return (
                                    <CartItemCard key={item.id}>
                                        <CartItemContent>
                                            <Box display={'flex'} alignItems={'stretch'}>
                                                <ItemImage>
                                                    <CardMedia
                                                        component="img"
                                                        image={
                                                            'https://img.freepik.com/free-photo/iced-cola-tall-glass_1101-740.jpg'
                                                        }
                                                        alt={item.drinkName}
                                                        sx={{
                                                            width: '100%',
                                                            height: '100%',
                                                            objectFit: 'cover'
                                                        }}
                                                    />
                                                </ItemImage>
                                                <ItemDetails>
                                                    <Box>
                                                        <Box
                                                            display="flex"
                                                            justifyContent="space-between"
                                                            alignItems="flex-start"
                                                        >
                                                            <Box display="flex" alignItems="center">
                                                                <Typography
                                                                    variant="subtitle1"
                                                                    fontWeight="medium"
                                                                    sx={{
                                                                        color: COLORS_DARK.text.primary,
                                                                        position: 'relative',
                                                                        top: '1px'
                                                                    }}
                                                                >
                                                                    {item.drinkName}
                                                                </Typography>
                                                                {item.drinkTemperature && (
                                                                    <ConfirmTemperatureBadge
                                                                        temperature={item.drinkTemperature}
                                                                        label={item.drinkTemperature}
                                                                        size="small"
                                                                    />
                                                                )}
                                                            </Box>
                                                            {item.createdById === uuid && (
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={() => removeItem(item.id)}
                                                                    sx={{
                                                                        color: COLORS_DARK.text.secondary,
                                                                        padding: 0
                                                                    }}
                                                                >
                                                                    <Trash2 fontSize="small" />
                                                                </IconButton>
                                                            )}
                                                        </Box>

                                                        <Box display="flex" alignItems="center" mb={1}>
                                                            <UserAvatar
                                                                src={`/user-img/face1.png`}
                                                                alt={item.createdByName}
                                                            >
                                                                {getUserInitial(item.createdByName)}
                                                            </UserAvatar>
                                                            <Typography
                                                                variant="body2"
                                                                sx={{ color: COLORS_DARK.text.secondary }}
                                                            >
                                                                {item.createdByName}
                                                            </Typography>
                                                        </Box>
                                                    </Box>

                                                    <Box
                                                        display="flex"
                                                        justifyContent="space-between"
                                                        alignItems="center"
                                                        width="100%"
                                                    >
                                                        <Typography
                                                            variant="body2"
                                                            sx={{ color: COLORS_DARK.text.primary }}
                                                        >
                                                            수량: {item.quantity}잔
                                                        </Typography>
                                                        <Typography
                                                            variant="subtitle2"
                                                            fontWeight="bold"
                                                            sx={{
                                                                color: COLORS_DARK.accent.main
                                                            }}
                                                        >
                                                            {item.drinkTotalPrice.toLocaleString()}원
                                                        </Typography>
                                                    </Box>
                                                </ItemDetails>
                                            </Box>
                                        </CartItemContent>
                                    </CartItemCard>
                                );
                            })}
                        </>
                    )}
                </Container>
            </ScrollableContent>

            <BottomSummary elevation={0}>
                <Container disableGutters sx={{ maxWidth: '900px' }}>
                    {/* 내 주문 금액 */}
                    <Box
                        sx={{
                            background: COLORS_DARK.theme.purple,
                            borderRadius: 3,
                            padding: '16px',
                            marginBottom: 2,
                            border: `1px solid ${COLORS_DARK.accent.main}30`
                        }}
                    >
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="subtitle1" fontWeight="bold" sx={{ color: COLORS_DARK.text.primary }}>
                                내 주문 금액
                            </Typography>
                            <Typography variant="h5" fontWeight="bold" sx={{ color: COLORS_DARK.text.primary }}>
                                {totalPrice.toLocaleString()}원
                            </Typography>
                        </Box>
                    </Box>

                    <ButtonsContainer>
                        <WhiteButton
                            fullWidth
                            onClick={() => {
                                if (userName) {
                                    router.push(`/cafe/cart/menu/${cartId}?${searchParams}`);
                                } else {
                                    router.push(`/cafe/cart/register/${cartId}?${searchParams}`);
                                }
                            }}
                        >
                            <ButtonIcon>
                                <CupSoda style={{ marginRight: '8px', color: COLORS_DARK.accent.main }} />
                            </ButtonIcon>
                            메뉴 담기
                        </WhiteButton>

                        {isCreator ? (
                            // 장바구니 생성자인 경우
                            <ActionButton variant="contained" fullWidth>
                                <ButtonIcon>
                                    <LockIcon />
                                </ButtonIcon>
                                주문 마감하기
                            </ActionButton>
                        ) : (
                            // 장바구니에 초대된 사람인 경우
                            <ActionButton variant="contained" fullWidth>
                                <ButtonIcon>
                                    <CircleDollarSign />
                                </ButtonIcon>
                                송금하기
                            </ActionButton>
                        )}
                    </ButtonsContainer>
                </Container>
            </BottomSummary>

            <ExpiredModal
                open={inactiveDialogOpen}
                onClose={() => setInactiveDialogOpen(false)}
                onConfirm={() => {
                    setInactiveDialogOpen(false);
                    router.push('/cafe/cart');
                }}
                content={
                    <Typography variant="body1">
                        <Typography fontSize="1.2rem" fontWeight="bold">
                            {cartBasic?.title}
                        </Typography>
                        <br />
                        {typeof window !== 'undefined' && window.innerWidth <= 457 ? (
                            <>
                                장바구니의 이용 가능 시간이
                                <br />
                                만료되었습니다.
                            </>
                        ) : (
                            '장바구니의 이용 가능 시간이 만료되었습니다.'
                        )}
                    </Typography>
                }
            />
            {/*<Dialog*/}
            {/*    open={inactiveDialogOpen}*/}
            {/*    onClose={() => {*/}
            {/*        setInactiveDialogOpen(false);*/}
            {/*    }}*/}
            {/*    sx={{*/}
            {/*        '& .MuiDialog-container': {*/}
            {/*            alignItems: 'center',*/}
            {/*            justifyContent: 'center'*/}
            {/*        },*/}
            {/*        '& .MuiDialog-paper': {*/}
            {/*            backgroundColor: COLORS_DARK.background.main, // 다크모드에서 배경색 더 밝게*/}
            {/*            maxWidth: 'none',*/}
            {/*            borderRadius: '16px',*/}
            {/*            boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)',*/}
            {/*            overflow: 'hidden',*/}
            {/*            border: '1px solid rgba(255, 255, 255, 0.1)'*/}
            {/*        }*/}
            {/*    }}*/}
            {/*>*/}
            {/*    <DialogContent*/}
            {/*        sx={{*/}
            {/*            color: COLORS_DARK.text.primary,*/}
            {/*            padding: '24px',*/}
            {/*            textAlign: 'center'*/}
            {/*        }}*/}
            {/*    >*/}
            {/*        <Typography variant="body1">*/}
            {/*            {cartBasic?.title} 장바구니의 이용 가능 시간이 만료되었습니다.*/}
            {/*        </Typography>*/}
            {/*    </DialogContent>*/}
            {/*    <DialogActions*/}
            {/*        sx={{*/}
            {/*            padding: '12px 24px',*/}
            {/*            display: 'flex',*/}
            {/*            justifyContent: 'center'*/}
            {/*        }}*/}
            {/*    >*/}
            {/*        <Button*/}
            {/*            onClick={() => {*/}
            {/*                setInactiveDialogOpen(false);*/}
            {/*                router.push('/cafe/cart');*/}
            {/*            }}*/}
            {/*            sx={{*/}
            {/*                backgroundColor: COLORS_DARK.accent.main,*/}
            {/*                color: '#fff',*/}
            {/*                '&:hover': {*/}
            {/*                    backgroundColor: COLORS_DARK.accent.dark*/}
            {/*                },*/}
            {/*                padding: '8px 16px',*/}
            {/*                borderRadius: '4px',*/}
            {/*                fontWeight: 'medium'*/}
            {/*            }}*/}
            {/*        >*/}
            {/*            확인*/}
            {/*        </Button>*/}
            {/*    </DialogActions>*/}
            {/*</Dialog>*/}

            <Dialog open={reloadDialogOpen && !inactiveDialogOpen} disableEscapeKeyDown onClose={() => {}}>
                <DialogTitle>세션 만료</DialogTitle>
                <DialogContent>페이지를 새로고침 해주세여.</DialogContent>
                <DialogActions>
                    <Button variant="contained" color="primary" onClick={handleRefresh}>
                        새로고침
                    </Button>
                </DialogActions>
            </Dialog>
        </CartConfirmContainer>
    );
}
