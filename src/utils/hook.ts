'use client';

import { useMediaQuery, useTheme } from '@mui/material';
import { RefObject, useEffect, useMemo, useRef, useState } from 'react';
import { BASE_MENU, CafeMenuTab, Company, SEASON_MENU } from '@/types/common';
import { useAtom } from 'jotai/index';
import { companyAtom } from '@/atom/common-atom';
import { cartItemsAtom } from '@/atom/cart-atom';
import { CafeCartItem } from '@/types/cart';
import { responsiveConfigByPixel } from '@/data';
import { useCookies } from 'react-cookie';

let eventSource: EventSource | null = null; // 전역 SSE 변수

export function useResponsive() {
    const theme = useTheme();

    return {
        isXs: useMediaQuery(theme.breakpoints.only('xs')),
        isSm: useMediaQuery(theme.breakpoints.only('sm')),
        isMd: useMediaQuery(theme.breakpoints.only('md')),
        isLg: useMediaQuery(theme.breakpoints.only('lg')),
        isXl: useMediaQuery(theme.breakpoints.only('xl')),
        isSmall: useMediaQuery(theme.breakpoints.between('xs', 'sm')),
        isMedium: useMediaQuery(theme.breakpoints.between('sm', 'md')),
        isMobile: useMediaQuery(theme.breakpoints.between('xs', 'md')), // 예: 360 이하
        isTablet: useMediaQuery(theme.breakpoints.between('sm', 'lg')),
        isTabletOnly: useMediaQuery('(min-width:768px) and (max-width:1023px)'),
        tillTablet: useMediaQuery('(min-width:320px) and (max-width:768px)'),
        overTablet: useMediaQuery('(min-width:768px)'),
        isDesktop: useMediaQuery(theme.breakpoints.up('lg'))
    };
}

// 사용자 이니셜 가져오기 (이미지가 없을 경우 대체용)
export const getUserInitial = (name: string) => {
    return name.charAt(0);
};

const breakpointSteps = [
    { min: 0, max: 319, fontSize: '0.95rem', chipSize: 15, iconSize: 18, maxWidth: 90 },
    { min: 320, max: 329, fontSize: '0.95rem', chipSize: 15, iconSize: 18, maxWidth: 100 },
    { min: 330, max: 339, fontSize: '0.95rem', chipSize: 15, iconSize: 18, maxWidth: 110 },
    { min: 340, max: 349, fontSize: '0.95rem', chipSize: 15, iconSize: 18, maxWidth: 120 },
    { min: 350, max: 359, fontSize: '0.95rem', chipSize: 15, iconSize: 19, maxWidth: 130 },
    { min: 360, max: 369, fontSize: '1rem', chipSize: 15, marginTop: -1, iconSize: 19, maxWidth: 140 },
    { min: 370, max: 379, fontSize: '1rem', chipSize: 15, iconSize: 19.5, maxWidth: 150 },
    { min: 380, max: 389, fontSize: '1rem', chipSize: 16, iconSize: 20, maxWidth: 160 },
    { min: 390, max: 399, fontSize: '1rem', iconSize: 20, maxWidth: 170 },
    { min: 400, max: 409, fontSize: '1rem', iconSize: 21, maxWidth: 180 },
    { min: 410, max: 419, fontSize: '1.1rem', iconSize: 21, maxWidth: 190 },
    { min: 420, max: 429, fontSize: 15.5, iconSize: 21, maxWidth: 200 },
    { min: 430, max: 439, fontSize: 15.5, iconSize: 21, maxWidth: 210 },
    { min: 440, max: 479, fontSize: 16, iconSize: 21.5, maxWidth: '100%' },
    { min: 480, max: Infinity, fontSize: 16, iconSize: 22, maxWidth: '100%' }
];

export const useMaxWidthByViewport = () => {
    const [viewportWidth, setViewportWidth] = useState(1024); // 기본값

    useEffect(() => {
        const update = () => setViewportWidth(window.innerWidth);
        update();
        window.addEventListener('resize', update);
        return () => window.removeEventListener('resize', update);
    }, []);

    const config =
        breakpointSteps.find(step => viewportWidth >= step.min && viewportWidth <= step.max) ??
        breakpointSteps[breakpointSteps.length - 1];

    return {
        fontSize: config.fontSize,
        iconSize: config.iconSize,
        maxWidth: config.maxWidth,
        chipSize: config.chipSize,
        marginTop: config.marginTop
    };
};

export const useResponsiveConfig = (pageKey: keyof typeof responsiveConfigByPixel) => {
    const [width, setWidth] = useState<number>(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const configList = responsiveConfigByPixel[pageKey];

    return useMemo(() => {
        return configList.find(({ min, max }) => width >= min && width <= max) ?? configList[configList.length - 1];
    }, [width, configList]);
};

export function useBottomHeight(ref: RefObject<HTMLElement>, deps: any[] = []): number {
    const [bottomHeight, setBottomHeight] = useState(0);

    useEffect(() => {
        const updateHeight = () => {
            if (ref.current) {
                const height = ref.current.getBoundingClientRect().height + 20;
                setBottomHeight(height);
            }
        };

        const rafId = requestAnimationFrame(updateHeight);
        const timeoutId = setTimeout(updateHeight, 100); // Safari 대응

        const resizeObserver = new ResizeObserver(updateHeight);
        if (ref.current) {
            resizeObserver.observe(ref.current);
        }

        window.addEventListener('resize', updateHeight);

        return () => {
            cancelAnimationFrame(rafId);
            clearTimeout(timeoutId);
            resizeObserver.disconnect();
            window.removeEventListener('resize', updateHeight);
        };
    }, [ref, ...deps]);

    return bottomHeight;
}

export const useCafeMenuData = (entry?: string, cafeLocation?: string) => {
    const [menuData, setMenuData] = useState<CafeMenuTab[]>([]);
    const [company] = useAtom(companyAtom); // company를 가져온다
    const updateMenu = () => {
        const isEuljiLocation = (entry === 'personalCart' ? cafeLocation : company) === 'EULJI';
        setMenuData(isEuljiLocation ? [...BASE_MENU, SEASON_MENU] : BASE_MENU);
    };

    useEffect(() => {
        updateMenu();
    }, [entry, cafeLocation, company]);

    return menuData;
};

export const useCurrentBreakpoint = () => {
    const theme = useTheme();

    const isXxxl = useMediaQuery(theme.breakpoints.up('xxxl'));
    const isXxl = useMediaQuery(theme.breakpoints.up('xxl'));
    const isXl = useMediaQuery(theme.breakpoints.up('xl'));
    const isLg = useMediaQuery(theme.breakpoints.up('lg'));
    const isMd = useMediaQuery(theme.breakpoints.up('md'));
    const isSm = useMediaQuery(theme.breakpoints.up('sm'));

    if (isXxxl) return 'xxxl';
    if (isXxl) return 'xxl';
    if (isXl) return 'xl';
    if (isLg) return 'lg';
    if (isMd) return 'md';
    if (isSm) return 'sm';
    return 'xs';
};

export const useCartSync = (cartId: string, withClapAnimation = false) => {
    const [cartItems, setCartItems] = useAtom(cartItemsAtom);
    const lastProcessedIds = useRef<Set<string>>(new Set());
    const [clapPositions, setClapPositions] = useState<{ id: string; x: number }[]>([]);

    const [sessionExpired, setSessionExpired] = useState(false);

    useEffect(() => {
        if (!cartId) return;

        // SSE 중복 연결 방지
        if (!eventSource || eventSource.url !== `https://api.breadkun.com/sse/cafe/carts/${cartId}/items/subscribe`) {
            eventSource = new EventSource(`https://api.breadkun.com/sse/cafe/carts/${cartId}/items/subscribe`);
        }

        const eventName = `cafe-cart-item-${cartId}`;
        const handleEvent = (e: MessageEvent) => {
            const eventData = JSON.parse(e.data);

            if (eventData.event === 'CREATED') {
                handleNewItems(eventData.data.cafeCartItem);
            } else if (eventData.event === 'DELETED') {
                handleDeletedItems(eventData.data.id);
            }
        };

        eventSource.addEventListener(eventName, handleEvent);

        eventSource.onerror = () => {
            console.error('SSE Error');
            setSessionExpired(true);
            eventSource?.close();
            eventSource = null;
        };

        return () => {
            eventSource?.removeEventListener(eventName, handleEvent);
            eventSource?.close();
            eventSource = null;
            lastProcessedIds.current.clear();
        };
    }, [cartId]);

    const handleNewItems = (newItems: CafeCartItem[]) => {
        const filteredItems = newItems.filter(item => {
            if (lastProcessedIds.current.has(item.id)) return false;
            lastProcessedIds.current.add(item.id);
            return !cartItems.some(existing => existing.id === item.id);
        });

        if (filteredItems.length > 0) {
            setCartItems(prev => [...prev, ...filteredItems]);

            // 클랩 애니메이션 (장바구니 페이지에서만 실행)
            if (withClapAnimation) {
                filteredItems.forEach(item => addClapAnimation(item.id));
            }
        }
    };

    const handleDeletedItems = (deletedIds: string[]) => {
        setCartItems(prev => prev.filter(item => !deletedIds.includes(item.id)));
    };

    const addClapAnimation = (id: string) => {
        if (!withClapAnimation) return;

        const randomX = Math.random() * (window.innerWidth - 200);
        setClapPositions(prev => [...prev, { id, x: randomX }]);

        let startTime: number | null = null;
        const duration = 2000;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);

            setClapPositions(prev =>
                prev.map(pos =>
                    pos.id === id
                        ? {
                              ...pos,
                              y: -(progress * 50),
                              opacity: 1 - progress
                          }
                        : pos
                )
            );

            if (elapsed < duration) {
                requestAnimationFrame(animate);
            } else {
                setClapPositions(prev => prev.filter(pos => pos.id !== id));
            }
        };

        requestAnimationFrame(animate);
    };

    return { clapPositions, sessionExpired };
};

export const useHasVerticalScroll = () => {
    const ref = useRef<HTMLDivElement>(null);
    const [hasScroll, setHasScroll] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const check = () => {
            setHasScroll(el.scrollHeight > el.clientHeight);
        };

        check();

        const observer = new ResizeObserver(check);
        observer.observe(el);

        return () => observer.disconnect();
    }, []);

    return { ref, hasScroll };
};

export const useDynamicTitle = (baseTitle?: string) => {
    const [cookies] = useCookies(['recentCompany']);
    const companyCode: string = cookies.recentCompany || 'KANGCHON';
    const matchedCompany: string = companyCode === Company.KANGCHON ? '강촌' : '을지';

    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (baseTitle === '') return;
            if (!baseTitle) {
                document.title = 'BBANGDORI';
            } else {
                document.title = `${baseTitle} | ${matchedCompany} - BBANGDORI`;
            }
        }
    }, [baseTitle, matchedCompany]);
};
