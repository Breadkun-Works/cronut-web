'use client';
import { CartBadge } from '@/styles/cart/cart.styles';
import React from 'react';
import { useRouter } from 'next/navigation';
import { CompanySelect } from '@/components/CompanySelect';
import { Box, IconButton } from '@mui/material';
import { COLORS_DARK } from '@/data';
import { ShoppingCart } from 'lucide-react';
import HeaderCartButton from '@/components/page/cafe/header/create-cart-button';

export const CafeHeader = ({ entry, title, cartId }: any) => {
    const router = useRouter();
    return (
        <Box sx={{ display: 'flex', justifyContent: entry === 'menu' ? 'space-between' : 'flex-end' }}>
            {entry === 'menu' && <CompanySelect entry={'cafe'} />}
            {entry !== 'menu' ? (
                <CartBadge badgeContent={1} color="error" sx={{ paddingRight: '10px' }}>
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
        </Box>
    );
};
