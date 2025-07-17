import { css } from '@emotion/react';

export const blind = css`
    position: absolute;
    overflow: hidden;
    clip: rect(0 0 0 0);
    margin: -1px;
    width: 1px;
    height: 1px;
`;

export const inner = css`
    width: 950px;
    margin: 0 auto;

    @media (max-width: 1024px) {
        width: 100%;
    }
`;
