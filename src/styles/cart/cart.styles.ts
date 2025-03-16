import { desktop } from '@/styles/mixnis';
import { colors } from '@/styles/colors';
import styled from '@emotion/styled';
import { Card, CardMedia, ToggleButtonGroup } from '@mui/material';

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

export const StyledCard = styled(Card)(({ theme }) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    '&:hover': {
        transform: 'translateY(-4px)',
        border: '1px solid white'
    }
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

export const MenuPopoverToggleButtonGroup = styled(ToggleButtonGroup)({
    '& .MuiToggleButton-root': {
        color: '#ffffff',
        backgroundColor: 'transparent',
        borderColor: '#ffffff',
        '&:hover': {
            backgroundColor: 'transparent'
        }
    },
    display: 'flex',
    justifyContent: 'center',
    '& .MuiToggleButton-root.Mui-selected': {
        backgroundColor: 'white ',
        color: '#cf7500 ',
        borderColor: '#ffffff',
        '&:hover': {
            backgroundColor: 'white !important'
        }
    }
});
