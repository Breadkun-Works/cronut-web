'use client';

import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Container, Card, CardMedia, Box, Button, Grid } from '@mui/material';
import Link from 'next/link';
import { ChevronLeft, Trash2, CupSodaIcon as Cup } from 'lucide-react';
import { useRouter } from 'next/navigation';
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

export default function OrderConfirmation({ params }: { params: { id: string } }) {
    const router = useRouter();

    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const uuid = getCookie('BRK-UUID');
    const {
        data: cartData = [],
        isLoading,
        error
    } = useQuery({
        queryKey: ['orderItems', params.id],
        queryFn: async () => {
            try {
                const response = await fetch(
                    `https://api.breadkun.com/api/cafe/carts/${params.id}/items?include=DETAILS`
                );
                if (!response.ok) throw new Error('네트워크 응답 실패');
                const json = await response.json();
                return json.data?.cafeCartItem || [];
            } catch (err) {
                console.error(err);
                throw new Error('데이터를 가져오는 중 오류 발생');
            }
        },
        staleTime: 1000 * 60 * 5,
        retry: 1
    });

    useEffect(() => {
        console.log(cartData);
        if (!isLoading && !error) {
            setCartItems(cartData as CartItem[]);
        }
        setLoading(isLoading);
    }, [cartData, isLoading, error]);

    const removeItem = (id: string) => {
        setCartItems(cartItems.filter(item => item.id !== id));
    };

    const totalPrice = cartItems
        .filter(item => item.createdById === uuid)
        .reduce((sum, item) => sum + item.drinkTotalPrice, 0);

    if (loading) {
        return (
            <Box
                sx={{
                    minHeight: '100vh',
                    backgroundColor: '#1C1F21',
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
                backgroundColor: '#1C1F21',
                color: 'white',
                pb: 10,
                width: '100%',
                maxWidth: 'md'
            }}
        >
            <AppBar position="sticky" sx={{ backgroundColor: '#1C1F21', borderBottom: '1px solid #333' }}>
                <Toolbar sx={{ height: '75px' }}>
                    <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>
                        <IconButton edge="start" color="inherit" aria-label="back">
                            <ChevronLeft size={24} />
                        </IconButton>
                    </Link>
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
                                                    <Typography variant="body2" sx={{ color: '#ccc', mt: 2, mb: 1 }}>
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
                            <Typography variant="h6">총 주문 금액</Typography>
                        </Grid>
                        <Grid item>
                            <Typography variant="h5" fontWeight="bold">
                                {totalPrice.toLocaleString()}원
                            </Typography>
                        </Grid>
                    </Grid>
                    <Button
                        variant="contained"
                        fullWidth
                        sx={{
                            backgroundColor: '#8B4513',
                            py: 1.5,
                            fontSize: '1.125rem',
                            '&:hover': { backgroundColor: '#6B3410' }
                        }}
                        onClick={() => router.push(`/cafe/cart/result/${params.id}`)}
                        disabled={cartItems.length === 0}
                    >
                        주문하기
                    </Button>
                </Container>
            </Box>
        </Box>
    );
}
