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
        <Box
            maxWidth={'900px'}
            margin={'2rem 2rem 1rem 2rem'}
            sx={{ display: 'flex', justifyContent: entry === 'menu' ? 'space-between' : 'flex-end' }}
        >
            {entry === 'menu' && <CompanySelect entry={'cafe'} />}
            {entry !== 'menu' ? (
                <CartBadge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    badgeContent={1}
                    color="error"
                    sx={{
                        '& .MuiBadge-badge': {
                            top: 6,
                            right: 6,
                            backgroundColor: COLORS_DARK.badge.hot,
                            color: '#fff',
                            fontWeight: 'bold',
                            boxShadow: '0 0 0 2px #212529'
                        }
                    }}
                >
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
