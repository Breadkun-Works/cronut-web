'use client';
import {
    Badge,
    Box,
    Button,
    CardActionArea,
    Dialog,
    DialogContent,
    IconButton,
    ToggleButtonGroup,
    Typography
} from '@mui/material';
import { COLORS_DARK, responsiveConfig } from '@/data';
import React, { useEffect, useRef, useState } from 'react';
import { useGetCafeMenuInfinite } from '@/apis/cafe/cafe-api';
import { DrinkCategory, DrinkTemperature } from '@/types/common';
import { useCompanyContext } from '@/context/CompanyContext';
import {
    HeaderContent,
    MenuCardMedia,
    PageContainer,
    ScrollableContent,
    StyledMenuTitle,
    TabIcon
} from '@/styles/cart/cart.styles';
import { Leaf, Search, Sparkles, Wine, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ICafeMenuOption } from '@/types/cart';
import { MenuPopover } from '@/components/page/cafe/menu/menu-popover';
import { useCafeMenuData, useCurrentBreakpoint, useResponsive } from '@/utils/hook';
import {
    CategoryTab,
    CategoryTabs,
    GlowContainer,
    GlowingIcon,
    MenuGrid,
    MenuImage,
    MenuItemCard,
    MenuItemContent,
    SearchIconButton,
    TemperatureBadge,
    TempToggleButton
} from '@/styles/cart/menu/cart-menu.styles';
import { CompanySelect } from '@/components/CompanySelect';
import { LocalCafeOutlined } from '@mui/icons-material';
import { SearchBar } from '@/components/page/cafe/menu/searchbar';

const returnIcon = (cafeMenu: DrinkCategory) => {
    switch (cafeMenu) {
        case DrinkCategory.COFFEE:
            return <LocalCafeOutlined />;
        case DrinkCategory.TEA:
            return <Leaf />;
        case DrinkCategory.SEASON:
            return <Sparkles />;
        default:
            return <Wine />;
    }
};

const CafeMenuTabPanel = ({ children, value, index }: any) => {
    const { isSmall } = useResponsive();

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
        >
            {value === index && (isSmall ? children : <Box sx={{ padding: '16px 0 16px 0' }}>{children}</Box>)}
        </div>
    );
};

const CafeMenu = ({ entry, cartId, title }: { title: string; entry?: string; cartId?: string }) => {
    const [tabValue, setTabValue] = useState(0);
    const { company } = useCompanyContext();
    const { isMobile, isDesktop, isSmall } = useResponsive();

    const [openDialog, setOpenDialog] = useState(false);
    const [selectedMenu, setSelectedMenu] = useState('');
    const [moveToConfirm, setMoveToConfirm] = useState(false);

    const router = useRouter();
    const containerRef = useRef<HTMLDivElement>(null);
    const loadMoreRef = useRef<HTMLDivElement | null>(null);
    const [dialogWidth, setDialogWidth] = useState<number>(0);

    const [searchTerm, setSearchTerm] = useState('');
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleSearchSubmit = () => {
        setQuery(prev => ({
            ...prev,
            category: '',
            name: searchTerm
        }));
    };

    const [query, setQuery] = useState({
        size: 12,
        category: 'COFFEE',
        name: '',
        cafeLocation: company
    });

    const { data, hasNextPage, isFetchingNextPage, fetchNextPage, isFetched } = useGetCafeMenuInfinite(query);

    const cafeMenuData = useCafeMenuData();
    const { iconSizeSteps } = responsiveConfig;
    const breakpoint = useCurrentBreakpoint();
    const iconSize = iconSizeSteps.menu[breakpoint];

    const [showSearch, setShowSearch] = useState(false);

    const handleSearchToggle = () => {
        const next = !showSearch;
        setShowSearch(next);

        if (!next) {
            setSearchTerm('');
            setQuery(prev => ({
                ...prev,
                category: DrinkCategory.COFFEE,
                name: ''
            }));
            setTabValue(0);
        }
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
                const containerWidth = containerRef.current.offsetWidth;
                setDialogWidth(isMobile ? window.innerWidth : containerWidth * (3 / 4));
            }
        };

        if (openDialog) handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [openDialog, window?.innerWidth]);

    // 회사 바뀌면 일부 필드 초기화
    useEffect(() => {
        setQuery(prev => ({
            ...prev,
            cafeLocation: company,
            category: DrinkCategory.COFFEE // 초기화
        }));
        setTabValue(0);
        setShowSearch(false);
        setSearchTerm('');
    }, [company]);

    const handleTabChange = (event: React.SyntheticEvent, newTabValue: number) => {
        const selectedCategory = cafeMenuData[newTabValue].value;
        setTabValue(newTabValue);
        setQuery(prev => ({ ...prev, category: selectedCategory }));
    };

    const handleCardClick = (name: string) => {
        setOpenDialog(true);
        setSelectedMenu(name);
    };

    const handleCloseDialog = () => setOpenDialog(false);

    const getTempType = (options: Array<ICafeMenuOption>) => {
        const hasHot = options.some(o => o.drinkTemperature === 'HOT');
        const hasIced = options.some(o => o.drinkTemperature === 'ICED');

        if (hasHot && hasIced) return 'BOTH';
        if (hasHot) return 'HOT_ONLY';
        if (hasIced) return 'ICE_ONLY';
        return 'NONE';
    };

    const CafeMenuTempUI = ({ temp, onToggle, options }: any) => {
        const tempType = getTempType(options);

        if (tempType === 'ICE_ONLY') return <TemperatureBadge temperature="ICED" label="ICE ONLY" size="small" />;

        if (tempType === 'HOT_ONLY') return <TemperatureBadge temperature="HOT" label="HOT ONLY" size="small" />;

        if (tempType === 'BOTH') {
            return (
                <ToggleButtonGroup
                    exclusive
                    value={temp}
                    onChange={(_, value) => {
                        if (value !== null) onToggle(value);
                    }}
                    sx={{
                        position: 'absolute',
                        top: 8,
                        left: 8,
                        zIndex: 2,
                        overflow: 'hidden',
                        height: 22,
                        '@media (max-width: 400px)': {
                            fontSize: '0.6875rem',
                            height: 20,
                            padding: '0 5px'
                        }
                    }}
                >
                    <TempToggleButton value="HOT" valueType={DrinkTemperature.HOT} selectedValue={temp}>
                        <span style={{ display: 'inline-block' }}>HOT</span>
                    </TempToggleButton>

                    <TempToggleButton value="ICED" valueType={DrinkTemperature.ICED} selectedValue={temp}>
                        <span style={{ display: 'inline-block' }}>ICE</span>
                    </TempToggleButton>
                </ToggleButtonGroup>
            );
        }

        return null;
    };

    const MenuItem = ({ record, onClick, entry }: any) => {
        const [temp, setTemp] = useState<DrinkTemperature>(record.options[0].drinkTemperature);

        // 공통 컨텐츠
        const content = (
            <MenuItemContent>
                <Box position="relative" width="100%">
                    <MenuImage>
                        <CafeMenuTempUI
                            temp={temp}
                            onToggle={(value: DrinkTemperature) => {
                                setTemp(value);
                            }}
                            options={record.options}
                        />
                        <MenuCardMedia
                            isMenu={entry === 'menu'}
                            image={
                                record.options?.[temp === DrinkTemperature.ICED ? 1 : 0]?.imageUrl ??
                                'https://img.freepik.com/free-photo/iced-cola-tall-glass_1101-740.jpg'
                            }
                            sx={{ backgroundSize: 'contain' }}
                            title={record.name}
                        />
                    </MenuImage>
                </Box>

                <Typography
                    fontWeight="bold"
                    sx={{
                        mt: 1,
                        fontSize: isSmall ? '0.9rem' : '1rem',
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
                        mt: 0.5,
                        fontSize: isSmall ? '0.9rem' : '1rem'
                    }}
                >
                    {record.options[0].price.toLocaleString()}원
                </Typography>
            </MenuItemContent>
        );

        return entry === 'menu' ? content : <CardActionArea onClick={onClick}>{content}</CardActionArea>;
    };

    return (
        <PageContainer ref={containerRef} maxWidth={false} disableGutters>
            <Box>
                <Box display={'flex'} justifyContent={'space-between'} mb={2}>
                    <CompanySelect entry={'cafe'} />
                    <Box display={'flex'} justifyContent={'center'} gap={1} alignItems={'center'}>
                        <SearchIconButton
                            onClick={handleSearchToggle}
                            sx={{
                                width: { xs: 24, sm: 28, lg: 32 },
                                height: { xs: 24, sm: 28, lg: 32 },
                                '&:hover': {
                                    backgroundColor: 'transparent'
                                }
                            }}
                        >
                            {showSearch ? <X size={iconSize} /> : <Search size={iconSize} />}
                        </SearchIconButton>

                        <IconButton
                            sx={{
                                borderRadius: 0,
                                position: 'relative',
                                width: { xs: 24, sm: 28, lg: 32 },
                                height: { xs: 24, sm: 28, lg: 32 },
                                padding: 0,
                                '&:hover': {
                                    backgroundColor: 'transparent'
                                },
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                            onClick={() => router.push('/cafe/cart')}
                        >
                            <Badge
                                overlap="circular"
                                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                                badgeContent={
                                    <Box
                                        sx={{
                                            width: 14,
                                            height: 14,
                                            borderRadius: '50%',
                                            backgroundColor: COLORS_DARK.accent.main,
                                            color: '#fff',
                                            fontSize: '1rem',
                                            fontWeight: 'bold',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        +
                                    </Box>
                                }
                            >
                                <GlowContainer>
                                    <GlowingIcon size={iconSize} color="white" />
                                </GlowContainer>
                            </Badge>
                        </IconButton>
                    </Box>
                </Box>

                <HeaderContent>
                    <StyledMenuTitle>{title}</StyledMenuTitle>
                </HeaderContent>

                <SearchBar
                    value={searchTerm}
                    onChange={handleSearchChange}
                    show={showSearch}
                    onSubmit={handleSearchSubmit}
                />
            </Box>

            {!showSearch && (
                <CategoryTabs
                    value={tabValue}
                    onChange={handleTabChange}
                    centered
                    variant={isSmall ? 'fullWidth' : undefined}
                >
                    {cafeMenuData.map(cafeMenu => (
                        <CategoryTab
                            sx={{
                                ...(isSmall && {
                                    minWidth: 0, // 탭이 최소 너비 이상으로 벌어지지 않게
                                    padding: '6px 4px', // 패딩 줄여서 공간 확보
                                    fontSize: '0.85rem' // 텍스트 크기도 줄임
                                })
                            }}
                            disableRipple
                            key={cafeMenu.index}
                            icon={<TabIcon>{returnIcon(cafeMenu.value)}</TabIcon>}
                            label={cafeMenu.name}
                        />
                    ))}
                </CategoryTabs>
            )}

            <ScrollableContent className={!isDesktop ? 'mobile' : ''}>
                {cafeMenuData.map(cafeMenu => (
                    <CafeMenuTabPanel
                        key={cafeMenu.index}
                        value={tabValue}
                        index={cafeMenu.index}
                        isMobile={!isDesktop}
                    >
                        <Box ref={loadMoreRef} component="div">
                            <MenuGrid>
                                {data?.pages?.map(page =>
                                    page.records.map((record, idx) => (
                                        <React.Fragment key={`menu_${record.name}`}>
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
    );
};

export default CafeMenu;
