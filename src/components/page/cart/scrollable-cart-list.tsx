import { cartItemsAtom } from '@/atom/cart-atom';
import { useAtom } from 'jotai';
import React, { useEffect, useRef, useState } from 'react';
import {
    CartItemCard,
    CartItemContent,
    ConfirmTemperatureBadge,
    ItemImage,
    PriceTypography,
    QuantityTypography,
    ShoppingCartIcon,
    StyledScrollableCartList,
    UserAvatar
} from '@/styles/cart/cart.styles';
import { Box, CardMedia, Typography } from '@mui/material';
import { COLORS_DARK } from '@/data';
import { Trash2 } from 'lucide-react';
import { getUserInitial, useResponsive, useResponsiveConfig } from '@/utils/hook';
import { deleteCartItem } from '@/apis/cafe/cafe-api';
import { IDeleteCartItem, IUserInfo } from '@/types/cart';
import { EllipsisTooltip } from '@/components/common/EllipsisTooltip';
import { EllipsisTooltipWithChip } from '@/components/common/EllipsisTooltipWithChip';

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
    const { isLg, isSmall } = useResponsive();
    const { iconSize, chipSize, cartImgWidthAndHeight } = useResponsiveConfig('cart');

    const [forceTooltipList, setForceTooltipList] = useState<boolean[]>([]);
    const textBoxRefs = useRef<(HTMLDivElement | null)[]>([]);
    const trashIconRefs = useRef<(HTMLDivElement | null)[]>([]);

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

    useEffect(() => {
        const updateForceTooltip = () => {
            const newForceTooltipList = cartItems.map((_, index) => {
                const textBox = textBoxRefs.current[index];
                const trashIconBox = trashIconRefs.current[index];
                if (textBox && trashIconBox) {
                    const textBoxRect = textBox.getBoundingClientRect();
                    const trashIconBoxRect = trashIconBox.getBoundingClientRect();

                    const distance = trashIconBoxRect.left - textBoxRect.right;
                    const isOverflowed = textBox.scrollWidth > textBox.clientWidth;
                    console.log(`Index ${index} | Distance: ${distance}, Overflow: ${isOverflowed}`);

                    return distance <= 8 || isOverflowed;
                }
                return false;
            });

            setForceTooltipList(newForceTooltipList);
        };

        const handleResize = () => {
            requestAnimationFrame(updateForceTooltip);
        };

        window.addEventListener('resize', handleResize);
        updateForceTooltip();

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [cartItems]);

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
                cartItems.map((item, index) => (
                    <CartItemCard key={item.id}>
                        <CartItemContent>
                            <Box display="flex" alignItems="stretch" justifyContent={'space-between'}>
                                {/* 이미지 */}
                                <ItemImage width={cartImgWidthAndHeight} height={cartImgWidthAndHeight}>
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
                                        <Box
                                            display="flex"
                                            alignItems="center"
                                            gap={!isSmall ? '10px' : 1}
                                            ref={(el: HTMLDivElement | null) => {
                                                textBoxRefs.current[index] = el;
                                            }}
                                        >
                                            <EllipsisTooltipWithChip
                                                title={item.drinkName}
                                                forceTooltip={forceTooltipList[index] ?? false}
                                                style={{
                                                    fontSize: '1rem',
                                                    fontWeight: 500
                                                }}
                                                withIcon={
                                                    item.createdById === user.uuid && cartInfo?.status !== 'INACTIVE'
                                                }
                                                customMaxWidthKey={'cart-items'}
                                            >
                                                <>{item.drinkName}</>
                                            </EllipsisTooltipWithChip>

                                            {item.drinkTemperature && (
                                                <ConfirmTemperatureBadge
                                                    temperature={item.drinkTemperature}
                                                    label={item.drinkTemperature}
                                                    height={chipSize}
                                                />
                                            )}
                                        </Box>
                                        {item.createdById === user.uuid && cartInfo?.status !== 'INACTIVE' && (
                                            <Box
                                                ref={(el: HTMLDivElement | null) => {
                                                    trashIconRefs.current[index] = el;
                                                }}
                                                sx={{
                                                    position: 'relative',
                                                    right: 0,
                                                    marginTop: '3px',
                                                    color: COLORS_DARK.text.secondary
                                                }}
                                                onClick={() => removeItem(item.id)}
                                            >
                                                <Trash2 size={iconSize} />
                                            </Box>
                                        )}
                                    </Box>

                                    {/* 작성자 */}
                                    <Box
                                        display="flex"
                                        alignItems="center"
                                        mt={isLg ? '6px' : '4px'}
                                        maxWidth={`calc(100% - ${(iconSize as number) / 2}px)`}
                                    >
                                        <UserAvatar src={item.imageUrl} alt={item.createdByName}>
                                            {getUserInitial(item.createdByName)}
                                        </UserAvatar>
                                        <EllipsisTooltip title={item.createdByName}>
                                            <Typography fontSize={'0.95rem'}>{item.createdByName}</Typography>
                                        </EllipsisTooltip>
                                    </Box>

                                    <Box
                                        display="flex"
                                        justifyContent="space-between"
                                        alignItems="flex-end"
                                        width="100%"
                                        mt={{ xs: '10px', sm: '12px', md: '12px', lg: '14px', xl: '16px' }}
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
