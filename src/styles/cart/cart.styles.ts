import { desktop } from '@/styles/mixnis';
import { colors } from '@/styles/colors';
import styled from '@emotion/styled';
import { Card, CardMedia, Chip, Container, Tab, Tabs, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { COLORS_DARK } from '@/data';

export const PageWrapper = styled.div`
    width: 100%;
    max-width: 950px;
    .cart-wrapper {
        display: flex;
        justify-content: center;
    }
`;

export const CartTitle = styled.div`
    background-color: ${colors.gray09};
    display: flex;
    align-items: center;
    margin-bottom: clamp(1px, 3vw, 16px);

    ${desktop(`
    margin-bottom: 25px;
  `)}

    .title__icon {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 11.54vw;
        max-height: 48px;
        width: 11.54vw;
        max-width: 48px;
        border-radius: clamp(1px, 5.13vw, 22px);
        background-color: ${colors.blue00};
        margin-left: clamp(1px, 3.85vw, 27px);
        margin-right: clamp(1px, 3.85vw, 16px);

        ${desktop(`
      background-color: transparent;
      height: auto;
      width: auto;
      max-height: none;
      max-width: none;
      border-radius: 0;
      margin-left: 30px;
      margin-right: 10px;
    `)}

        > img {
            height: 5.64vw;
            max-height: 22px;

            ${desktop(`
        height: 20px;
        max-height: none;
      `)}
        }
    }

    .title__select {
        position: relative;
        display: flex;
        align-items: center;

        .title__letter {
            font-size: clamp(1px, 5.38vw, 25px);

            ${desktop(`
        font-size: 20px;
      `)}
        }

        select {
            font-size: clamp(1px, 4vw, 15px);
            text-align-last: center;
            -webkit-text-align-last: center;
            -moz-text-align-last: center;
            -ms-text-align-last: center;
            appearance: none;
            text-decoration: none;
            border: none;
            padding: 0;
            margin: 0;
            width: 100%;
            height: 100%;
            position: absolute;
            background-color: ${colors.gray08};
            color: ${colors.gray00};
            top: 0;
            left: 0;
            opacity: 0;
            cursor: pointer;

            ${desktop(`
        font-size: 20px;
      `)}
        }

        .title__select-button {
            width: 2vw;
            max-width: 10px;
            margin-left: 1.5vw;
            display: flex;
            align-items: center;
            justify-content: space-between;
            cursor: pointer;

            ${desktop(`
        width: 8px;
        max-width: none;
        margin-left: 10px;
      `)}
        }
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
    border: 1px solid #8b4513;
    box-sizing: border-box;
    background-color: #8b4513;
    color: #fff;
    padding: 0 10px;
    text-align: center;
    margin: 20px 0;
`;

export const StyledMenuContainer = styled(Container)`
    background-color: ${COLORS_DARK.background.main};
    color: ${COLORS_DARK.text.primary};
    transition:
        background-color 0.3s ease,
        color 0.3s ease;
    min-height: 100vh;
    padding-top: 2rem;
    padding-bottom: 2rem;
`;

export const StyledMenuTitle = styled.h1`
    font-size: 2rem;
    font-weight: bold;
    text-align: center;
    margin-bottom: 2rem;
    color: ${COLORS_DARK.text.primary};
`;

// MUI Tabs 스타일링
export const StyledMenuTabs = styled(Tabs)`
    margin-bottom: 2rem;
    border-bottom: 1px solid ${COLORS_DARK.divider};

    .MuiTabs-indicator {
        background-color: ${COLORS_DARK.accent.main};
    }
`;

export const StyledMenuTab = styled(Tab)`
    color: ${COLORS_DARK.text.secondary};
    opacity: 1;
    text-transform: none;
    font-weight: normal;

    &.Mui-selected {
        color: ${COLORS_DARK.accent.main};
        font-weight: bold;
    }

    &:hover {
        color: ${COLORS_DARK.accent.main};
    }
`;

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

export const StyledCard = styled(Card)(({ theme }) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    '&:hover': {
        transform: 'translateY(-4px)',
        border: '1px solid white'
    },
    backgroundColor: '#2c3034'
}));

export const StyledCardMedia = styled(CardMedia)({
    height: 0,
    paddingTop: '56.25%', // 16:9 비율
    position: 'relative',
    transition: 'transform 0.3s ease',
    '&:hover': {
        transform: 'scale(1.05)'
    }
});

export const TemperatureChip = styled(Chip)(({ theme }) => ({
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 1
}));
