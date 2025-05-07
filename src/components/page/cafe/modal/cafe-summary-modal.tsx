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
import { X } from 'lucide-react';
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
}

const EllipsisSummaryTooltip = ({ title, children }: EllipsisSummaryTooltipProps) => {
    const textRef = useRef<HTMLElement>(null);
    const [isOverflowed, setIsOverflowed] = useState(false);
    const [open, setOpen] = useState(false);
    const { isMobile } = useResponsive();

    useEffect(() => {
        const el = textRef.current;
        if (el) {
            setIsOverflowed(el.scrollWidth > el.clientWidth);
        }
    }, [children]);

    if (!isOverflowed) {
        // 그냥 자식만 렌더링
        return <>{React.cloneElement(children, { ref: textRef })}</>;
    }

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
                        style={{ display: 'inline-block', cursor: 'pointer' }}
                    >
                        {children}
                    </span>
                </Tooltip>
            </ClickAwayListener>
        );
    }

    return (
        <Tooltip title={title} placement="top" arrow>
            <span ref={textRef} style={{ display: 'inline-block' }}>
                {children}
            </span>
        </Tooltip>
    );
};

export function CafeSummaryModal({ open, onClose, cartItems }: CafeSummaryModalProps) {
    const { isMobile } = useResponsive();
    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.between('xs', 'sm')); // <360
    const isMd = useMediaQuery(theme.breakpoints.between('sm', 'md')); // 360 ~ 479
    const { maxWidth, fontSize } = useMaxWidthByViewport();

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
            title={'메뉴 요약보기'}
            content={
                <Box
                    sx={{
                        px: 2,
                        pt: 2,
                        pb: 1,
                        overflowY: 'auto',
                        flex: 1,
                        '&::-webkit-scrollbar': {
                            width: '4px' // 얇게
                        },
                        '&::-webkit-scrollbar-track': {
                            backgroundColor: 'transparent'
                        },
                        '&::-webkit-scrollbar-thumb': {
                            backgroundColor: 'rgba(255, 255, 255, 0.15)',
                            borderRadius: '4px'
                        },
                        scrollbarWidth: 'thin',
                        scrollbarColor: 'rgba(255,255,255,0.15) transparent'
                    }}
                >
                    {groupedMenuList.map(group => (
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
                                mb: 1.5
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
                                <Box display="flex" alignItems="center" gap={0.5}>
                                    <EllipsisSummaryTooltip title={group.drinkName}>
                                        <Typography
                                            maxWidth={maxWidth}
                                            fontSize={fontSize}
                                            sx={{
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis'
                                            }}
                                        >
                                            {/*돌체돌체돌체돌체돌체돌체*/}
                                            {group.drinkName}
                                        </Typography>
                                    </EllipsisSummaryTooltip>
                                    <Box component="span" sx={{ display: 'inline-flex', marginLeft: 0.5 }}>
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

                            <MenuCount sx={{ height: isMobile ? 25 : 30, width: isMobile ? 20 : 24 }}>
                                {group.totalQuantity}
                            </MenuCount>
                        </Box>
                    ))}
                </Box>
            }
        />
    );
}
