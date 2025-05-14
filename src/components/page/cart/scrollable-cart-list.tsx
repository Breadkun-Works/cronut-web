import { cartItemsAtom } from '@/atom/cart-atom';
import { useAtom } from 'jotai';
import React, { useEffect, useRef, useState } from 'react';
import {
    CartItemCard,
    CartItemContent,
    ConfirmTemperatureBadge,
    DrinkNameTypography,
    ItemImage,
    PriceTypography,
    QuantityTypography,
    ShoppingCartIcon,
    StyledScrollableCartList,
    UserAvatar
} from '@/styles/cart/cart.styles';
import { Box, CardMedia, IconButton, Typography } from '@mui/material';
import { COLORS_DARK } from '@/data';
import { Trash2 } from 'lucide-react';
import { getUserInitial, useResponsiveConfig } from '@/utils/hook';
import { deleteCartItem } from '@/apis/cafe/cafe-api';
import { IDeleteCartItem, IUserInfo } from '@/types/cart';

export const ScrollableCartList = ({
    footerOpen,
    bottomHeight,
    minHeight,
    user,
    cartInfo
}: {
    footerOpen: boolean;
    bottomHeight: number;
    minHeight: string;
    user: IUserInfo;
    cartInfo: any;
}) => {
    const [cartItems] = useAtom(cartItemsAtom);
    const [isScrollable, setIsScrollable] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const { fontSize, iconSize, chipSize } = useResponsiveConfig('cart');

    const removeItem = async (cafeCartId: string) => {
        if (!user) return;
        await deleteCartItem({ cafeCartId, user } as IDeleteCartItem);
    };

    useEffect(() => {
        const el = scrollRef.current;
        if (el) {
            setIsScrollable(el.scrollHeight > window.innerHeight);
        }
    }, [cartItems.length, footerOpen]);

    return (
        <StyledScrollableCartList
            ref={scrollRef}
            bottomHeight={bottomHeight}
            footerOpen={footerOpen}
            isScrollable={isScrollable}
            isEmpty={cartItems.length === 0}
        >
            {cartItems.length === 0 ? (
                <Box
                    sx={{
                        minHeight,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
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

                                <Box
                                    display="flex"
                                    flexDirection="column"
                                    justifyContent="space-between"
                                    flex={1}
                                    ml={{ xs: 1.5, md: 2 }}
                                >
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
                                        {item.createdById === user.uuid && cartInfo?.status !== 'INACTIVE' && (
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
                                        <PriceTypography>{item.drinkTotalPrice.toLocaleString()} 원</PriceTypography>
                                    </Box>
                                </Box>
                            </Box>
                        </CartItemContent>
                    </CartItemCard>
                ))
            )}
        </StyledScrollableCartList>
    );
};
