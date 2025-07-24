import { css } from '@emotion/react';
import { COLORS_DARK } from '@/data';

export const blind = css`
    position: absolute;
    overflow: hidden;
    clip: rect(0 0 0 0);
    margin: -1px;
    width: 1px;
    height: 1px;
`;

export const ScrollBarTransparent = css`
    ::-webkit-scrollbar {
        width: 14px;
        height: 0;
        background-color: rgba(0, 0, 0, 0%);
    }

    ::-webkit-scrollbar-thumb {
        background-color: transparent;
        border: 4px solid transparent;
        border-radius: 100px;
    }
`;

export const inner = css`
    width: 950px;
    margin: 0 auto;

    @media (max-width: 1024px) {
        width: 100%;
    }
`;

export const innerContent = css`
    @media (max-width: 1024px) {
        padding: 0 15px;
    }
`;

export const ScrollBar = css`
    &::-webkit-scrollbar {
        width: 6px;
    }
    ,
    &::-webkit-scrollbar-thumb {
        background-color: #444;
        border-radius: 4px;
    }
    ,
    &::-webkit-scrollbar-track {
        background-color: ${COLORS_DARK.background.main};
    }
`;
