'use client';

import { Accordion, AccordionDetails, AccordionSummary, Box, Chip, Typography } from '@mui/material';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { CafeCartItem, GroupedCafeData, GroupedCafeItem } from '@/types/cart';
import { CafeMenuBadge, MenuCount, MenuImageContainer } from '@/styles/cart/cart.styles';
import { useMaxWidthByViewport, useResponsive } from '@/utils/hook';
import { COLORS_DARK } from '@/data';
import { Company, DrinkCategory, drinkSortOrder, ICommonModalTypes, titleMap } from '@/types/common';
import { CommonModal } from '@/components/page/cafe/modal/common-modal';
import { EllipsisTooltipWithChip } from '@/components/common/EllipsisTooltipWithChip';
import { CardImage } from '@/components/common/CardImage';
import { ExpandMore } from '@mui/icons-material';
import { EllipsisTooltip } from '@/components/common/EllipsisTooltip';

interface CafeSummaryModalProps extends ICommonModalTypes {
    cartItems: CafeCartItem[];
    cafeLocation: string;
}

export function CafeSummaryModal({ open, cafeLocation, onClose, cartItems }: CafeSummaryModalProps) {
    const { isMobile, isSmUp } = useResponsive();

    const [forceTooltipList, setForceTooltipList] = useState<boolean[][]>([]);
    const textBoxRefs = useRef<(HTMLDivElement | null)[][]>([]);
    const menuCountRefs = useRef<(HTMLDivElement | null)[][]>([]);

    useEffect(() => {
        const updateForceTooltip = () => {
            const newForceTooltipList = categorizedGroupMenuList.map((category, categoryIndex) =>
                category.items.map((_: GroupedCafeItem, itemIndex: number) => {
                    const textBox = textBoxRefs.current?.[categoryIndex]?.[itemIndex];
                    const menuCount = menuCountRefs.current?.[categoryIndex]?.[itemIndex];

                    if (textBox && menuCount) {
                        const textBoxRect = textBox.getBoundingClientRect();
                        const menuCountRect = menuCount.getBoundingClientRect();
                        const distance = menuCountRect.left - textBoxRect.right;
                        return distance <= 16;
                    }
                    return false;
                })
            );

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
                    items: [] as CafeCartItem[],
                    drinkCategory: item.drinkCategory
                };
            }
            acc[key].items.push(item);
            acc[key].totalQuantity += item.quantity;
            acc[key].totalPrice += item.drinkTotalPrice;
            return acc;
        }, {} as GroupedCafeData);

        return Object.values(grouped);
    }, [cartItems]);

    const categorizedGroupMenuList = useMemo(() => {
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
                    items: [] as CafeCartItem[],
                    drinkCategory: item.drinkCategory
                };
            }
            acc[key].items.push(item);
            acc[key].totalQuantity += item.quantity;
            acc[key].totalPrice += item.drinkTotalPrice;
            return acc;
        }, {} as GroupedCafeData);

        const createGroupKey = (group: GroupedCafeItem) => {
            const { drinkTemperature, drinkCategory } = group;
            if (drinkCategory === DrinkCategory.SEASON && cafeLocation === Company.EULJI) return 'SEASON';
            if (['COFFEE', 'TEA', 'DRINK'].includes(drinkCategory)) {
                return `${drinkTemperature}_${drinkCategory}`;
            }
            return 'UNKNOWN';
        };

        const categorized: Record<
            string,
            {
                title: string;
                items: any;
                totalPrice: number;
                totalQuantity: number;
            }
        > = {};

        Object.values(grouped).forEach(group => {
            const groupKey = createGroupKey(group);
            if (!categorized[groupKey]) {
                categorized[groupKey] = { title: titleMap[groupKey], items: [], totalQuantity: 0, totalPrice: 0 };
            }
            categorized[groupKey].items.push(group);
            categorized[groupKey].totalQuantity += group.totalQuantity;
            categorized[groupKey].totalPrice += group.totalPrice;
        });

        return drinkSortOrder.filter(key => categorized[key]).map(key => categorized[key]);
    }, [cartItems]);

    console.log(categorizedGroupMenuList);

    const getTempAndCategory = (title: string) => {
        if (title === '시즌음료') {
            return { temp: 'SEASON', category: '시즌음료' };
        }

        console.log(title);

        const [tempRaw, category] = title.split(' ');
        const temp = tempRaw === 'HOT' ? 'HOT' : 'ICED';
        return { temp, category };
    };

    return (
        <CommonModal
            open={open}
            onClose={onClose}
            title={'주문 모아보기'}
            content={
                <>
                    {categorizedGroupMenuList.map(({ title, items }, categoryIndex: number) => {
                        return (
                            <Accordion
                                defaultExpanded
                                key={title}
                                disableGutters
                                slotProps={{ heading: { component: 'div' } }}
                            >
                                <AccordionSummary
                                    expandIcon={<ExpandMore />}
                                    sx={{
                                        '& .MuiAccordionSummary-content.Mui-expanded': {
                                            margin: '1rem 0 0 0'
                                        }
                                    }}
                                >
                                    <Box justifyContent={'left'} display={'flex'} alignItems={'center'} sx={{ mb: 1 }}>
                                        <CafeMenuBadge
                                            type={getTempAndCategory(title).temp as 'HOT' | 'ICED'}
                                            label={
                                                getTempAndCategory(title).temp === 'ICED'
                                                    ? 'ICE'
                                                    : getTempAndCategory(title).temp
                                            }
                                            height={isSmUp ? '1.3rem' : '1.2rem'}
                                            sx={{ mr: '8px' }}
                                        />
                                        <Typography fontSize={isSmUp ? '1.15rem' : '1.05rem'}>
                                            {getTempAndCategory(title).category ?? ''}
                                        </Typography>
                                    </Box>
                                </AccordionSummary>
                                <AccordionDetails sx={{ padding: '0px 16px' }}>
                                    {items.map((group: GroupedCafeItem, index: number) => {
                                        return (
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
                                                    mb: index !== groupedMenuList.length - 1 ? '13px' : 0
                                                }}
                                            >
                                                <Box display="flex" alignItems="center" sx={{ overflow: 'hidden' }}>
                                                    <MenuImageContainer>
                                                        <CardImage
                                                            width="100%"
                                                            height="100%"
                                                            imageUrl={group.drinkImageUrl}
                                                            alt={group.drinkName}
                                                            blur={group.items.some(g => !g.available)}
                                                            size={'xs'}
                                                        />
                                                    </MenuImageContainer>
                                                    <Box
                                                        display="flex"
                                                        alignItems="center"
                                                        gap={0.5}
                                                        ref={(el: HTMLDivElement | null) => {
                                                            if (!textBoxRefs.current[categoryIndex]) {
                                                                textBoxRefs.current[categoryIndex] = [];
                                                            }
                                                            textBoxRefs.current[categoryIndex][index] = el;
                                                        }}
                                                    >
                                                        <EllipsisTooltip title={group.drinkName}>
                                                            {group.drinkName}
                                                        </EllipsisTooltip>
                                                        {/*<EllipsisTooltipWithChip*/}
                                                        {/*    title={group.drinkName}*/}
                                                        {/*    forceTooltip={*/}
                                                        {/*        forceTooltipList[categoryIndex]?.[index] ?? false*/}
                                                        {/*    }*/}
                                                        {/*    // forceTooltip={forceTooltipList[index] ?? false}*/}
                                                        {/*    customMaxWidthKey={'cart-summary'}*/}
                                                        {/*    withIcon*/}
                                                        {/*>*/}
                                                        {/*    <>{group.drinkName}</>*/}
                                                        {/*</EllipsisTooltipWithChip>*/}
                                                        <Box
                                                            component="span"
                                                            sx={{
                                                                display: 'inline-flex',
                                                                alignItems: 'center',
                                                                marginLeft: 0.5
                                                            }}
                                                        >
                                                            {/*<Chip*/}
                                                            {/*    label={group.drinkTemperature}*/}
                                                            {/*    size="small"*/}
                                                            {/*    sx={{*/}
                                                            {/*        backgroundColor:*/}
                                                            {/*            group.drinkTemperature === 'HOT'*/}
                                                            {/*                ? '#F87171'*/}
                                                            {/*                : '#60A5FA',*/}
                                                            {/*        color: '#fff',*/}
                                                            {/*        fontSize: '0.6rem',*/}
                                                            {/*        height: fontSize,*/}
                                                            {/*        borderRadius: '4px'*/}
                                                            {/*    }}*/}
                                                            {/*/>*/}
                                                        </Box>
                                                    </Box>
                                                </Box>

                                                <MenuCount
                                                    sx={{ height: isMobile ? 22 : 30, width: isMobile ? 20 : 24 }}
                                                    ref={(el: HTMLDivElement | null) => {
                                                        if (!menuCountRefs.current[categoryIndex]) {
                                                            menuCountRefs.current[categoryIndex] = [];
                                                        }
                                                        menuCountRefs.current[categoryIndex][index] = el;
                                                    }}
                                                    inactive={group.items.some(g => !g.available)}
                                                >
                                                    {group.totalQuantity}
                                                </MenuCount>
                                            </Box>
                                        );
                                    })}
                                </AccordionDetails>
                            </Accordion>
                        );
                    })}
                </>
            }
            fixedContent={
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px 16px',
                        backgroundColor: COLORS_DARK.theme.purple,
                        borderRadius: '12px',
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
            }
            fixedContentPosition={'top'}
        />
    );
}
