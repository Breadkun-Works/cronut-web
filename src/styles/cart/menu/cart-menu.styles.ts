import styled from '@emotion/styled';
import { Box, Card, CardContent, Tab, Tabs } from '@mui/material';
import { COLORS_DARK } from '@/data';

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
