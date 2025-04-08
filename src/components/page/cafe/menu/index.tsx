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
    HeaderContent,
    MenuCardMedia,
    MenuGrid,
    MenuImage,
    MenuItemCard,
    MenuItemContent,
    PageContainer,
    ScrollableContent,
    StyledMenuTitle,
    TabIcon,
    TemperatureBadge
} from '@/styles/cart/cart.styles';
import { Coffee, Leaf, Wine } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ICafeMenuOption } from '@/types/cart';
import { CafeHeader } from '@/components/page/cafe/header';
import { MenuPopover } from '@/components/page/cafe/menu/menu-popover';

const isMobile = typeof window !== 'undefined' && window.screen.availWidth <= 480;

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

const CafeMenuTabPanel = ({ children, value, index, isMobile }: any) => {
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
        >
            {value === index && (isMobile ? children : <Box sx={{ p: 3 }}>{children}</Box>)}
        </div>
    );
};

const CafeMenu = ({ entry, cartId, title }: { title: string; entry?: string; cartId?: string }) => {
    const [tabValue, setTabValue] = useState(0);
    const { company } = useCompanyContext();

    const [openDialog, setOpenDialog] = useState(false);
    const [selectedMenu, setSelectedMenu] = useState('');
    const [moveToConfirm, setMoveToConfirm] = useState(false);

    const router = useRouter();
    const containerRef = useRef<HTMLDivElement>(null);
    const loadMoreRef = useRef<HTMLDivElement | null>(null);
    const [dialogWidth, setDialogWidth] = useState<number>(0);

    const [query, setQuery] = useState({
        size: 12,
        category: DrinkCategory.COFFEE,
        name: '',
        cafeLocation: company
    });

    const { data, hasNextPage, isFetchingNextPage, fetchNextPage, isFetched } = useGetCafeMenuInfinite(query);

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
                const containerWidth = containerRef.current.offsetWidth;
                setDialogWidth(isMobile ? window.innerWidth : containerWidth * (3 / 4));
            }
        };

        if (openDialog) handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [openDialog]);

    // 회사 바뀌면 일부 필드 초기화
    useEffect(() => {
        setQuery(prev => ({
            ...prev,
            cafeLocation: company,
            category: DrinkCategory.COFFEE // 초기화
        }));
        setTabValue(0);
    }, [company]);

    const handleTabChange = (event: React.SyntheticEvent, newTabValue: number) => {
        const selectedCategory = CafeMenuData[newTabValue].value;
        setTabValue(newTabValue);
        setQuery(prev => ({ ...prev, category: selectedCategory }));
    };

    const handleCardClick = (name: string) => {
        setOpenDialog(true);
        setSelectedMenu(name);
    };

    const handleCloseDialog = () => setOpenDialog(false);

    const getTemperatureChip = (option: Array<ICafeMenuOption>) => {
        if (option.length === 2) return null;

        const isIced = option.length === 1 && option[0].drinkTemperature === 'ICED';
        return (
            <TemperatureBadge
                temperature={isIced ? 'ICED' : 'HOT'}
                label={isIced ? 'ICE ONLY' : 'HOT ONLY'}
                size="small"
            />
        );
    };

    const MenuItem = ({ record, onClick, entry }: any) => {
        // 공통 컨텐츠
        const content = (
            <MenuItemContent>
                <Box position="relative" width="100%">
                    <MenuImage>
                        {getTemperatureChip(record.options)}
                        <MenuCardMedia
                            isMenu={entry === 'menu'}
                            image={'https://img.freepik.com/free-photo/iced-cola-tall-glass_1101-740.jpg'}
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
                    sx={{ color: COLORS_DARK.accent.main, textAlign: 'center', mt: 0.5 }}
                >
                    {record.options[0].price.toLocaleString()}원
                </Typography>
            </MenuItemContent>
        );

        return entry === 'menu' ? content : <CardActionArea onClick={onClick}>{content}</CardActionArea>;
    };

    return (
        <>
            <CafeHeader entry={entry} cartId={cartId} />
            <PageContainer ref={containerRef}>
                <Header>
                    <HeaderContent>
                        <StyledMenuTitle>{title}</StyledMenuTitle>
                    </HeaderContent>
                    <CategoryTabs value={tabValue} onChange={handleTabChange} centered>
                        {CafeMenuData.map(cafeMenu => (
                            <CategoryTab
                                key={cafeMenu.index}
                                icon={<TabIcon>{returnIcon(cafeMenu.value)}</TabIcon>}
                                label={cafeMenu.name}
                            />
                        ))}
                    </CategoryTabs>
                </Header>

                <ScrollableContent className={isMobile ? 'mobile' : ''}>
                    {CafeMenuData.map(cafeMenu => (
                        <CafeMenuTabPanel
                            key={cafeMenu.index}
                            value={tabValue}
                            index={cafeMenu.index}
                            isMobile={isMobile}
                        >
                            <Box ref={loadMoreRef} component="div">
                                <MenuGrid>
                                    {data?.pages?.map(page =>
                                        page.records.map((record, idx) => (
                                            <React.Fragment key={`menu_${idx}`}>
                                                <MenuItemCard isMenu={entry === 'menu'}>
                                                    <MenuItem
                                                        record={record}
                                                        onClick={() => handleCardClick(record.name)}
                                                        entry={entry}
                                                    />
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
                                                        onSuccess={() => setMoveToConfirm(true)}
                                                    />
                                                )}
                                            </React.Fragment>
                                        ))
                                    )}
                                </MenuGrid>

                                {moveToConfirm && (
                                    <Dialog open={moveToConfirm}>
                                        <DialogContent sx={{ color: COLORS_DARK.text.primary, padding: '24px' }}>
                                            <Typography variant={'body1'}>
                                                상품을 장바구니에 담았습니다.
                                                <br /> 장바구니로 이동하시겠습니까?
                                            </Typography>
                                        </DialogContent>
                                        <Button onClick={() => setMoveToConfirm(false)}>취소</Button>
                                        <Button onClick={() => router.push(`/cafe/cart/${cartId}`)}>확인</Button>
                                    </Dialog>
                                )}

                                {!hasNextPage &&
                                    isFetched &&
                                    ((data?.pages?.[0]?.records?.length ?? 0) > 0 ? (
                                        <Box display="flex" justifyContent="center" mt={3}>
                                            <Typography variant="body2">끝~</Typography>
                                        </Box>
                                    ) : (
                                        <Box display="flex" justifyContent="center" mt={30}>
                                            <Typography variant="body2" fontSize={'large'} textAlign={'center'}>
                                                아직 등록된 메뉴가 없어요.
                                                <br />곧 맛있는 메뉴들이 올라올 예정이에요 ☕️🍰
                                            </Typography>
                                        </Box>
                                    ))}
                            </Box>
                        </CafeMenuTabPanel>
                    ))}
                </ScrollableContent>
            </PageContainer>
        </>
    );
};

export default CafeMenu;
