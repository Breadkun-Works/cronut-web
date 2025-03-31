'use client';

import { Box, Button, CardActionArea, CardContent, Dialog, DialogContent, Typography } from '@mui/material';
import Grid2 from '@mui/material/Grid2'; // Grid2 올바르게 import
import { CafeMenuData, COLORS_DARK } from '@/data';
import React, { useEffect, useRef, useState } from 'react';
import { useGetCafeMenuInfinite } from '@/apis/cafe/cafe-api';
import { DrinkCategory } from '@/types/common';
import { useCompanyContext } from '@/context/CompanyContext';
import {
    StyledCard,
    StyledCardMedia,
    StyledMenuContainer,
    StyledMenuTab,
    StyledMenuTabs,
    StyledMenuTitle,
    TabIcon,
    TemperatureChip
} from '@/styles/cart/cart.styles';
import { Coffee, Leaf, Wine } from 'lucide-react';
import { MenuPopover } from '@/components/page/cafe/menu/menu-popover';
import { useRouter } from 'next/navigation';
import { ICafeMenuOption } from '@/types/cart';

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

const CafeMenuTabPanel = ({ children, value, index, ...other }: any) => {
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
};

const CafeMenu = ({ entry, cartId }: { entry?: string; cartId?: string }) => {
    const [tabValue, setTabValue] = useState(0);

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
    const router = useRouter();

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
                console.log(containerWidth);

                if (isSmartphone) {
                    setDialogWidth(window.innerWidth);
                } else {
                    // 그 외엔 1/2 너비
                    setDialogWidth(containerWidth * (3 / 4));
                }
            }
        };

        handleResize();

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [open]);

    const getTemperatureChip = (option: Array<ICafeMenuOption>) => {
        if (option.length === 2) return null;

        return option.length === 1 && option[0].drinkTemperature === 'ICED' ? (
            <TemperatureChip
                label="ICE ONLY"
                color="primary"
                size="small"
                sx={{ bgcolor: '#2196f3', color: 'white' }}
            />
        ) : (
            <TemperatureChip
                label="HOT ONLY"
                color="secondary"
                size="small"
                sx={{ bgcolor: '#f44336', color: 'white' }}
            />
        );
    };

    return (
        <StyledMenuContainer maxWidth="lg" sx={{ paddingTop: entry && '20px' }}>
            {!entry && <StyledMenuTitle>카페 메뉴</StyledMenuTitle>}

            <StyledMenuTabs value={tabValue} onChange={handleTabChange} centered aria-label="cafe menu tabs">
                {CafeMenuData.map((cafeMenu, cafeMenuIdx) => (
                    <StyledMenuTab
                        key={cafeMenu.index}
                        icon={
                            <TabIcon>{returnIcon(DrinkCategory[cafeMenu.value as keyof typeof DrinkCategory])}</TabIcon>
                        }
                        label={cafeMenu.name}
                    />
                ))}
            </StyledMenuTabs>
            {CafeMenuData.map(cafeMenu => {
                return (
                    <CafeMenuTabPanel key={cafeMenu.index} value={tabValue} index={cafeMenu.index}>
                        <Box component={'div'} ref={containerRef}>
                            {data?.pages?.[0]?.records && data?.pages?.[0]?.records?.length > 0 ? (
                                <>
                                    <Grid2 container spacing={3} key={cafeMenu.index}>
                                        {data?.pages?.map(page => {
                                            return page.records.map((record, idx) => {
                                                return (
                                                    <>
                                                        <Grid2
                                                            size={{ xs: 6, md: 4 }}
                                                            key={`menu_${idx}`}
                                                            component={'div'}
                                                            ref={loadMoreRef}
                                                        >
                                                            <StyledCard>
                                                                <CardActionArea
                                                                    onClick={() => handleCardClick(record.name)}
                                                                >
                                                                    <Box sx={{ position: 'relative' }}>
                                                                        {getTemperatureChip(record.options)}
                                                                        <StyledCardMedia
                                                                            image={
                                                                                'https://img.freepik.com/free-photo/iced-cola-tall-glass_1101-740.jpg'
                                                                            }
                                                                            sx={{ backgroundSize: 'contain' }}
                                                                            title={record.name}
                                                                        />
                                                                    </Box>
                                                                    <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
                                                                        <Box
                                                                            sx={{
                                                                                display: 'flex',
                                                                                flexDirection: 'column',
                                                                                gap: '8px',
                                                                                width: '100%',
                                                                                alignItems: 'center',
                                                                                textAlign: 'center'
                                                                            }}
                                                                        >
                                                                            <Typography
                                                                                variant="body1"
                                                                                sx={{
                                                                                    fontWeight: 'medium',
                                                                                    textAlign: 'center',
                                                                                    width: '100%'
                                                                                }}
                                                                            >
                                                                                {record.name}
                                                                            </Typography>
                                                                            <Typography
                                                                                variant="body1"
                                                                                sx={{
                                                                                    textAlign: 'center',
                                                                                    width: '100%'
                                                                                }}
                                                                            >
                                                                                {record.options[0].price.toLocaleString()}
                                                                                원
                                                                            </Typography>
                                                                        </Box>
                                                                    </CardContent>
                                                                </CardActionArea>
                                                            </StyledCard>
                                                        </Grid2>
                                                        {entry && openDialog && selectedMenu === record.name && (
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
                                                    </>
                                                );
                                            });
                                        })}
                                    </Grid2>
                                    {!hasNextPage && (
                                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                                            <p>마지막 페이지입니다.</p>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <></>
                            )}
                        </Box>
                    </CafeMenuTabPanel>
                );
            })}
        </StyledMenuContainer>
    );
};

export default CafeMenu;
