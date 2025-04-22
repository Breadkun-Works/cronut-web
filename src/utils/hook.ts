import { useMediaQuery, useTheme } from '@mui/material';

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
export const useMaxWidthByViewport = () => {
    const isUnder320 = useMediaQuery('(max-width: 319px)');
    const is330 = useMediaQuery('(min-width: 320px) and (max-width: 329px)');
    const is340 = useMediaQuery('(min-width: 330px) and (max-width: 339px)');
    const is350 = useMediaQuery('(min-width: 340px) and (max-width: 349px)');
    const is360 = useMediaQuery('(min-width: 350px) and (max-width: 359px)');
    const is370 = useMediaQuery('(min-width: 360px) and (max-width: 369px)');
    const is380 = useMediaQuery('(min-width: 370px) and (max-width: 379px)');
    const is390 = useMediaQuery('(min-width: 380px) and (max-width: 389px)');
    const is400 = useMediaQuery('(min-width: 390px) and (max-width: 399px)');
    const is410 = useMediaQuery('(min-width: 400px) and (max-width: 409px)');
    const is420 = useMediaQuery('(min-width: 410px) and (max-width: 419px)');
    const is430 = useMediaQuery('(min-width: 420px) and (max-width: 429px)');
    const is440 = useMediaQuery('(min-width: 430px) and (max-width: 439px)');

    let maxWidth: number | string;
    let fontSize = 14;

    if (isUnder320) maxWidth = 90;
    else if (is330) maxWidth = 100;
    else if (is340) maxWidth = 110;
    else if (is350) maxWidth = 120;
    else if (is360) maxWidth = 130;
    else if (is370) {
        maxWidth = 140;
        fontSize = 15;
    } else if (is380) {
        maxWidth = 150;
        fontSize = 15;
    } else if (is390) {
        maxWidth = 160;
        fontSize = 15;
    } else if (is400) {
        maxWidth = 170;
        fontSize = 15;
    } else if (is410) {
        maxWidth = 180;
        fontSize = 15;
    } else if (is420) {
        maxWidth = 190;
        fontSize = 15;
    } else if (is430) {
        maxWidth = 200;
        fontSize = 15;
    } else if (is440) {
        maxWidth = 210;
        fontSize = 15;
    } else {
        maxWidth = '100%';
        fontSize = 16;
    }
    return { maxWidth, fontSize };
};
