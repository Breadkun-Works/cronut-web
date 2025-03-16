import { createTheme } from '@mui/material';
import { DrinkCategory } from '@/types/common';
import { Coffee, CoffeeIcon as Tea, Wine } from 'lucide-react';

export const breakPoints = { xs: 0, sm: 768, md: 960, lg: 1280, xl: 1920 };
export const MuiTheme = createTheme({
    breakpoints: {
        values: {
            xs: 0,
            sm: 768,
            md: 960,
            lg: 1280,
            xl: 1920
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
        },
        h6: {
            fontSize: '1.25rem', // 기본 크기 (큰 화면)
            '@media (max-width:768px)': {
                fontSize: '1rem' // 작은 화면에서 더 작은 크기
            }
        }
    },
    palette: {
        background: {
            default: '#212529'
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
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    backgroundColor: '#2c3034',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
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
