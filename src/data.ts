import { createTheme } from '@mui/material';
import { PageConfigs } from '@/types/common';

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

    interface Theme {
        custom: {
            responsiveConfig: typeof responsiveConfig;
        };
    }

    interface ThemeOptions {
        custom?: {
            responsiveConfig: typeof responsiveConfig;
        };
    }
}

export const responsiveConfig = {
    fontSizeSteps: {
        companySelect: {
            xs: '1rem',
            sm: '1.1rem',
            md: '1.2rem',
            lg: '1.25rem',
            xl: '1.25rem',
            xxl: '1.25rem',
            xxxl: '1.25rem'
        },
        cart: {
            xs: '0.9rem',
            sm: '0.95rem',
            md: '1rem',
            lg: '1.05rem',
            xl: '1.1rem',
            xxl: '1.15rem',
            xxxl: '1.2rem'
        },
        menu: {
            xs: '0.9rem',
            sm: '0.95rem',
            md: '1rem',
            lg: '1.05rem',
            xl: '1.1rem',
            xxl: '1.15rem',
            xxxl: '1.2rem'
        },
        cartRegister: {
            xs: '0.8rem',
            sm: '0.85rem',
            md: '0.9rem',
            lg: '0.95rem',
            xl: '1rem',
            xxl: '1.05rem',
            xxxl: '1.1rem'
        }
    },
    iconSizeSteps: {
        cart: {
            xs: 20,
            sm: 22,
            md: 24,
            lg: 26,
            xl: 28,
            xxl: 30,
            xxxl: 32
        },
        menu: {
            xs: 22,
            sm: 24,
            md: 24,
            lg: 24,
            xl: 28,
            xxl: 28,
            xxxl: 30
        }
    },
    chipSizeSteps: {
        cart: {
            xs: 18,
            sm: 20,
            md: 22,
            lg: 24,
            xl: 26,
            xxl: 28,
            xxxl: 30
        },
        cartRegister: {
            xs: 16,
            sm: 18,
            md: 20,
            lg: 22,
            xl: 24,
            xxl: 26,
            xxxl: 28
        }
    },
    paddingSteps: {
        cartItem: {
            xs: 1,
            sm: 1.25,
            md: 1.5,
            lg: 2,
            xl: 2.5,
            xxl: 3,
            xxxl: 3.5
        }
    }
};

export const MuiTheme = createTheme({
    custom: {
        responsiveConfig
    },
    breakpoints: {
        values: {
            xs: 0, // 기존대로 유지 (사실상 xxs 역할)
            sm: 360, // 일반적인 소형 스마트폰
            md: 481, // 일반 스마트폰
            lg: 600, // 태블릿
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
        MuiButtonBase: {
            defaultProps: {
                disableRipple: true
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

export const responsiveConfigByPixel: PageConfigs = {
    cart: [
        {
            min: 0,
            max: 319,
            fontSize: '0.95rem',
            chipSize: 15,
            iconSize: 18,
            maxWidth: 90,
            ellipsisMaxWidth: '48vw'
        },
        {
            min: 320,
            max: 329,
            fontSize: '0.95rem',
            chipSize: 15,
            iconSize: 18,
            maxWidth: 100,
            ellipsisMaxWidth: '50vw'
        },
        {
            min: 330,
            max: 339,
            fontSize: '0.95rem',
            chipSize: 15,
            iconSize: 18,
            maxWidth: 110,
            ellipsisMaxWidth: '52vw'
        },
        {
            min: 340,
            max: 349,
            fontSize: '0.95rem',
            chipSize: 15,
            iconSize: 18,
            maxWidth: 120,
            ellipsisMaxWidth: '52.5vw'
        },
        {
            min: 350,
            max: 359,
            fontSize: '0.95rem',
            chipSize: 15,
            iconSize: 18,
            maxWidth: 130,
            ellipsisMaxWidth: '53vw'
            // cartImgWidthAndHeight: 65
        },
        {
            min: 360,
            max: 369,
            fontSize: '1rem',
            chipSize: 16,
            iconSize: 20,
            maxWidth: 140,
            ellipsisMaxWidth: '48vw',
            cartImgWidthAndHeight: 65
        },
        {
            min: 370,
            max: 379,
            fontSize: '1rem',
            chipSize: 16,
            iconSize: 20,
            maxWidth: 150,
            ellipsisMaxWidth: '50vw',
            cartImgWidthAndHeight: 65
        },
        {
            min: 380,
            max: 389,
            fontSize: '1rem',
            chipSize: 16,
            iconSize: 20,
            maxWidth: 160,
            ellipsisMaxWidth: '48vw',
            cartImgWidthAndHeight: 65
        },
        {
            min: 390,
            max: 399,
            fontSize: '1rem',
            chipSize: 16,
            iconSize: 20,
            maxWidth: 170,
            ellipsisMaxWidth: '50vw',
            cartImgWidthAndHeight: 65
        },
        {
            min: 400,
            max: 409,
            fontSize: '1rem',
            chipSize: 16,
            iconSize: 21,
            maxWidth: 180,
            ellipsisMaxWidth: '50vw',
            cartImgWidthAndHeight: 70
        },
        {
            min: 410,
            max: 419,
            fontSize: '1rem',
            chipSize: 16,
            iconSize: 21,
            maxWidth: 190,
            ellipsisMaxWidth: '52vw',
            cartImgWidthAndHeight: 70
        },
        {
            min: 420,
            max: 429,
            fontSize: '1rem',
            chipSize: 16,
            iconSize: 21,
            maxWidth: 200,
            ellipsisMaxWidth: '52vw',
            cartImgWidthAndHeight: 70
        },
        {
            min: 430,
            max: 439,
            fontSize: '1rem',
            chipSize: 16,
            iconSize: 21,
            maxWidth: 210,
            ellipsisMaxWidth: '54vw',
            cartImgWidthAndHeight: 70
        },
        {
            min: 440,
            max: 479,
            fontSize: '1rem',
            chipSize: 16,
            iconSize: 21,
            maxWidth: '100%',
            ellipsisMaxWidth: '56vw',
            cartImgWidthAndHeight: 70
        },
        {
            min: 480,
            max: 509,
            fontSize: 17,
            chipSize: 16,
            iconSize: 21,
            maxWidth: '100%',
            ellipsisMaxWidth: '54vw',
            cartImgWidthAndHeight: 75
        },
        {
            min: 510,
            max: 539,
            fontSize: 17,
            chipSize: 16,
            iconSize: 22,
            maxWidth: '100%',
            ellipsisMaxWidth: '56vw',
            cartImgWidthAndHeight: 80
        },
        {
            min: 540,
            max: 569,
            fontSize: 17,
            chipSize: 16,
            iconSize: 22,
            maxWidth: '100%',
            ellipsisMaxWidth: '58vw',
            cartImgWidthAndHeight: 80
        },
        {
            min: 570,
            max: 599,
            fontSize: 17,
            chipSize: 16,
            iconSize: 22,
            maxWidth: '100%',
            ellipsisMaxWidth: '60vw',
            cartImgWidthAndHeight: 80
        },
        {
            min: 600,
            max: 639,
            fontSize: 17,
            chipSize: 16,
            iconSize: 22,
            maxWidth: '100%',
            ellipsisMaxWidth: '63vw',
            cartImgWidthAndHeight: 80
        },
        {
            min: 640,
            max: 679,
            fontSize: 17,
            chipSize: 16,
            iconSize: 22,
            maxWidth: '100%',
            ellipsisMaxWidth: '65vw',
            cartImgWidthAndHeight: 80
        },
        {
            min: 680,
            max: Infinity,
            fontSize: 18,
            chipSize: 17,
            iconSize: 22,
            maxWidth: '100%',
            ellipsisMaxWidth: '70vw',
            cartImgWidthAndHeight: 80
        }
    ],
    'cart-items': [
        { min: 0, max: 324, maxWidth: '33vw' },
        { min: 325, max: 339, maxWidth: '37vw' },
        { min: 340, max: 349, maxWidth: '37vw' },
        { min: 350, max: 359, maxWidth: '40vw' },
        { min: 360, max: 369, maxWidth: '37vw' },
        { min: 370, max: 379, maxWidth: '39vw' }
    ],
    'cart-summary': [
        { min: 0, max: 329, maxWidth: '23vw' },
        { min: 330, max: 339, maxWidth: '24vw' },
        { min: 340, max: 349, maxWidth: '26vw' },
        { min: 350, max: 359, maxWidth: '27vw' },
        { min: 360, max: 364, maxWidth: '25vw' },
        { min: 365, max: 369, maxWidth: '27vw' },
        { min: 370, max: 379, maxWidth: '27vw' },
        { min: 380, max: 389, maxWidth: '28vw' },
        { min: 390, max: 399, maxWidth: '29vw' },
        { min: 400, max: 409, maxWidth: '30vw' },
        { min: 410, max: 419, maxWidth: '32vw' },
        { min: 420, max: 429, maxWidth: '33vw' },
        { min: 430, max: 439, maxWidth: '35vw' }
    ],
    'cart-register': [
        { min: 0, max: 359, fontSize: 13, iconSize: 15, maxWidth: 100 },
        { min: 360, max: 479, fontSize: 14, iconSize: 18, maxWidth: 180 },
        { min: 480, max: Infinity, fontSize: 15, iconSize: 20, maxWidth: '100%' }
    ]
};
