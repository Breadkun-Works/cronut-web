import styled from '@emotion/styled';
import { css } from '@emotion/react';

export const MenuBoxWrap = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    z-index: 99;
`;

export const MenuCloseButton = styled.button`
    position: fixed;
    top: 13px;
    right: 14px;
    cursor: pointer;

    svg {
        width: 35px;
        height: 35px;
    }
`;

export const MobileNav = styled.nav`
    display: flex;
    flex-direction: column;
    align-items: center;

    ul {
        display: flex;
        flex-direction: column;
        gap: 30px;

        li {
            text-align: center;
            font-size: 38px;
        }
    }
`;

export const MenuItem = styled.a<{ active?: boolean }>`
    display: inline-block;
    opacity: ${({ active }) => (active ? 1 : 0.5)};
    color: #fff;

    ${({ active }) =>
        active &&
        css`
            font-weight: bold;
            border-bottom: 1px solid #fff;
        `}
`;
