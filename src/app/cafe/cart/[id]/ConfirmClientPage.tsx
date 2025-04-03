'use client';

import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Container, Card, CardMedia, Box, Button, Grid } from '@mui/material';
import axios from 'axios';
import { ChevronLeft, Trash2, CupSodaIcon as Cup } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getCookie } from '@/utils/cookie';
import { useQuery } from '@tanstack/react-query';
import { face1 } from './images';
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
import Image from 'next/image';
interface ConfirmClientPageProps {
    decryptedData?: { acctNo: string; acctNm: string };
    cartId: string;
}
export default function OrderConfirmation({ decryptedData, cartId }: ConfirmClientPageProps) {
    const router = useRouter();

    const uuid = getCookie('BRK-UUID');
    const {
        data: initialCartItems = [],
        isLoading,
        error
    } = useQuery({
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

    const [cartItems, setCartItems] = useState<CartItem[]>([]);

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
            console.error('SSE 에러 발생:', err);
            eventSource.close();
        };

        return () => {
            eventSource.removeEventListener(eventName, handleEvent);
            eventSource.close();
        };
    }, [cartId]);

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

    return (
        <Box
            sx={{
                minHeight: '100vh',
                color: 'white',
                pb: 10,
                width: '100%',
                maxWidth: 'md'
            }}
        >
            <AppBar position="sticky" sx={{ backgroundColor: '#1C1F21', borderBottom: '1px solid #333' }}>
                <Toolbar sx={{ height: '75px' }}>
                    <IconButton edge="start" color="inherit" aria-label="back" onClick={() => router.back()}>
                        <ChevronLeft size={24} />
                    </IconButton>

                    <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: 'center' }}>
                        주문 확인
                    </Typography>
                    <Box sx={{ width: 48 }} />
                </Toolbar>
            </AppBar>

            <Container sx={{ mt: 2 }}>
                <Typography variant="h5" gutterBottom>
                    주문 목록
                </Typography>

                {cartItems.length === 0 ? (
                    <Typography align="center" sx={{ py: 4, color: '#aaa' }}>
                        장바구니가 비어있습니다.
                    </Typography>
                ) : (
                    <Grid container spacing={2} sx={{ mb: '130px' }}>
                        {cartItems.map(item => (
                            <Grid item xs={12} key={item.id}>
                                <Card sx={{ backgroundColor: '#2C2F31', color: 'white' }}>
                                    <Grid container spacing={2}>
                                        <Grid
                                            item
                                            sx={{ display: 'flex', justifyContent: 'center', position: 'relative' }}
                                        >
                                            <CardMedia
                                                component="img"
                                                image={
                                                    'https://plus.unsplash.com/premium_photo-1675435644687-562e8042b9db?q=80&w=3749&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                                                }
                                                alt={item.drinkName}
                                                sx={{
                                                    width: 96,
                                                    objectFit: 'cover',
                                                    borderRadius: 1
                                                }}
                                            />
                                            {item.isPersonalCup && (
                                                <Box
                                                    sx={{
                                                        width: 96,
                                                        position: 'absolute',
                                                        bottom: 0,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        backgroundColor: '#4caf50',

                                                        px: 0.5,
                                                        py: 0.25
                                                    }}
                                                >
                                                    <Cup size={16} style={{ marginRight: 4 }} />
                                                    <Typography variant="caption">개인컵</Typography>
                                                </Box>
                                            )}
                                        </Grid>
                                        <Grid item xs container direction="column" spacing={1}>
                                            <Grid item container justifyContent="space-between" alignItems="flex-start">
                                                <Grid item xs={10} sx={{ pt: 1 }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                                        <Typography variant="h6">{item.drinkName}</Typography>
                                                        <Box
                                                            sx={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                bgcolor:
                                                                    item.drinkTemperature === 'HOT'
                                                                        ? '#B22222'
                                                                        : '#1E90FF',
                                                                borderRadius: 2,
                                                                px: 0.5,
                                                                py: 0,
                                                                ml: 1
                                                            }}
                                                        >
                                                            <Typography variant="caption">
                                                                {item.drinkTemperature}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <Image
                                                            src={face1}
                                                            alt={item.createdByName}
                                                            width={20}
                                                            height={20}
                                                            style={{
                                                                borderRadius: '50%',
                                                                marginLeft: -2
                                                            }}
                                                        />
                                                        <Typography variant="body2" sx={{ color: '#ccc', ml: 1 }}>
                                                            {item.createdByName}
                                                        </Typography>
                                                    </Box>
                                                    <Typography variant="body2" sx={{ color: '#ccc', mt: 1, mb: 1 }}>
                                                        개당 {item.drinkPrice?.toLocaleString()}원
                                                    </Typography>
                                                </Grid>
                                                <Grid item>
                                                    {item.createdById === uuid && (
                                                        <IconButton onClick={() => removeItem(item.id)} color="error">
                                                            <Trash2 size={20} />
                                                        </IconButton>
                                                    )}
                                                </Grid>
                                            </Grid>
                                            <Grid
                                                item
                                                container
                                                justifyContent="space-between"
                                                alignItems="center"
                                                sx={{ borderTop: '1px solid #444', pt: 1, pr: 1 }}
                                            >
                                                <Grid item>
                                                    <Typography variant="body2">수량: {item.quantity}잔</Typography>
                                                </Grid>
                                                <Grid item>
                                                    <Typography variant="subtitle1" fontWeight="bold">
                                                        {item.drinkTotalPrice?.toLocaleString()}원
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Container>

            <Box
                sx={{
                    width: '100%',
                    maxWidth: 'md',
                    position: 'fixed',
                    bottom: 0,
                    left: '50%',
                    transform: 'translate(-50%, 0)',
                    backgroundColor: '#2C2F31',
                    borderTop: '1px solid #333',
                    p: 2
                }}
            >
                <Container>
                    <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                        <Grid item>
                            <Typography variant="h6">나의 총 주문 금액</Typography>
                        </Grid>
                        <Grid item>
                            <Typography variant="h5" fontWeight="bold">
                                {totalPrice.toLocaleString()}원
                            </Typography>
                        </Grid>
                    </Grid>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                            variant="contained"
                            fullWidth
                            sx={{
                                backgroundColor: '#8B4513',
                                py: 1.5,
                                fontSize: '1.125rem',
                                '&:hover': { backgroundColor: '#6B3410' }
                            }}
                            onClick={() => router.push(`/cafe/cart/${cartId}/menu`)}
                        >
                            주문하기
                        </Button>
                        <Button
                            variant="contained"
                            fullWidth
                            sx={{
                                backgroundColor: '#8B4513',
                                py: 1.5,
                                fontSize: '1.125rem',
                                '&:hover': { backgroundColor: '#6B3410' }
                            }}
                            onClick={() => {
                                if (decryptedData) {
                                    const { acctNm, acctNo } = decryptedData;

                                    window.open(
                                        `supertoss://send?amount=${encodeURIComponent(totalPrice || 1)}&bank=${encodeURIComponent(acctNm)}&accountNo=${encodeURIComponent(acctNo)}`,
                                        '_blank'
                                    );
                                }
                            }}
                        >
                            토스로 정산하기
                        </Button>
                    </Box>
                </Container>
            </Box>
        </Box>
    );
}
