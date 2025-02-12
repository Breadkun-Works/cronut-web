import { css } from 'styled-components';

export const breakpoints = {
    desktop: '768px'
};

export const desktop = (styles: string) => css`
    @media (min-width: ${breakpoints.desktop}) {
        ${styles}
    }
`;
