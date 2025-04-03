'use client';

import { Box, Button, CardActionArea, Dialog, DialogContent, Typography } from '@mui/material';
import { CafeMenuData, COLORS_DARK } from '@/data';
import React, { useEffect, useRef, useState } from 'react';
import { useGetCafeMenuInfinite } from '@/apis/cafe/cafe-api';
import { DrinkCategory } from '@/types/common';
import { useCompanyContext } from '@/context/CompanyContext';
import {
    CategoryTab,
    CategoryTabs,
    Header,
    MenuGrid,
    MenuImage,
    MenuItemCard,
    MenuItemContent,
    PageContainer,
    ScrollableContent,
    StyledCardMedia,
    TabIcon,
    TemperatureBadge
} from '@/styles/cart/cart.styles';
import { Coffee, Leaf, Wine } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ICafeMenuOption } from '@/types/cart';
import { CafeHeader } from '@/components/page/cafe/header';
import { MenuPopover } from '@/components/page/cafe/menu/menu-popover';

const returnIcon = (cafeMenu: DrinkCategory) => {
    switch (cafeMenu) {
        case DrinkCategory.COFFEE:
            return <Coffee />;

        case DrinkCategory.TEA:
            return <Leaf />;

        default:
            return <Wine />;
    }
};

const CafeMenuTabPanel = ({ children, value, index, isMobile, ...other }: any) => {
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (isMobile ? children : <Box sx={{ p: 3 }}>{children}</Box>)}
        </div>
    );
};

const CafeMenu = ({ entry, cartId, title }: { title: string; entry?: string; cartId?: string }) => {
    const [tabValue, setTabValue] = useState(0);
    const router = useRouter();

    const handleTabChange = (event: React.SyntheticEvent, newTabValue: number) => {
        const selectedCategory = CafeMenuData[newTabValue].value;
        setTabValue(newTabValue);
        setQuery({ ...query, category: selectedCategory });
    };

    const { company } = useCompanyContext();
    const [query, setQuery] = useState({ size: 12, category: DrinkCategory.COFFEE, name: '', cafeLocation: company });
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedMenu, setSelectedMenu] = useState('');
    const [moveToConfirm, setMoveToConfirm] = useState(false);

    const { data, hasNextPage, isFetchingNextPage, fetchNextPage } = useGetCafeMenuInfinite(query);

    const loadMoreRef = useRef<HTMLDivElement | null>(null);

    const containerRef = useRef<HTMLDivElement>(null);
    const [dialogWidth, setDialogWidth] = useState<number>(0);

    const isMobile = window.innerWidth <= 480;

    const handleCardClick = (name: string) => {
        setOpenDialog(!openDialog);
        setSelectedMenu(name);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    useEffect(() => {
        if (!loadMoreRef.current) return;

        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                    fetchNextPage();
                }
            },
            { threshold: 0.5 }
        );

        observer.observe(loadMoreRef.current);

        return () => observer.disconnect();
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    useEffect(() => {
        const handleResize = () => {
            if (containerRef.current) {
                const isSmartphone = window.innerWidth <= 480; // 스마트폰 기준 (480px 이하)
                const containerWidth = containerRef.current.offsetWidth;

                if (isSmartphone) {
                    setDialogWidth(window.innerWidth);
                } else {
                    // 그 외엔 1/2 너비
                    setDialogWidth(containerWidth * (3 / 4));
                }
            }
        };

        if (openDialog) {
            handleResize();
        }

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [openDialog]);

    const getTemperatureChip = (option: Array<ICafeMenuOption>) => {
        if (option.length === 2) return null;

        return (
            <TemperatureBadge
                temperature={option.length === 1 && option[0].drinkTemperature === 'ICED' ? 'ICED' : 'HOT'}
                label={option.length === 1 && option[0].drinkTemperature === 'ICED' ? 'ICE ONLY' : 'HOT ONLY'}
                size="small"
            />
        );
    };

    console.log(dialogWidth);

    return (
        <PageContainer ref={containerRef}>
            <Header>
                <CafeHeader entry={entry} title={title} cartId={cartId} />
                <CategoryTabs value={tabValue} onChange={handleTabChange} centered>
                    {CafeMenuData.map((cafeMenu, cafeMenuIdx) => (
                        <CategoryTab
                            key={cafeMenu.index}
                            icon={
                                <TabIcon>
                                    {returnIcon(DrinkCategory[cafeMenu.value as keyof typeof DrinkCategory])}
                                </TabIcon>
                            }
                            label={cafeMenu.name}
                        />
                    ))}
                </CategoryTabs>
            </Header>
            <ScrollableContent className={isMobile ? 'mobile' : ''}>
                {CafeMenuData.map(cafeMenu => {
                    return (
                        <CafeMenuTabPanel
                            key={cafeMenu.index}
                            value={tabValue}
                            index={cafeMenu.index}
                            isMobile={isMobile}
                        >
                            <Box ref={loadMoreRef} component="div" key={cafeMenu.index}>
                                <MenuGrid>
                                    {data?.pages?.map(page => {
                                        return page.records.map((record, idx, idex) => {
                                            return (
                                                <>
                                                    <MenuItemCard key={`menu_${idx}`}>
                                                        <CardActionArea onClick={() => handleCardClick(record.name)}>
                                                            <MenuItemContent>
                                                                <Box position="relative" width="100%">
                                                                    <MenuImage>
                                                                        {getTemperatureChip(record.options)}
                                                                        <StyledCardMedia
                                                                            image={
                                                                                'https://img.freepik.com/free-photo/iced-cola-tall-glass_1101-740.jpg'
                                                                            }
                                                                            sx={{ backgroundSize: 'contain' }}
                                                                            title={record.name}
                                                                        />
                                                                    </MenuImage>
                                                                </Box>

                                                                <Typography
                                                                    variant="subtitle2"
                                                                    fontWeight="bold"
                                                                    sx={{
                                                                        mt: 1,
                                                                        textAlign: 'center',
                                                                        overflow: 'hidden',
                                                                        textOverflow: 'ellipsis',
                                                                        whiteSpace: 'nowrap'
                                                                    }}
                                                                >
                                                                    {record.name}
                                                                </Typography>
                                                                <Typography
                                                                    variant="body2"
                                                                    fontWeight="medium"
                                                                    sx={{
                                                                        color: COLORS_DARK.accent.main,
                                                                        textAlign: 'center',
                                                                        mt: 0.5
                                                                    }}
                                                                >
                                                                    {record.options[0].price.toLocaleString()}원
                                                                </Typography>
                                                            </MenuItemContent>
                                                        </CardActionArea>
                                                    </MenuItemCard>
                                                    {entry !== 'menu' && openDialog && selectedMenu === record.name && (
                                                        <MenuPopover
                                                            width={dialogWidth}
                                                            open={openDialog}
                                                            onClose={handleCloseDialog}
                                                            popoverProps={{
                                                                menuName: record.name,
                                                                options: record.options
                                                            }}
                                                            cartId={cartId}
                                                            onSuccess={() => {
                                                                setMoveToConfirm(true);
                                                            }}
                                                        />
                                                    )}
                                                </>
                                            );
                                        });
                                    })}
                                </MenuGrid>
                                {moveToConfirm && (
                                    <Dialog open={moveToConfirm}>
                                        <DialogContent
                                            sx={{
                                                color: COLORS_DARK.text.primary,
                                                padding: '24px'
                                            }}
                                        >
                                            <Typography variant={'body1'}>
                                                상품을 장바구니에 담았습니다.
                                                <br /> 장바구니로 이동하시겠습니까?
                                            </Typography>
                                        </DialogContent>
                                        <Button
                                            onClick={() => {
                                                setMoveToConfirm(false);
                                            }}
                                        >
                                            취소
                                        </Button>
                                        <Button
                                            onClick={() => {
                                                router.push(`/cafe/cart/confirm/${cartId}`);
                                            }}
                                        >
                                            확인
                                        </Button>
                                    </Dialog>
                                )}
                                {!hasNextPage && (
                                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                                        <p>끝~</p>
                                    </div>
                                )}
                            </Box>
                        </CafeMenuTabPanel>
                    );
                })}
            </ScrollableContent>
        </PageContainer>
    );
};

export default CafeMenu;
