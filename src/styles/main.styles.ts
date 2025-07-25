import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { innerContent, ScrollBar } from '@/styles/common.styles';

const MainRadius = css`
    border-radius: 12px;
`;

export const MainWrap = styled.div`
    ${innerContent};

    padding-bottom: 40px !important;
`;

export const MainBox = styled.div<{
    company?: string;
    color?: string;
    mobile?: boolean;
    mobileOrder?: number;
    button?: boolean;
}>`
    ${MainRadius};

    display: flex;
    padding: 15px 25px;
    background-color: ${({ color }) => (color ? color : '#30475e')};

    ${({ theme }) => theme.breakpoints.down('xl')} {
        padding: 20px;
    }

    ${({ mobile, theme }) =>
        mobile &&
        css`
            display: none;

            ${theme.breakpoints.down('lg')} {
                display: flex;
            }
        `}

    ${({ button }) =>
        button &&
        css`
            cursor: pointer;

            &:hover {
                filter: brightness(0.9);
            }
        `}
    
    ${({ theme }) => theme.breakpoints.down('lg')} {
        order: ${props => props.mobileOrder ?? 0};
    }
`;

export const MainBoxTitle = styled.h4`
    margin: 0 0 20px 0;
    font-weight: bold;
    font-size: 22px;
    text-align: center;

    ${({ theme }) => theme.breakpoints.down('lg')} {
        margin-bottom: 10px;
    }
`;

export const MainBoxImg = styled.div<{ type?: string }>`
    display: flex;
    align-items: center;
    justify-content: center;

    ${({ theme }) => theme.breakpoints.down('lg')} {
        img {
            ${({ type }) => `
                width: ${type === 'cafe' ? '60%' : '80%'};
                margin-top: ${type === 'cafe' ? '10px' : '0'};
            `}
            height: auto;
        }
    }
`;

export const MainBread = styled.div`
    ${MainRadius};

    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    cursor: pointer;

    img {
        width: 80%;
    }
`;

export const BreadText = styled.div`
    margin-top: 10px;
    text-align: center;
    font-size: 20px;
`;

export const WeatherWrap = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;

    ${({ theme }) => theme.breakpoints.down('lg')} {
        flex-direction: column;
    }
`;

export const WeatherLeft = styled.div`
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: 15px;
    min-width: 50%;

    h4 {
        margin: 0;
        font-size: 22px;
    }

    & > div {
        display: flex;
        align-items: center;
        gap: 40px;

        p {
            margin: 0;
            font-size: 36px;
        }

        & > div {
            display: flex;
            align-items: center;
            gap: 10px;
        }
    }

    ${({ theme }) => theme.breakpoints.down('lg')} {
        margin-bottom: 15px;

        & > div {
            p {
                margin: 0;
                font-size: 26px;
                line-height: 30px;
            }

            img {
                width: 30px;
                height: 30px;
            }
        }

        h4 {
            display: none;
        }
    }
`;

export const WeatherRight = styled.div`
    ${MainRadius};
    ${ScrollBar};

    overflow-y: auto;
    width: 100%;
    height: 250px;
    padding: 25px 50px;
    background-color: #495057;
    box-sizing: border-box;

    ${({ theme }) => theme.breakpoints.down('lg')} {
        padding: 20px 15px;
        height: 200px;
    }
`;

export const WeatherBox = styled.div`
    ${MainRadius};

    display: flex;
    justify-content: space-between;
    width: 100%;

    &:not(:last-of-type) {
        margin-bottom: 15px;
    }
`;

export const WeatherTime = styled.div`
    padding: 0 15px;
    border-radius: 20px;
    background-color: rgba(255, 255, 255, 0.7);
    color: #212529;
    line-height: 27px;
`;

export const WeatherText = styled.p`
    display: inline-block;
    margin: 0;
    font-size: 18px;
    color: #fff;
    text-align: right;
`;

export const BreadImgWrap = styled.div`
    text-align: center;

    & > div {
        ${MainRadius};

        display: inline-flex;
        align-items: center;
        justify-content: center;
        background-color: #fff;
        aspect-ratio: 10 / 8;

        img {
            width: 70%;
        }
    }
`;

export const MainBoxList = styled.div<{ company?: string }>`
    display: flex;
    gap: 20px;
    margin-top: 20px;

    & > div {
        flex-direction: column;
        align-items: stretch;
        width: ${({ company }) => (company === 'EULJI' ? '50%' : 'calc(100% /3)')};
    }

    ${({ theme }) => theme.breakpoints.down('lg')} {
        flex-wrap: wrap;

        & > div {
            width: calc(50% - 10px);
        }
    }
`;

export const DustWrap = styled.div<{ company?: string }>`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    gap: 30px;
    height: 100%;

    img {
        margin-top: ${({ company }) => (company === 'EULJI' ? '0' : '30px')};
    }

    ${({ theme }) => theme.breakpoints.down('xl')} {
        img {
            margin-top: 0;
        }
    }

    ${({ theme }) => theme.breakpoints.down('md')} {
        gap: 10px;

        img {
            width: 80px;
            height: 80px;
        }
    }
`;

export const DustLevel = styled.div`
    font-size: 20px;
`;
