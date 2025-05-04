import { createTheme } from '@mui/material';

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
            md: 480, // 일반 스마트폰
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
