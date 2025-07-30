import styled from '@emotion/styled';
import { Box, Card, CardContent, Chip, IconButton, Tab, Tabs, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { COLORS_DARK } from '@/data';
import { DrinkTemperature } from '@/types/common';
import { TemperatureBadgeProps } from '@/types/cart';
import { css, keyframes } from '@emotion/react';
import { ShoppingCart } from 'lucide-react';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';

const pulseGlow = keyframes`
    0% {
        filter: drop-shadow(0 0 4px rgba(255, 140, 0, 0.8)) drop-shadow(0 0 8px rgba(255, 140, 0, 0.5));
        stroke: #fff;
    }
    50% {
        filter: drop-shadow(0 0 6px rgba(255, 140, 0, 1)) drop-shadow(0 0 12px rgba(255, 140, 0, 0.8));
        stroke: #ffb347;
    }
    100% {
        filter: drop-shadow(0 0 4px rgba(255, 140, 0, 0.8)) drop-shadow(0 0 8px rgba(255, 140, 0, 0.5));
        stroke: #fff;
    }
`;

const bounce = keyframes`
    0%, 100% {
        transform: translateY(-25%);
        animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    50% {
        transform: none;
        animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
`;

export const CategoryTabs = styled(Tabs)({
    minHeight: 48,
    padding: '0 10px',
    width: '100%'
});

export const CategoryTab = styled(Tab)(({ theme }) => ({
    minHeight: 40,
    minWidth: 40,
    maxWidth: 70,
    '&.Mui-selected': {
        color: COLORS_DARK.accent.main,
        fontWeight: 'bold',
        fontSize: '0.9rem', // 기본값
        [theme.breakpoints.up('sm')]: {
            fontSize: '0.95rem'
        }
    },
    '&:hover': {
        color: COLORS_DARK.accent.dark
    },
    [theme.breakpoints.up('sm')]: {
        maxWidth: 90
    }
}));

export const MenuItemContent = styled(CardContent)({
    padding: '12px !important',
    display: 'flex',
    flexDirection: 'column',
    flex: 1
});

export const MenuImage = styled(Box)({
    position: 'relative',
    width: '100%',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 8
});

export const MenuGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    width: 100%;

    ${({ theme }) => theme.breakpoints.down('xl')} {
        grid-template-columns: repeat(3, 1fr);
    }

    ${({ theme }) => theme.breakpoints.down('md')} {
        grid-template-columns: repeat(2, 1fr);
    }
`;

export const MenuItemCard = styled(Card, {
    shouldForwardProp: prop => prop !== 'isMenu'
})<{ isMenu: boolean }>(({ isMenu }) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
    cursor: 'pointer',
    // isMenu가 true가 아닐 때만 hover 효과 적용
    ...(!isMenu && {
        '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)'
        }
    })
}));

// 스타일 컴포넌트 정의
export const StyledToggleButtonGroup = styled(ToggleButtonGroup)(() => ({
    width: '100%',
    display: 'flex',
    overflow: 'hidden',
    border: `1px solid ${COLORS_DARK.border.default}`,
    borderRadius: '8px',
    backgroundColor: COLORS_DARK.background.lighter,
    '& .MuiToggleButtonGroup-grouped': {
        margin: 0,
        border: 0,
        '&.Mui-disabled': {
            border: 0,
            opacity: 0.5
        },
        '&:not(:first-of-type)': {
            borderLeft: `1px solid ${COLORS_DARK.border.default}` // 버튼 사이에 구분선 추가
        },
        '&:first-of-type': {
            borderTopLeftRadius: '8px', // 왼쪽 상단 모서리만 둥글게
            borderBottomLeftRadius: '8px' // 왼쪽 하단 모서리만 둥글게
        },
        '&:last-of-type': {
            borderTopRightRadius: '8px', // 오른쪽 상단 모서리만 둥글게
            borderBottomRightRadius: '8px' // 오른쪽 하단 모서리만 둥글게
        }
    }
}));

// 기본 토글 버튼 스타일
export const StyledToggleButton = styled(ToggleButton)(() => ({
    flex: 1,
    color: COLORS_DARK.text.secondary,
    backgroundColor: 'transparent',
    padding: '12px 16px',
    fontSize: '0.9rem',
    fontWeight: 'bold',
    transition: 'all 0.2s ease',
    '&.Mui-disabled': {
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        color: COLORS_DARK.text.disabled
    }
}));

// HOT 버튼 스타일
export const HotToggleButton = styled(StyledToggleButton)(() => ({
    color: '#fff',
    '&:hover': {
        backgroundColor: `${COLORS_DARK.badge.hot}22`
    },
    '&.Mui-selected': {
        backgroundColor: COLORS_DARK.badge.hot,
        color: 'white',
        '&:hover': {
            backgroundColor: COLORS_DARK.badge.hot
        }
    }
}));

// ICED 버튼 스타일
export const IcedToggleButton = styled(StyledToggleButton)(() => ({
    color: '#fff',
    '&:hover': {
        backgroundColor: `${COLORS_DARK.badge.ice}22`
    },
    '&.Mui-selected': {
        backgroundColor: COLORS_DARK.badge.ice,
        color: 'white',
        '&:hover': {
            backgroundColor: COLORS_DARK.badge.ice
        }
    }
}));

export const TemperatureBadge = styled.div<{ type?: string }>`
    position: absolute;
    top: 8px;
    left: 8px;
    height: 20px;
    padding: 0 6px;
    border-radius: 4px;
    background-color: ${({ type }) => (type === 'ICED' ? COLORS_DARK.badge.ice : COLORS_DARK.badge.hot)};
    box-shadow: ${({ type }) =>
        type === 'ICED' ? '0 1px 4px rgba(77, 171, 247, 0.4)' : '0 1px 4px rgba(255, 107, 107, 0.4)'};
    color: #fff;
    font-size: 12px;
    line-height: 21px;
    z-index: 1;
`;

export const TempToggleButton = styled(ToggleButton, {
    shouldForwardProp: prop => prop !== 'selectedValue' && prop !== 'valueType'
})<{
    selectedValue: DrinkTemperature;
    valueType: DrinkTemperature;
}>(({ selectedValue, valueType }) => ({
    padding: '2px 6px',
    height: 20,
    minWidth: 20,
    fontSize: '0.75rem',
    fontWeight: 600,
    color: '#fff',
    border: 'none',
    textTransform: 'none',
    backgroundColor: 'lightgray',

    '&.Mui-selected': {
        backgroundColor: selectedValue === DrinkTemperature.ICED ? COLORS_DARK.badge.ice : COLORS_DARK.badge.hot,
        color: '#fff'
    },
    '&.Mui-selected:hover': {
        backgroundColor: selectedValue === DrinkTemperature.ICED ? 'rgba(77, 171, 247, 1)' : 'rgba(255, 107, 107, 1)'
    },

    '&:hover': {
        backgroundColor: valueType === DrinkTemperature.ICED ? 'rgba(77, 171, 247, 0.7)' : 'rgba(255, 107, 107, 0.7)',
        opacity: 1
    }
}));

// 검색 아이콘 버튼 스타일링
export const SearchIconButton = styled(IconButton)({
    color: 'white',
    padding: 0
});

export const GlowContainer = styled.div`
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;

    &::before {
        position: absolute;
        top: -8px;
        left: -8px;
        right: -8px;
        bottom: -8px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(255, 179, 71, 0.3) 0%, rgba(255, 179, 71, 0) 70%);
        animation: ${keyframes`
            0% {
                opacity: 0.2;
            }
            50% {
                opacity: 0.4;
            }
            100% {
                opacity: 0.2;
            }
        `} 2s infinite ease-in-out;
        z-index: 0;
    }
`;

export const GlowingIcon = styled(ShoppingCart)<{ active?: boolean }>`
    color: white;

    & path,
    & circle,
    & line,
    & polyline {
        stroke-width: 2;
        stroke-linecap: round;
        stroke-linejoin: round;
    }
    ${({ active }) =>
        active &&
        css`
            animation: ${pulseGlow} 2s infinite ease-in-out;
        `}
`;

export const AnimatedReceiptIcon = styled(ReceiptLongOutlinedIcon)`
    color: #fff;
    animation: ${bounce} 1s ease-in-out infinite;
    & path,
    & circle,
    & line,
    & polyline {
        stroke-width: 2;
        stroke-linecap: round;
        stroke-linejoin: round;
    }
`;

export const SearchContainer = styled(Box)`
    display: flex;
    position: relative;
    border-radius: 4px;
    background-color: rgba(255, 255, 255, 0.15);
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
`;

export const SearchButtonStyled = styled(IconButton)`
    position: absolute;
    right: 0;
    color: white;
    background-color: ${COLORS_DARK.accent.main};
    border-radius: 0 4px 4px 0;
    padding: 8px;
    height: 100%;

    &:hover {
        background-color: #d97706;
    }
`;

export const TabSearchWrapper = styled(Box)(({ theme }) => ({
    width: '100%',
    minHeight: 80,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottom: `2px solid ${COLORS_DARK.divider}`,
    [theme.breakpoints.up('lg')]: {
        padding: '14px 8px 16px 8px'
    }
}));

export const CartIconWrap = styled.div`
    position: relative;
    cursor: pointer;
`;

export const CartNumber = styled.div<{ active?: boolean; wide?: boolean }>`
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: -5px;
    left: ${({ wide }) => (wide ? '10px' : '16px')};
    min-width: ${({ wide }) => (wide ? 'auto' : '15px')};
    padding: 2px 4px;
    background-color: ${({ active }) => (active ? '#db661b' : '#6b6b6b')};
    color: #fff;
    border-radius: 10px;
    font-size: 15px;
    line-height: 1;

    ${({ wide }) =>
        wide &&
        css`
            padding: 2px 4px;
        `}
`;

export const MenuContentArea = styled.div<{ onlyText?: boolean }>`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    ${({ onlyText }) =>
        onlyText &&
        css`
            height: calc(100vh - 400px);
        `}
`;

export const MenuTextBox = styled.div`
    text-align: center;

    strong {
        font-size: inherit;
        color: #ff6b6b;
    }
`;
