import { createTheme } from '@mui/material';
import { DrinkCategory } from '@/types/common';

export const MuiTheme = createTheme({
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
                    color: 'white',
                    width: '500px'
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
                    }
                }
            }
        }
    }
});

export const CafeMenuData = [
    {
        name: 'COFFEE',
        value: DrinkCategory.COFFEE,
        sx: { fontSize: '20px' }
    },
    { name: 'TEA', value: DrinkCategory.TEA, sx: { fontSize: '20px' } },
    { name: 'BEVERAGE', value: DrinkCategory.DRINK, sx: { fontSize: '20px' } }
];
