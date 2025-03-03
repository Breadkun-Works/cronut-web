import { css } from '@emotion/react';

export const breakpoints = {
    desktop: '768px'
};

export const desktop = (styles: string) => css`
    @media (min-width: ${breakpoints.desktop}) {
        ${styles}
    }
`;
