import styled from '@emotion/styled';
import {
    Avatar,
    Badge,
    Box,
    Button,
    Card,
    CardContent,
    CardMedia,
    Chip,
    Container,
    Paper,
    SpeedDial,
    Tab,
    Tabs,
    Typography
} from '@mui/material';
import { BREAKPOINT, COLORS_DARK, FONT_SIZE } from '@/data';
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
    border: 1px solid ${COLORS_DARK.accent.main};
    box-sizing: border-box;
    background-color: ${COLORS_DARK.accent.main};
    color: #fff;
    padding: 0 10px;
    text-align: center;
    margin: 20px 0;
`;

export const StyledMenuTitle = styled(Typography)({
    fontWeight: 'bold',
    fontSize: '1.5rem',
    color: COLORS_DARK.text.primary,
    textAlign: 'center',
    whiteSpace: 'pre-line'
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
    backgroundColor: COLORS_DARK.background.main
});

export const ConfirmHeader = styled(Box)({
    position: 'sticky',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    top: 0,
    zIndex: 10,
    borderBottom: `1px solid ${COLORS_DARK.border.default}`,
    backgroundColor: COLORS_DARK.background.main,
    padding: 16,
    marginBottom: '16px'
});

export const HeaderContent = styled(Box)({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginTop: '1rem',
    marginBottom: '1rem'
});

export const CategoryTabs = styled(Tabs)({
    minHeight: 48,
    marginBottom: 8,
    '& .MuiTabs-flexContainer': {
        justifyContent: 'center',
        gap: 16
    },
    padding: '0 0 16px 0',
    borderBottom: `1px solid ${COLORS_DARK.divider}`
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
    backgroundColor: temperature === 'ICED' ? COLORS_DARK.badge.ice : COLORS_DARK.badge.hot,
    color: '#fff',
    position: 'absolute',
    top: 8,
    left: 8,
    zIndex: 1,
    boxShadow: temperature === 'ICED' ? '0 1px 4px rgba(77, 171, 247, 0.4)' : '0 1px 4px rgba(255, 107, 107, 0.4)'
}));

export const CartBadge = styled(Badge)({
    '& .MuiBadge-badge': {
        backgroundColor: COLORS_DARK.badge.hot,
        color: '#fff',
        fontWeight: 'bold',
        boxShadow: '0 0 0 2px #212529'
    }
});
export const CartConfirmContainer = styled(Container)({
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh'
});

export const LinkShareCard = styled(Card)({
    marginBottom: 16,
    overflow: 'hidden',
    backgroundColor: COLORS_DARK.theme.blue,
    border: `1px solid ${COLORS_DARK.background.lighter}`,
    borderRadius: '20px'
});

export const LinkShareContent = styled(CardContent)({
    padding: '12px !important'
});

export const CartItemCard = styled(Card)({
    marginBottom: 16,
    overflow: 'hidden',
    transition: 'all 0.2s ease-in-out',
    borderRadius: '20px',
    '&:hover': {
        transform: 'translateY(-2px)'
    }
});

export const CartItemContent = styled(CardContent)({
    padding: '16px !important'
});

export const ItemImage = styled(Box)(({ theme }) => ({
    position: 'relative',
    width: 60, // 모바일에서 기본 크기
    height: 60,
    borderRadius: 8,
    overflow: 'hidden',
    flexShrink: 0,
    [theme.breakpoints.up('sm')]: {
        width: 80, // 태블릿에서 크기
        height: 80,
        borderRadius: 12
    },
    [theme.breakpoints.up('md')]: {
        width: 100, // 데스크탑에서 크기
        height: 100
    }
}));

export const ItemDetails = styled(Box)({
    marginLeft: 16,
    display: 'flex',
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'column'
});
export const ConfirmTemperatureBadge = styled(Chip)<TemperatureBadgeProps>(({ theme, temperature }) => ({
    height: 20,
    borderRadius: 4,
    fontWeight: 600,
    fontSize: '0.65rem',
    backgroundColor: temperature === 'ICED' ? COLORS_DARK.badge.ice : COLORS_DARK.badge.hot,
    color: '#fff',
    marginLeft: 8,
    boxShadow: 'none'
}));

export const UserAvatar = styled(Avatar)(({ theme }) => ({
    width: 24,
    height: 24,
    [theme.breakpoints.up('sm')]: {
        width: 30,
        height: 30
    },
    [theme.breakpoints.up('md')]: {
        width: 34,
        height: 34
    },
    marginRight: 8,
    fontSize: '0.75rem',
    backgroundColor: COLORS_DARK.accent.main,
    color: COLORS_DARK.text.primary,
    fontWeight: 600
}));

export const BottomSummary = styled(Paper)({
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: COLORS_DARK.theme.blue,
    borderTop: `1px solid ${COLORS_DARK.background.lighter}`,
    boxShadow: 'none'
});

export const ButtonsContainer = styled(Box)({
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 16,
    marginTop: 16
});

export const ActionButton = styled(Button)({
    height: 56,
    fontSize: '1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    color: COLORS_DARK.text.primary,
    backgroundColor: COLORS_DARK.accent.main
});

export const WhiteButton = styled(Button)({
    height: 56,
    fontSize: '1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS_DARK.text.primary,
    border: `1px solid ${COLORS_DARK.accent.main}`,
    color: COLORS_DARK.accent.main,
    '&:hover': {
        backgroundColor: '#e9ecef' // 약간 어두운 흰색
    }
});

export const ButtonIcon = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
});

export const StyledSpeedDial = styled(SpeedDial)(({ theme }) => ({
    position: 'fixed',
    bottom: 100, // 하단 버튼 위에 위치
    right: 16,
    '& .MuiSpeedDial-fab': {
        backgroundColor: COLORS_DARK.accent.main,
        color: COLORS_DARK.text.primary,
        '&:hover': {
            backgroundColor: '#e08a1e'
        }
    }
}));
