'use client';

import {
    Box,
    Typography,
    Chip,
    Button,
    Tooltip,
    ClickAwayListener,
    Backdrop,
    IconButton,
    useMediaQuery,
    useTheme
} from '@mui/material';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { CafeCartItem, GroupedCafeData } from '@/types/cart';
import { MenuCount, MenuImageContainer } from '@/styles/cart/cart.styles';
import { useResponsive, useMaxWidthByViewport } from '@/utils/hook';
import { COLORS_DARK } from '@/data';
import { ICommonModalTypes } from '@/types/common';
import { CommonModal } from '@/components/page/cafe/modal/common-modal';

interface CafeSummaryModalProps extends ICommonModalTypes {
    cartItems: CafeCartItem[];
}

interface EllipsisSummaryTooltipProps {
    title: string;
    children: React.ReactElement;
    forceTooltip: boolean;
}

const EllipsisSummaryTooltip = ({ title, children, forceTooltip = false }: EllipsisSummaryTooltipProps) => {
    const textRef = useRef<HTMLElement>(null);
    const [isOverflowed, setIsOverflowed] = useState(false);
    const [open, setOpen] = useState(false);
    const { isMobile } = useResponsive();
    const { fontSize } = useMaxWidthByViewport();
    const theme = useTheme();
    const isUnder350 = useMediaQuery(theme.breakpoints.down(350));

    useEffect(() => {
        const el = textRef.current;
        if (el) {
            setIsOverflowed(el.scrollWidth > el.clientWidth);
        }
    }, [children]);

    const shouldShowTooltip = forceTooltip || isOverflowed;

    const textStyle = shouldShowTooltip
        ? {
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: isUnder350 ? '65%' : '70%',
              fontSize
          }
        : { fontSize };

    if (shouldShowTooltip) {
        if (isMobile) {
            return (
                <ClickAwayListener onClickAway={() => setOpen(false)}>
                    <Tooltip
                        title={title}
                        open={open}
                        placement="top"
                        arrow
                        disableHoverListener
                        disableFocusListener
                        disableTouchListener
                    >
                        <span
                            ref={textRef}
                            onClick={() => setOpen(true)}
                            style={{ display: 'inline-block', cursor: 'pointer', ...textStyle }}
                        >
                            {children}
                        </span>
                    </Tooltip>
                </ClickAwayListener>
            );
        }

        return (
            <Tooltip title={title} placement="top" arrow>
                <span ref={textRef} style={{ display: 'inline-block', ...textStyle }}>
                    {children}
                </span>
            </Tooltip>
        );
    }

    // 툴팁이 비활성화된 경우 - 일반 텍스트
    return (
        <span ref={textRef} style={{ display: 'inline-block', ...textStyle }}>
            {children}
        </span>
    );
};

export function CafeSummaryModal({ open, onClose, cartItems }: CafeSummaryModalProps) {
    const { isMobile } = useResponsive();
    const { fontSize } = useMaxWidthByViewport();

    const [forceTooltipList, setForceTooltipList] = useState<boolean[]>([]);
    const textBoxRefs = useRef<(HTMLDivElement | null)[]>([]);
    const menuCountRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const updateForceTooltip = () => {
            const newForceTooltipList = groupedMenuList.map((_, index) => {
                const textBox = textBoxRefs.current[index];
                const menuCount = menuCountRefs.current[index];
                if (textBox && menuCount) {
                    const textBoxRect = textBox.getBoundingClientRect();
                    const menuCountRect = menuCount.getBoundingClientRect();
                    const distance = menuCountRect.left - textBoxRect.right;
                    // console.log(`Distance for index ${index}:`, distance);
                    return distance <= 16;
                }
                return false;
            });

            setForceTooltipList(newForceTooltipList);
        };

        window.addEventListener('resize', updateForceTooltip);
        updateForceTooltip();

        return () => {
            window.removeEventListener('resize', updateForceTooltip);
        };
    }, [cartItems]);

    const groupedMenuList = useMemo(() => {
        const grouped = cartItems.reduce((acc, item) => {
            const key = `${item.cafeMenuId}_${item.drinkTemperature}`;
            if (!acc[key]) {
                acc[key] = {
                    cafeMenuId: item.cafeMenuId,
                    drinkName: item.drinkName,
                    drinkImageUrl: item.drinkImageUrl,
                    drinkTemperature: item.drinkTemperature,
                    totalQuantity: 0,
                    totalPrice: 0,
                    items: [] as CafeCartItem[]
                };
            }
            acc[key].items.push(item);
            acc[key].totalQuantity += item.quantity;
            acc[key].totalPrice += item.drinkTotalPrice;
            return acc;
        }, {} as GroupedCafeData);

        return Object.values(grouped);
    }, [cartItems]);

    return (
        <CommonModal
            open={open}
            onClose={onClose}
            title={'주문 모아보기'}
            content={
                <>
                    {groupedMenuList.map((group, index) => (
                        <Box
                            key={`${group.cafeMenuId}_${group.drinkTemperature}`}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                backgroundColor: COLORS_DARK.background.lighter,
                                borderRadius: 2,
                                px: 1.5,
                                py: 1.2,
                                mb: index !== groupedMenuList.length - 1 ? 1.5 : 0
                            }}
                        >
                            <Box display="flex" alignItems="center" sx={{ overflow: 'hidden' }}>
                                <MenuImageContainer>
                                    <Box
                                        component="img"
                                        src={group.drinkImageUrl}
                                        alt={group.drinkName}
                                        sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                </MenuImageContainer>
                                <Box
                                    display="flex"
                                    alignItems="center"
                                    gap={0.5}
                                    ref={(el: HTMLDivElement | null) => {
                                        textBoxRefs.current[index] = el;
                                    }}
                                >
                                    <EllipsisSummaryTooltip
                                        title={group.drinkName}
                                        forceTooltip={forceTooltipList[index] ?? false}
                                    >
                                        {/*돌체돌체돌체돌체돌체돌체*/}
                                        <>{group.drinkName}</>
                                    </EllipsisSummaryTooltip>
                                    <Box
                                        component="span"
                                        sx={{ display: 'inline-flex', alignItems: 'center', marginLeft: 0.5 }}
                                    >
                                        <Chip
                                            label={group.drinkTemperature}
                                            size="small"
                                            sx={{
                                                backgroundColor:
                                                    group.drinkTemperature === 'HOT' ? '#F87171' : '#60A5FA',
                                                color: '#fff',
                                                fontSize: '0.6rem',
                                                height: fontSize,
                                                borderRadius: '4px'
                                            }}
                                        />
                                    </Box>
                                </Box>
                            </Box>

                            <MenuCount
                                sx={{ height: isMobile ? 22 : 30, width: isMobile ? 20 : 24 }}
                                ref={(el: HTMLDivElement | null) => {
                                    menuCountRefs.current[index] = el;
                                }}
                            >
                                {group.totalQuantity}
                            </MenuCount>
                        </Box>
                    ))}
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '12px 16px',
                            backgroundColor: COLORS_DARK.theme.purple,
                            borderRadius: '12px',
                            marginTop: '12px',
                            border: '1px solid rgba(255, 255, 255, 0.1)'
                        }}
                    >
                        <Typography fontSize={16} fontWeight="bold" color="white">
                            총 수량
                        </Typography>
                        <Typography fontSize={16} fontWeight="bold" color="white">
                            {groupedMenuList.reduce((total, item) => total + item.totalQuantity, 0)} 잔
                        </Typography>
                    </Box>
                </>
            }
        />
    );
}
