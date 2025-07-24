import styled from '@emotion/styled';
import { ButtonTypes } from './Button.types';
import { css } from '@emotion/react';

export const ButtonWrap = styled.button<ButtonTypes>`
    padding: 8px 32px;
    border-radius: 8px;
    border-width: 2px;
    border-style: solid;
    background-color: ${({ bgColor }) => (bgColor ? bgColor : 'transparent')};
    cursor: pointer;

    ${({ variant, color, bgColor, textColor }) =>
        variant === 'line'
            ? css`
                  border-color: ${color ? (color === 'orange' ? '#CF7500' : color) : '#fff'};
                  color: ${color ? (color === 'orange' ? '#CF7500' : color) : '#fff'};
              `
            : variant === 'contained'
              ? css`
                    background-color: ${bgColor ? bgColor : '#CF7500'};
                    color: ${textColor ? textColor : '#fff'};
                    border-color: ${bgColor ? bgColor : '#CF7500'};
                `
              : ``}
`;
