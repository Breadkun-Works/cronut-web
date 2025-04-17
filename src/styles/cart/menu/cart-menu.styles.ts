import styled from '@emotion/styled';
import { Box, Card, CardContent, Tab, Tabs, ToggleButton, ToggleButtonGroup } from '@mui/material';
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
