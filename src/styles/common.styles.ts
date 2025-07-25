import { css } from '@emotion/react';
import styled from '@emotion/styled';

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

export const innerContent = css`
    @media (max-width: 1024px) {
        padding: 0 15px;
    }
`;

export const ScrollBar = css`
    &::-webkit-scrollbar {
        width: 6px;
        background: transparent;
    }

    &::-webkit-scrollbar-track {
        background: transparent;
        border: none;
    }

    &::-webkit-scrollbar-thumb {
        background-color: transparent;
        border-radius: 4px;
        border: none;
        box-shadow: none;
    }

    &:hover::-webkit-scrollbar-thumb {
        background-color: rgba(255, 255, 255, 0.7);
    }
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

export const ContentWrap = styled.div`
    ${ScrollBar};
    ${inner};

    padding-bottom: 50px;
`;
