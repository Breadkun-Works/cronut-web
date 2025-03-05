'use client';
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Box,
    Container,
    Typography,
    Card,
    CardContent,
    IconButton
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { ChevronDown, ChevronUp, Trash2, FoldVertical, UnfoldVertical } from 'lucide-react';
import Image from 'next/image';
import { getCookie } from '@/utils/cookie';
import { face1 } from '../../[id]/images';

interface Contributor {
    userId: string;
    userName: string;
    quantity: number;
    createdAt: string;
}

interface OrderItem {
    cafeCartId: string;
    cafeMenuId: number;
    name: string;
    drinkTemperature: string;
    isPersonalCup: boolean;
    price: number;
    totalPrice: number;
    category: string;
    imageFilename: string;
    imageUrl: string;
    totalQuantity: number;
    contributors: Contributor[];
    id: string;
    createdById: string;
    createdByName: string;
    quantity: number;
    createdAt: string;
}

export default function OrderConfirmation({ params }: { params: { id: string } }) {
    const [openIndices, setOpenIndices] = useState<number[]>([]);
    const [openAll, setOpenAll] = useState<boolean>(false);
    const [totalPrice, setTotalPrice] = useState<number>(0);

    const {
        data: orderItems = [],
        isLoading,
        error
    } = useQuery({
        queryKey: ['orderItems', params.id],
        queryFn: async () => {
            try {
                const response = await fetch(`https://api.breadkun.com/api/cafe/carts/${params.id}/items/summary`);
                if (!response.ok) throw new Error('네트워크 응답 실패');
                const json = await response.json();
                if (json.data?.cafeCartItemSummary) {
                    const total = json.data.cafeCartItemSummary.reduce((acc: number, item: OrderItem) => {
                        return acc + item.totalPrice;
                    }, 0);
                    setTotalPrice(total);
                }
                return json.data?.cafeCartItemSummary || [];
            } catch (err) {
                console.error(err);
                throw new Error('데이터를 가져오는 중 오류 발생');
            }
        },
        staleTime: 1000 * 60 * 5,
        retry: 1
    });

    const toggleAccordion = (index: number) => {
        setOpenIndices(prev => (prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]));
    };

    const toggleAllAccordion = (open: boolean) => {
        setOpenIndices(open ? orderItems.map((_: OrderItem, index: number) => index) : []);
    };

    const uuid = getCookie('BRK-UUID');
    console.log(uuid);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading data</div>;

    return (
        <Container maxWidth="md" sx={{ p: 2 }}>
            <Box sx={{ width: '100%' }}>
                <Box
                    component="header"
                    sx={{
                        backgroundColor: '#1c1f21',
                        borderBottom: '1px solid #333',
                        p: 2
                    }}
                >
                    <Typography variant="h4" color="white">
                        주문 확인
                    </Typography>
                </Box>

                <Box component="main" sx={{ mt: 2 }}>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 2,
                            width: '100%'
                        }}
                    >
                        <Typography variant="h5">주문 목록</Typography>
                        {openAll ? (
                            <IconButton
                                onClick={() => {
                                    setOpenAll(false);
                                    toggleAllAccordion(false);
                                }}
                            >
                                <FoldVertical size={30} color="white" />
                            </IconButton>
                        ) : (
                            <IconButton
                                onClick={() => {
                                    setOpenAll(true);
                                    toggleAllAccordion(true);
                                }}
                            >
                                <UnfoldVertical size={30} color="white" />
                            </IconButton>
                        )}
                    </Box>

                    {orderItems.length > 0 &&
                        orderItems.map((item: OrderItem, index: number) => (
                            <Accordion
                                key={index}
                                expanded={openIndices.includes(index)}
                                onChange={() => toggleAccordion(index)}
                                sx={{
                                    mb: 2,
                                    bgcolor: '#1c1f21',
                                    color: '#fff',
                                    width: '100%',
                                    borderRadius: '10px'
                                }}
                            >
                                <AccordionSummary
                                    expandIcon={
                                        openIndices.includes(index) ? (
                                            <ChevronUp color="white" />
                                        ) : (
                                            <ChevronDown color="white" />
                                        )
                                    }
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                        <Typography
                                            sx={{
                                                flexGrow: 1,
                                                minWidth: '100px',
                                                fontSize: '1.3em',
                                                wordBreak: 'keep-all'
                                            }}
                                        >
                                            {item.drinkTemperature} {item.name}
                                            <span style={{ fontSize: '0.8em' }}>
                                                {item.isPersonalCup ? ' (개인컵)' : ''}
                                            </span>
                                        </Typography>
                                        <Typography
                                            sx={{ mx: 2, minWidth: '80px', textAlign: 'center', fontSize: '1em' }}
                                        >
                                            총 {item.totalQuantity}잔
                                        </Typography>
                                    </Box>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography align="right" sx={{ fontSize: '1em', p: 1 }}>
                                        {item.contributors.length} 명이 주문했습니다.
                                    </Typography>
                                    <Card sx={{ width: '100%', mb: 2 }}>
                                        <CardContent
                                            sx={{
                                                p: 2,
                                                bgcolor: '#333',
                                                display: 'flex',
                                                flexDirection: { xs: 'column', sm: 'row' },
                                                alignItems: 'center'
                                            }}
                                        >
                                            <Box sx={{ width: 120, height: 150, mr: { sm: 2 }, mb: { xs: 2, sm: 0 } }}>
                                                <Image
                                                    src="https://plus.unsplash.com/premium_photo-1675435644687-562e8042b9db?q=80&w=3749&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                                    alt={item.name}
                                                    width={120}
                                                    height={150}
                                                    style={{ objectFit: 'cover' }}
                                                />
                                            </Box>
                                            <Box sx={{ flexGrow: 1, width: '100%' }}>
                                                <Typography variant="h6" color="white">
                                                    주문자:
                                                </Typography>
                                                <Box sx={{ mt: 2, width: '100%' }}>
                                                    <Grid container spacing={2}>
                                                        {item.contributors.map(contributor => (
                                                            <Grid item xs={12} md={6} key={contributor.userId}>
                                                                <Box
                                                                    key={contributor.userId}
                                                                    sx={{
                                                                        color: '#000',
                                                                        borderRadius: 1,
                                                                        p: 1,
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'space-between',
                                                                        minWidth: '110px',
                                                                        width: '100%'
                                                                    }}
                                                                >
                                                                    <Image
                                                                        src={face1}
                                                                        alt={contributor.userName}
                                                                        width={50}
                                                                        height={50}
                                                                        style={{ borderRadius: '50%' }}
                                                                    />
                                                                    <Typography variant="body1">
                                                                        {contributor.userName} x {contributor.quantity}
                                                                    </Typography>
                                                                    <Typography
                                                                        variant="body1"
                                                                        sx={{ flexGrow: 1, textAlign: 'right' }}
                                                                    >
                                                                        {`${(
                                                                            contributor.quantity * item.price
                                                                        ).toLocaleString('ko-KR')} 원`}
                                                                    </Typography>
                                                                </Box>
                                                            </Grid>
                                                        ))}
                                                    </Grid>
                                                </Box>
                                            </Box>

                                            {uuid === item.createdById && (
                                                <IconButton onClick={() => {}} sx={{ ml: 2 }}>
                                                    <Trash2 />
                                                </IconButton>
                                            )}
                                        </CardContent>
                                    </Card>
                                </AccordionDetails>
                            </Accordion>
                        ))}

                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            fontSize: '1.5em',
                            mt: 4,
                            backgroundColor: '#1c1f21',
                            borderTop: '1px solid #333',
                            p: 2,
                            color: 'white',
                            width: '100%'
                        }}
                    >
                        <Typography sx={{ fontSize: '1.1em' }}>총 주문 금액</Typography>
                        <Typography sx={{ fontSize: '1.1em' }}>{totalPrice.toLocaleString()}원</Typography>
                    </Box>
                </Box>
            </Box>
        </Container>
    );
}
