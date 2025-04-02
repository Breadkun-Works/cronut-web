'use client';
import { IconButton } from '@mui/material';
import { COLORS_DARK } from '@/data';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { CartBadge, HeaderContent, StyledMenuTitle } from '@/styles/cart/cart.styles';
import React from 'react';
import { useRouter } from 'next/navigation';
import HeaderCartButton from '@/components/page/cafe/header/create-cart-button';

export const CafeHeader = ({ entry, title, cartId }: any) => {
    const router = useRouter();
    return (
        <HeaderContent sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <IconButton edge="start" sx={{ color: COLORS_DARK.text.primary }}>
                <ArrowLeft />
            </IconButton>
            <StyledMenuTitle>{title}</StyledMenuTitle>
            {entry !== 'menu' ? (
                <CartBadge badgeContent={1} color="error">
                    <IconButton
                        sx={{ color: COLORS_DARK.text.primary }}
                        onClick={() => router.push(`/cafe/cart/${cartId}`)}
                    >
                        <ShoppingCart />
                    </IconButton>
                </CartBadge>
            ) : (
                <HeaderCartButton />
            )}
        </HeaderContent>
    );
};
