import styled from '@emotion/styled';
import { css } from '@emotion/react';

const openingDash = css`
    position: relative;
    padding-left: 13px;

    &:before {
        content: '';
        display: inline-block;
        position: absolute;
        top: 10px;
        left: 0;
        width: 5px;
        height: 2px;
        background-color: rgba(255, 255, 255, 0.5);
    }
`;

const OpeningModalContent = css`
    h4 {
        display: inline-block;
        position: relative;
        padding: 0 10px;
        margin-left: 20px;
        font-size: 20px;
        background-color: #fff;
        border-radius: 7px;
        color: #212529;
        z-index: 1;
    }

    ul {
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: relative;
        top: -15px;
        width: 100%;
        padding: 20px 40px 10px 40px;
        border: 1px solid rgba(255, 255, 255, 0.3);
        border-radius: 7px;

        li {
            ${openingDash};
        }
    }
`;

export const OpeningWrap = styled.div<{ EULJI?: boolean }>`
    display: flex;
    padding: 20px 0 0 0;
    width: 100%;

    ${({ EULJI }) =>
        EULJI &&
        css`
            display: flex;

            & > div {
                width: 100%;
            }
        `}
`;

export const OpeningUl = styled.ul<{ EULJI?: boolean }>`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
    padding: ${({ EULJI }) => (EULJI ? '0' : '0 30px')};

    li {
        ${openingDash};

        width: auto;
    }

    ${({ EULJI }) =>
        EULJI &&
        css`
            justify-content: center;
            gap: 20px;
            width: 100%;
        `}

    ${({ theme }) => theme.breakpoints.down('md')} {
        padding: 0;
    }
`;

export const CafeModalTitle = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;

    ${({ theme }) => theme.breakpoints.down('md')} {
        font-size: 20px;
    }
`;

export const TimeWrap = styled.div`
    ${OpeningModalContent};

    display: flex;
    align-items: stretch;
    justify-content: center;
    gap: 20px;
    width: 100%;
    margin-bottom: -15px;

    h4 {
        font-size: 16px;
    }

    ul {
        gap: 10px;
        padding: 20px 20px 10px 20px;
    }

    ${({ theme }) => theme.breakpoints.down('lg')} {
        flex-direction: column;
        gap: 10px;

        ul {
            flex-wrap: wrap;
            column-gap: 20px;
            row-gap: 0;
            justify-content: flex-start;
        }
    }
`;

export const BreakTimeWrap = styled.div`
    ${OpeningModalContent};

    width: 100%;
    padding: 0 30px;

    p {
        ${openingDash};

        &:before {
            width: 5px;
            height: 5px;
        }
    }

    ${({ theme }) => theme.breakpoints.down('md')} {
        padding: 0;

        h4 {
            font-size: 16px;
        }

        ul {
            padding: 20px 30px 10px 30px;
        }
    }
`;
