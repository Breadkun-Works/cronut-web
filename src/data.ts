import { createTheme } from '@mui/material';
import { DrinkCategory } from '@/types/common';
import { Coffee, CoffeeIcon as Tea, Wine } from 'lucide-react';

declare module '@mui/material/styles' {
    interface BreakpointOverrides {
        xs: true;
        sm: true;
        md: true;
        lg: true;
        xl: true;
        xxl: true;
        xxxl: true;
    }
}

export const MuiTheme = createTheme({
    // breakpoints: {
    //     values: {
    //         xs: 375,
    //         sm: 480,
    //         md: 768,
    //         lg: 1024,
    //         xl: 1280
    //     }
    // },
    breakpoints: {
        values: {
            xs: 0, // 기존대로 유지 (사실상 xxs 역할)
            sm: 360, // 일반적인 소형 스마트폰
            md: 480, // 일반 스마트폰
            lg: 768, // 태블릿
            xl: 1024, // 노트북
            xxl: 1280, // 데스크탑
            xxxl: 1440 // 대형 데스크탑
        }
    },
    typography: {
        fontFamily:
            "'DungGeunMo', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
        body1: {
            color: 'white'
        },
        body2: {
            color: 'white'
        },
        button: {
            color: 'white'
        },
        h3: {
            fontSize: '2.5rem', // 기본 크기 (큰 화면)
            '@media (max-width:768px)': {
                fontSize: '1.5rem' // 작은 화면에서 더 작은 크기
            }
        }
    },
    palette: {
        mode: 'dark',
        primary: {
            main: '#ff9e44'
        },
        background: {
            default: '#212529',
            paper: '#343a40'
        }
    },
    components: {
        MuiTabs: {
            styleOverrides: {
                root: {
                    color: 'white'
                },
                indicator: {
                    backgroundColor: '#cf7500'
                }
            }
        },

        MuiTab: {
            styleOverrides: {
                root: {
                    color: 'white', // 기본 색상,
                    '&.Mui-selected': {
                        color: '#cf7500' // 선택된 탭 색상
                    },
                    fontSize: '0.875rem',
                    '@media (min-width:768px)': {
                        fontSize: '1rem'
                    }
                }
            }
        }
    }
});

export const CafeMenuData = [
    {
        name: 'COFFEE',
        index: 0,
        value: DrinkCategory.COFFEE,
        icon: Coffee,
        sx: { fontSize: '20px' }
    },
    { name: 'TEA', index: 1, value: DrinkCategory.TEA, icon: Tea, sx: { fontSize: '20px' } },
    { name: 'BEVERAGE', index: 2, value: DrinkCategory.DRINK, icon: Wine, sx: { fontSize: '20px' } }
];

export const COLORS_LIGHT = {
    background: {
        main: '#ffffff', // 기본 배경색 (흰색)
        light: '#f8f9fa', // 약간 어두운 배경 (매우 밝은 그레이)
        lighter: '#e9ecef', // 더 어두운 배경 (밝은 그레이)
        input: '#f1f3f5' // 입력 필드 배경
    },
    accent: {
        main: '#f09000', // 메인 포인트 (오렌지)
        light: '#ffb347', // 강조 포인트 (밝은 오렌지)
        dark: '#cf7500', // 어두운 포인트 (진한 오렌지)
        disabled: 'rgba(240, 144, 0, 0.5)' // 비활성화 (반투명 오렌지)
    },
    text: {
        primary: '#212529', // 주요 텍스트 (거의 검정)
        secondary: '#495057', // 부가 텍스트 (어두운 회색)
        disabled: '#adb5bd' // 비활성화 텍스트 (중간 회색)
    },
    divider: 'rgba(0, 0, 0, 0.1)' // 구분선 색상
};

// 다크모드 색상 정의 - 기본 배경색 #212529 기준
export const COLORS_DARK = {
    background: {
        main: '#212529', // gray-09
        light: '#2c3034',
        lighter: '#343a40', // gray-08
        input: '#495057', // gray-07
        surface: '#343a40' // 카드 등 서페이스
    },
    text: {
        primary: '#f8f9fa', // gray-00
        secondary: '#adb5bd', // gray-05
        tertiary: '#868e96', // gray-06
        disabled: '#6c757d' // 중간 회색
    },
    accent: {
        main: '#cf7500',
        light: '#ffb347',
        dark: '#e67e22',
        disabled: 'rgba(255, 158, 68, 0.5)'
    },
    border: {
        default: '#343a40',
        subtle: '#495057'
    },
    badge: {
        ice: '#4dabf7',
        hot: '#ff6b6b'
    },
    theme: {
        blue: '#404258',
        blueAlt: '#30475e',
        purple: '#413543',
        green: '#2e4f4f',
        red: '#a80038',
        yellow: '#cf7500'
    },
    divider: 'rgba(248, 249, 250, 0.1)'
};

export const BREAKPOINT = {
    xsmall: '375px',
    small: '480px',
    medium: '768px',
    large: '1024px'
};

export const FONT_SIZE = {
    xsmall: '0.75rem', // 12px
    small: '0.875rem', // 14px
    medium: '1rem', // 16px
    large: '1.125rem' // 18px
};
