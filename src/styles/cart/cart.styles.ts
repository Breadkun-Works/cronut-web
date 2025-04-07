import styled from '@emotion/styled';
import { Badge, Box, Card, CardContent, CardMedia, Chip, Container, Tab, Tabs, Typography } from '@mui/material';
import { COLORS_DARK } from '@/data';
import { TemperatureBadgeProps } from '@/types/cart';

export const PageWrapper = styled.div`
    width: 100%;
    max-width: 950px;
    .cart-wrapper {
        display: flex;
        justify-content: center;
    }
`;

export const CartContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
    max-width: 680px;
`;

export const CartButton = styled.button`
    width: 100%;
    height: 40px;
    font-size: 16px;
    font-weight: bold;
    border-radius: 5px;
    border: 1px solid ${COLORS_DARK.accent.dark};
    box-sizing: border-box;
    background-color: ${COLORS_DARK.accent.dark};
    color: #fff;
    padding: 0 10px;
    text-align: center;
    margin: 20px 0;
`;

export const StyledMenuTitle = styled(Typography)({
    fontWeight: 'bold',
    fontSize: '1.5rem',
    color: COLORS_DARK.text.primary,
    textAlign: 'center'
    // position: 'absolute', // 추가: 절대 위치 설정
    // left: '50%', // 추가: 가운데 정렬
    // top: '50%', // 추가: 가운데 정렬
    // transform: 'translate(-50%, -50%)' // 추가: 정확한 중앙 정렬
});

// 온도 뱃지를 위한 Box 컴포넌트
export const StyledMenuTempBox = styled.div`
    display: flex;
    gap: 8px;
    margin-top: 8px;
    justify-content: flex-start;
`;

// TabIcon styled component 추가
export const TabIcon = styled(StyledMenuTempBox)`
    margin-bottom: 0.5rem;
    display: flex;
    justify-content: center;
`;

export const MenuCardMedia = styled(CardMedia, {
    shouldForwardProp: prop => prop !== 'isMenu'
})<{ isMenu: boolean }>(({ isMenu }) => ({
    height: 0,
    paddingTop: '100%',
    backgroundColor: 'white',
    position: 'relative',
    transition: 'transform 0.3s ease',
    ...(!isMenu && {
        '&:hover': {
            transform: 'scale(1.05)'
        }
    })
}));

export const PageContainer = styled(Container)({
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: COLORS_DARK.background.main
});

export const Header = styled(Box)({
    position: 'sticky',
    top: 0,
    zIndex: 10,
    backgroundColor: COLORS_DARK.background.main,
    borderBottom: `1px solid ${COLORS_DARK.divider}`,
    padding: '12px 16px'
});

export const HeaderContent = styled(Box)({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginTop: '1.5rem',
    marginBottom: '1.5rem'
});

export const CategoryTabs = styled(Tabs)({
    minHeight: 48,
    marginBottom: 8,
    '& .MuiTabs-flexContainer': {
        justifyContent: 'center',
        gap: 16
    }
});

export const CategoryTab = styled(Tab)`
    padding: 8px 4px;
    minheight: 40;

    &.Mui-selected {
        color: ${COLORS_DARK.accent.main};
        font-weight: bold;
    }

    &:hover {
        color: ${COLORS_DARK.accent.main};
    }
`;

export const ScrollableContent = styled(Box)`
    flex: 1;
    padding: 0 16px 16px 16px;
    overflow-y: auto;

    &.mobile {
        padding: 16px 0 16px 0; // 모바일일 때 패딩 제거
    }
`;

export const MenuGrid = styled(Box)({
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)', // 기본 3개씩 표시 (웹)
    gap: 16,
    width: '100%',
    '@media (max-width: 600px)': {
        gridTemplateColumns: 'repeat(2, 1fr)' // 모바일에서는 2개씩 표시
    }
});

export const MenuItemCard = styled(Card, {
    shouldForwardProp: prop => prop !== 'isMenu'
})<{ isMenu: boolean }>(({ isMenu }) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
    // isMenu가 true가 아닐 때만 hover 효과 적용
    ...(!isMenu && {
        '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)'
        }
    })
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

export const TemperatureBadge = styled(Chip)<TemperatureBadgeProps>(({ theme, temperature }) => ({
    height: 20,
    borderRadius: 4,
    fontWeight: 600,
    fontSize: '0.65rem',
    backgroundColor: temperature === 'ICED' ? COLORS_DARK.ice : COLORS_DARK.hot,
    color: '#fff',
    position: 'absolute',
    top: 8,
    left: 8,
    zIndex: 1,
    boxShadow: temperature === 'ICED' ? '0 1px 4px rgba(77, 171, 247, 0.4)' : '0 1px 4px rgba(255, 107, 107, 0.4)'
}));

export const CartBadge = styled(Badge)({
    '& .MuiBadge-badge': {
        backgroundColor: COLORS_DARK.hot,
        color: '#fff',
        fontWeight: 'bold',
        boxShadow: '0 0 0 2px #212529'
    }
});
