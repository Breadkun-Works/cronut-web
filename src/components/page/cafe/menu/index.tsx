'use client';

import { Box, ToggleButtonGroup, Tooltip, Typography, useTheme } from '@mui/material';
import { COLORS_DARK, responsiveConfig } from '@/data';
import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { getInitialCartItems, useGetCafeMenuInfinite } from '@/apis/cafe/cafe-api';
import { Company, DrinkCategory, DrinkTemperature } from '@/types/common';
import {
    CafeMenuTitle,
    CafeMenuTitleWrap,
    CafeStateBadge,
    CafeStateBadgeLabel,
    MenuCardMedia,
    PageContainer,
    ScrollableContent,
    StyledMenuTitleWithName
} from '@/styles/cart/cart.styles';
import { Leaf, MapPin, Search, ShoppingCart, Sparkles, Wine, X } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
    ICafeCartBasicResponse,
    ICafeMenuBoardResponse,
    ICafeMenuOption,
    IExtendedCafeMenuBoardResponse
} from '@/types/cart';
import { MenuPopover } from '@/components/page/cafe/menu/menu-popover';
import { useCafeMenuData, useCartSync, useCurrentBreakpoint, useDynamicTitle, useResponsive } from '@/utils/hook';
import {
    CartIconWrap,
    CartNumber,
    CategoryTab,
    CategoryTabs,
    GlowContainer,
    GlowingIcon,
    MenuContentArea,
    MenuGrid,
    MenuImage,
    MenuItemCard,
    MenuItemContent,
    MenuTextBox,
    SearchIconButton,
    TabSearchWrapper,
    TemperatureBadge,
    TempToggleButton
} from '@/styles/cart/menu/cart-menu.styles';
import { CompanySelect } from '@/components/CompanySelect';
import { LocalCafeOutlined } from '@mui/icons-material';
import { SearchBar } from '@/components/page/cafe/menu/searchbar';
import { CommonModal } from '@/components/page/cafe/modal/common-modal';
import { useAtom } from 'jotai/index';
import { companyAtom } from '@/atom/common-atom';
import { cartItemsAtom, cartItemsCountAtom } from '@/atom/cart-atom';
import { EllipsisTooltip } from '@/components/common/EllipsisTooltip';
import { getCookie, setCookie } from '@/utils/cookie';
import { getDefaultDrinkTemperatureBySeason } from '@/utils/dates';
import { isMobileDevice } from '@/utils/util';
import CafeOpeningModal from '@/components/page/cafe/modal/cafe-opening-modal';

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

const CafeMenu = ({
    entry,
    cartId,
    title,
    cartBasic
}: {
    title: ReactNode | string;
    entry?: string;
    cartId?: string;
    cartBasic?: ICafeCartBasicResponse;
}) => {
    const pathname = usePathname();
    const isMenuPage = pathname.startsWith('/cafe/cart/menu') || pathname === '/cafe/menu';

    useDynamicTitle(isMenuPage ? '카페 메뉴' : '');

    const searchParams = useSearchParams();
    const name = getCookie('BRK-UserName') || '사용자';
    const [tabValue, setTabValue] = useState(0);
    const [company] = useAtom(companyAtom);
    const [, setCartItems] = useAtom(cartItemsAtom);
    const [cartItemsCount] = useAtom(cartItemsCountAtom);
    const theme = useTheme();

    useCartSync(cartId as string, false, cartBasic?.status === 'INACTIVE');

    const { isMobile, isDesktop, isSmall } = useResponsive();

    const menuHeaderRef = useRef<HTMLDivElement>(null);
    const [menuTempMap, setMenuTempMap] = useState<Record<string, IExtendedCafeMenuBoardResponse>>({});

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

    const [query, setQuery] = useState<{
        size: number;
        category: DrinkCategory | string;
        name: string;
        cafeLocation?: string;
    }>({
        size: 12,
        category: 'COFFEE',
        name: '',
        cafeLocation: entry === 'personalCart' && cartBasic ? cartBasic.cafeLocation : company
    });

    const { data, hasNextPage, isFetchingNextPage, fetchNextPage, isFetched } = useGetCafeMenuInfinite(query);

    const cafeMenuData = useCafeMenuData(entry, cartBasic?.cafeLocation);
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
        const cookieUserInfo = getCookie('BRK-UUID');
        if (!cookieUserInfo) {
            setCookie('BRK-UUID', crypto.randomUUID());
        }
    }, []);

    useEffect(() => {
        if (cartId) {
            const initializeCart = async () => {
                try {
                    const initialCartItems = await getInitialCartItems(cartId);
                    setCartItems(initialCartItems);
                } catch (error) {
                    console.error('장바구니 초기화 오류:', error);
                }
            };

            initializeCart();
        }
    }, [cartId]);

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
                setDialogWidth(
                    typeof window !== 'undefined' && isMobile ? window.innerWidth : containerWidth * (3 / 4)
                );
            }
        };

        if (typeof window !== 'undefined' && openDialog) {
            handleResize();
            window.addEventListener('resize', handleResize);
        }

        return () => {
            if (typeof window !== 'undefined') {
                window.removeEventListener('resize', handleResize);
            }
        };
    }, [openDialog]);

    // 회사 바뀌면 일부 필드 초기화
    useEffect(() => {
        if (entry === 'menu') {
            setQuery(prev => ({
                ...prev,
                cafeLocation: company,
                category: DrinkCategory.COFFEE // 초기화
            }));
            setTabValue(0);
            setShowSearch(false);
            setSearchTerm('');
        }
    }, [company]);

    useEffect(() => {
        if (data?.pages) {
            const initialTempMap: Record<string, IExtendedCafeMenuBoardResponse> = {};

            data.pages.forEach(page => {
                page.records.forEach(record => {
                    if (!initialTempMap[record.name]) {
                        initialTempMap[record.name] = {
                            ...record,
                            temp:
                                record.options.length > 1
                                    ? getDefaultDrinkTemperatureBySeason()
                                    : record.options[0].drinkTemperature
                        };
                    }
                });
            });

            setMenuTempMap(prev => ({
                ...initialTempMap,
                ...prev // 기존 선택 유지 (스크롤 등으로 추가 로드됐을 때도 안전하게)
            }));
        }
    }, [data]);

    const handleTabChange = (event: React.SyntheticEvent, newTabValue: number) => {
        const selectedCategory = cafeMenuData[newTabValue].value;
        setTabValue(newTabValue);
        setQuery(prev => ({ ...prev, category: selectedCategory }));
        // 탭이 바뀌면 맵 정보 초기화
        setMenuTempMap({});
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

    const CafeMenuTempUI = ({
        temp,
        onToggle,
        options
    }: {
        temp: DrinkTemperature;
        onToggle(value: string): void;
        options: Array<ICafeMenuOption>;
    }) => {
        const tempType = getTempType(options);

        if (tempType === 'ICE_ONLY') return <TemperatureBadge type="ICED" label="ICE ONLY" size="small" />;

        if (tempType === 'HOT_ONLY') return <TemperatureBadge type="HOT" label="HOT ONLY" size="small" />;

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
                    <TempToggleButton
                        onClick={e => e.stopPropagation()}
                        value="HOT"
                        valueType={DrinkTemperature.HOT}
                        selectedValue={temp}
                    >
                        <span style={{ display: 'inline-block' }}>HOT</span>
                    </TempToggleButton>

                    <TempToggleButton
                        onClick={e => e.stopPropagation()}
                        value="ICED"
                        valueType={DrinkTemperature.ICED}
                        selectedValue={temp}
                    >
                        <span style={{ display: 'inline-block' }}>ICE</span>
                    </TempToggleButton>
                </ToggleButtonGroup>
            );
        }

        return null;
    };

    const MenuItem = ({
        temp,
        record,
        onClick,
        entry
    }: {
        temp: DrinkTemperature;
        record: ICafeMenuBoardResponse;
        onClick: () => void;
        entry?: string;
    }) => {
        // 공통 컨텐츠
        const content = (
            <MenuItemContent>
                <Box position="relative" width="100%">
                    <MenuImage>
                        <CafeMenuTempUI
                            temp={temp}
                            onToggle={(value: DrinkTemperature) => {
                                setMenuTempMap(prev => ({
                                    ...prev,
                                    [record.name]: {
                                        ...prev[record.name], // 기존 메뉴 데이터 유지
                                        temp: value // temp만 변경
                                    }
                                }));
                            }}
                            options={record.options}
                        />
                        <MenuCardMedia
                            isMenu={entry === 'menu'}
                            image={
                                (record.options.length > 1
                                    ? record.options?.[temp === DrinkTemperature.ICED ? 1 : 0]?.imageUrl
                                    : record.options?.[0]?.imageUrl) ?? '/logo/menu-fallback(2).webp'
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

        return entry === 'menu' ? content : <Box onClick={onClick}>{content}</Box>;
    };

    // 운영시간 팝업
    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleModal = () => {
        setIsModalOpen(prev => !prev);
    };

    // 카페 운영 상태
    let openingTimes: [string, string][] = [];
    if (company === Company.KANGCHON) {
        openingTimes = [
            ['08:20', '08:35'],
            ['10:10', '11:20'],
            ['12:00', '12:40'],
            ['14:00', '17:30']
        ];
    } else if (company === Company.EULJI) {
        openingTimes = [
            ['08:20', '08:50'],
            ['09:30', '12:50'],
            ['13:30', '17:00']
        ];
    }
    const isNowInRange = (start: string, end: string): boolean => {
        const now = new Date();

        const [startHour, startMinute] = start.split(':').map(Number);
        const [endHour, endMinute] = end.split(':').map(Number);

        const startDate = new Date(now);
        startDate.setHours(startHour, startMinute, 0, 0);

        const endDate = new Date(now);
        endDate.setHours(endHour, endMinute, 0, 0);

        return now >= startDate && now <= endDate;
    };
    const isOpen = openingTimes.some(([start, end]) => isNowInRange(start, end));

    return (
        <>
            <PageContainer ref={containerRef} maxWidth={false} disableGutters>
                <Box display={'flex'} justifyContent={'space-between'} margin={!isMobile ? '20px 0 0 0' : '10px 4px'}>
                    {entry === 'personalCart' ? (
                        <Box
                            display={'flex'}
                            alignItems="center"
                            gap={1.5}
                            mt={0.5}
                            sx={{ fontSize: isMobile ? '1.2rem' : '1.3rem' }}
                        >
                            <Box
                                sx={{
                                    backgroundColor: '#3D3C52', // 원형 배경 색상
                                    borderRadius: '30%',
                                    width: 32,
                                    height: 32,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0
                                }}
                            >
                                <MapPin size={isSmall ? '1.2rem' : '1.3rem'} />
                            </Box>

                            {cartBasic?.cafeLocation === 'EULJI' ? '을지 카페' : '강촌 카페'}
                        </Box>
                    ) : (
                        <CompanySelect entry={'cafe'} />
                    )}
                    <Box display={'flex'} justifyContent={'center'} gap={1} alignItems={'center'}>
                        <SearchIconButton
                            onClick={handleSearchToggle}
                            sx={{
                                color: 'white',
                                padding: 0,
                                width: { xs: 24, sm: 28, lg: 32 },
                                height: { xs: 24, sm: 28, lg: 32 },
                                '&:hover': {
                                    backgroundColor: 'transparent'
                                }
                            }}
                        >
                            {showSearch ? <X size={iconSize} /> : <Search size={iconSize} />}
                        </SearchIconButton>

                        <CartIconWrap
                            onClick={() =>
                                router.push(
                                    entry === 'personalCart' ? `/cafe/cart/${cartId}?${searchParams}` : '/cafe/cart'
                                )
                            }
                        >
                            {entry === 'personalCart' ? (
                                <ShoppingCart size={iconSize} />
                            ) : (
                                <GlowContainer>
                                    <GlowingIcon size={iconSize} color={'white'} active={isOpen} />
                                </GlowContainer>
                            )}
                            <CartNumber active={isOpen} wide={cartItemsCount > 10}>
                                {entry === 'personalCart'
                                    ? cartItemsCount > 0 && <>{cartItemsCount > 99 ? '99+' : cartItemsCount}</>
                                    : '+'}
                            </CartNumber>
                        </CartIconWrap>
                    </Box>
                </Box>

                <Box>
                    {entry === 'personalCart' ? (
                        <StyledMenuTitleWithName>
                            <Box
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                sx={{
                                    maxWidth: !isDesktop ? '90%' : '60%'
                                }}
                                ref={menuHeaderRef}
                            >
                                <EllipsisTooltip title={name}>{name}</EllipsisTooltip>
                                <Typography
                                    component="span"
                                    sx={{
                                        marginLeft: '4px',
                                        fontSize: !isDesktop
                                            ? '1.1rem'
                                            : theme.breakpoints.between('lg', 762)
                                              ? '1.2rem'
                                              : '1.3rem'
                                    }}
                                >
                                    님,
                                </Typography>
                            </Box>

                            <Typography
                                sx={{
                                    marginTop: isMobile ? '4px' : 0,
                                    fontSize: !isDesktop
                                        ? '1.1rem'
                                        : theme.breakpoints.between('lg', 762)
                                          ? '1.2rem'
                                          : '1.3rem',
                                    whiteSpace: 'nowrap',
                                    textAlign: 'center'
                                }}
                            >
                                {' '}
                                카페 메뉴를 선택해주세요~☺️
                            </Typography>
                        </StyledMenuTitleWithName>
                    ) : (
                        <>
                            <CafeMenuTitleWrap>
                                {!isMobileDevice() && !isMobile ? (
                                    <Tooltip title={'운영시간 자세히보기'} placement="top" arrow>
                                        <CafeStateBadge open={isOpen} onClick={handleModal}>
                                            <CafeStateBadgeLabel aria-hidden={'true'}>
                                                <span />
                                            </CafeStateBadgeLabel>
                                            {isOpen ? 'Open' : 'Close'}
                                        </CafeStateBadge>
                                    </Tooltip>
                                ) : (
                                    <CafeStateBadge open={isOpen} onClick={handleModal}>
                                        <CafeStateBadgeLabel aria-hidden={'true'}>
                                            <span />
                                        </CafeStateBadgeLabel>
                                        {isOpen ? 'Open' : 'Close'}
                                    </CafeStateBadge>
                                )}
                                <CafeMenuTitle>{title}</CafeMenuTitle>
                            </CafeMenuTitleWrap>
                        </>
                    )}
                </Box>

                <TabSearchWrapper>
                    {showSearch ? (
                        <SearchBar
                            value={searchTerm}
                            onChange={handleSearchChange}
                            show={showSearch}
                            onSubmit={handleSearchSubmit}
                        />
                    ) : (
                        <CategoryTabs value={tabValue} onChange={handleTabChange} centered variant={'fullWidth'}>
                            {cafeMenuData.map(cafeMenu => (
                                <CategoryTab
                                    key={cafeMenu.index}
                                    icon={returnIcon(cafeMenu.value)}
                                    label={cafeMenu.name}
                                />
                            ))}
                        </CategoryTabs>
                    )}
                </TabSearchWrapper>
                <ScrollableContent className={!isDesktop ? 'mobile' : ''}>
                    {cafeMenuData.map(cafeMenu => (
                        <CafeMenuTabPanel
                            key={cafeMenu.index}
                            value={tabValue}
                            index={cafeMenu.index}
                            isMobile={!isDesktop}
                        >
                            <MenuContentArea ref={loadMoreRef}>
                                {data?.pages && (
                                    <MenuGrid>
                                        {data?.pages?.map(page =>
                                            page.records.map(record => {
                                                return (
                                                    <React.Fragment key={`menu_${record.name}`}>
                                                        <MenuItemCard isMenu={entry === 'menu'}>
                                                            <MenuItem
                                                                temp={menuTempMap[record.name]?.temp}
                                                                record={record}
                                                                onClick={() => handleCardClick(record.name)}
                                                                entry={entry}
                                                            />
                                                        </MenuItemCard>
                                                        {entry !== 'menu' &&
                                                            openDialog &&
                                                            selectedMenu === record.name && (
                                                                <MenuPopover
                                                                    width={dialogWidth}
                                                                    open={openDialog}
                                                                    onClose={handleCloseDialog}
                                                                    handleChangeMenuData={setMenuTempMap}
                                                                    popoverProps={{
                                                                        menuTempMap,
                                                                        cartName: cartBasic?.title ?? '장바구니',
                                                                        temp: menuTempMap[record.name]?.temp,
                                                                        menuName: record.name,
                                                                        options: record.options
                                                                    }}
                                                                    cartId={cartId}
                                                                    onSuccess={() => {
                                                                        setMoveToConfirm(true);
                                                                    }}
                                                                />
                                                            )}
                                                    </React.Fragment>
                                                );
                                            })
                                        )}
                                    </MenuGrid>
                                )}

                                {moveToConfirm && (
                                    <CommonModal
                                        width={isMobile ? '90%' : '70%'}
                                        open={moveToConfirm}
                                        content={
                                            <Box>
                                                <Typography
                                                    sx={{
                                                        whiteSpace: 'pre-line',
                                                        textAlign: 'center',
                                                        fontSize: '1rem',
                                                        lineHeight: 1.5,
                                                        maxWidth: '280px',
                                                        wordBreak: 'keep-all'
                                                    }}
                                                >
                                                    {'상품을 장바구니에 담았습니다.\n장바구니로 이동하시겠습니까?'}
                                                </Typography>
                                            </Box>
                                        }
                                        onClose={() => setMoveToConfirm(false)}
                                        onConfirm={() => router.push(`/cafe/cart/${cartId}?${searchParams}`)}
                                    />
                                )}

                                {!hasNextPage &&
                                    isFetched &&
                                    (data?.pages?.[0]?.records?.length ?? 0) === 0 &&
                                    (query.name !== '' ? (
                                        <MenuTextBox>
                                            <p>
                                                이런! 🫢
                                                <br />
                                                <strong>{query.name}</strong> 메뉴는 아직 없어요.
                                                <br />
                                                다른 키워드로 다시 한번 검색해볼까요? 🔍
                                            </p>
                                        </MenuTextBox>
                                    ) : (
                                        <MenuTextBox>
                                            <p>
                                                아직 등록된 메뉴가 없어요. <br />곧 맛있는 메뉴들이 올라올 예정이에요
                                                ☕️🍰
                                            </p>
                                        </MenuTextBox>
                                    ))}
                            </MenuContentArea>
                        </CafeMenuTabPanel>
                    ))}
                </ScrollableContent>
            </PageContainer>

            {/*팝업 - 운영시간 자세히보기*/}
            <CafeOpeningModal open={isModalOpen} onClose={handleModal} />
        </>
    );
};

export default CafeMenu;
