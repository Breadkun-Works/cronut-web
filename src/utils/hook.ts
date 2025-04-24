import { useMediaQuery, useTheme } from '@mui/material';
import { RefObject, useEffect, useState } from 'react';

export function useResponsive() {
    const theme = useTheme();

    return {
        isXs: useMediaQuery(theme.breakpoints.only('xs')),
        isSm: useMediaQuery(theme.breakpoints.only('sm')),
        isMd: useMediaQuery(theme.breakpoints.only('md')),
        isLg: useMediaQuery(theme.breakpoints.only('lg')),
        isXl: useMediaQuery(theme.breakpoints.only('xl')),
        isMobile: useMediaQuery(theme.breakpoints.between('xs', 'md')), // 예: 360 이하
        isTablet: useMediaQuery(theme.breakpoints.between('sm', 'lg')),
        isDesktop: useMediaQuery(theme.breakpoints.up('lg'))
    };
}

// 사용자 이니셜 가져오기 (이미지가 없을 경우 대체용)
export const getUserInitial = (name: string) => {
    return name.charAt(0);
};

const breakpointSteps = [
    { min: 0, max: 319, fontSize: 14, chipSize: 16, iconSize: 16, maxWidth: 90 },
    { min: 320, max: 329, fontSize: 14, chipSize: 15, iconSize: 17, maxWidth: 100 },
    { min: 330, max: 339, fontSize: 15, chipSize: 14, iconSize: 17, maxWidth: 110 },
    { min: 340, max: 349, fontSize: 15, chipSize: 14, iconSize: 18, maxWidth: 120 },
    { min: 350, max: 359, fontSize: 15, chipSize: 14, iconSize: 19, maxWidth: 130 },
    { min: 360, max: 369, fontSize: 15, chipSize: 14, marginTop: -1, iconSize: 19, maxWidth: 140 },
    { min: 370, max: 379, fontSize: 15, chipSize: 14, iconSize: 19.5, maxWidth: 150 },
    { min: 380, max: 389, fontSize: 15.5, chipSize: 15, iconSize: 20, maxWidth: 160 },
    { min: 390, max: 399, fontSize: 15.5, iconSize: 20, maxWidth: 170 },
    { min: 400, max: 409, fontSize: 15.5, iconSize: 21, maxWidth: 180 },
    { min: 410, max: 419, fontSize: 15.5, iconSize: 21, maxWidth: 190 },
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

type BreakpointConfig = {
    min: number;
    max: number;
    fontSize?: number;
    chipSize?: number;
    iconSize?: number;
    maxWidth?: number | string;
    marginTop?: number;
};

type PageConfigs = {
    [page: string]: BreakpointConfig[];
};

export const responsiveConfig: PageConfigs = {
    cart: [
        { min: 0, max: 319, fontSize: 14, chipSize: 13, iconSize: 16, maxWidth: 90 },
        { min: 320, max: 329, fontSize: 14, chipSize: 13, iconSize: 17, maxWidth: 100 },
        { min: 330, max: 339, fontSize: 15, chipSize: 14, iconSize: 17, maxWidth: 110 },
        { min: 340, max: 349, fontSize: 15, chipSize: 14, iconSize: 18, maxWidth: 120 },
        { min: 350, max: 359, fontSize: 15, chipSize: 14, iconSize: 19, maxWidth: 130 },
        { min: 360, max: 369, fontSize: 15, chipSize: 14, iconSize: 19, maxWidth: 140 },
        { min: 370, max: 379, fontSize: 15, chipSize: 14, iconSize: 19.5, maxWidth: 150 },
        { min: 380, max: 389, fontSize: 15.5, chipSize: 15, iconSize: 20, maxWidth: 160 },
        { min: 390, max: 399, fontSize: 15.5, iconSize: 20, maxWidth: 170 },
        { min: 400, max: 409, fontSize: 15.5, iconSize: 21, maxWidth: 180 },
        { min: 410, max: 419, fontSize: 15.5, iconSize: 21, maxWidth: 190 },
        { min: 420, max: 429, fontSize: 15.5, iconSize: 21, maxWidth: 200 },
        { min: 430, max: 439, fontSize: 15.5, iconSize: 21, maxWidth: 210 },
        { min: 440, max: 479, fontSize: 16, chipSize: 16, iconSize: 21.5, maxWidth: '100%' },
        { min: 480, max: Infinity, fontSize: 16, chipSize: 16, iconSize: 22, maxWidth: '100%' }
    ],
    'cart-register': [
        { min: 0, max: 359, fontSize: 13, iconSize: 15, maxWidth: 100 },
        { min: 360, max: 479, fontSize: 14, iconSize: 18, maxWidth: 180 },
        { min: 480, max: Infinity, fontSize: 15, iconSize: 20, maxWidth: '100%' }
    ]
};

export const useResponsiveConfig = (pageKey: keyof typeof responsiveConfig) => {
    const [width, setWidth] = useState<number>(1024);

    useEffect(() => {
        const update = () => setWidth(window.innerWidth);
        update();
        window.addEventListener('resize', update);
        return () => window.removeEventListener('resize', update);
    }, []);

    const configList = responsiveConfig[pageKey];
    const config = configList.find(({ min, max }) => width >= min && width <= max) ?? configList[configList.length - 1];

    return { ...config };
};

export function useBottomHeight(ref: RefObject<HTMLElement>, deps: any[] = []): number {
    const [bottomHeight, setBottomHeight] = useState(0);

    useEffect(() => {
        const updateHeight = () => {
            if (ref.current) {
                const height = ref.current.getBoundingClientRect().height + 20;
                console.log('📏 bottom height:', height);
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
