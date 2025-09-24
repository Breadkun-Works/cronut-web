import styled from '@emotion/styled';

export const BusDetailWrap = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;

    ${({ theme }) => theme.breakpoints.down('lg')} {
        margin-bottom: 20px;
    }
`;

export const BusTitle = styled.h4`
    width: 100%;

    & > div {
        &:first-of-type {
            justify-content: center;
        }
    }

    p {
        margin-top: 40px;
        color: #fff;
        font-weight: bold;
        font-size: 36px;
        letter-spacing: -0.75px;
        text-align: center;
    }

    ${({ theme }) => theme.breakpoints.down('lg')} {
        p {
            margin-top: 20px;
            font-size: 28px;
        }
    }
`;

export const BusTimer = styled.div`
    @keyframes shake {
        0% {
            transform: rotate(0deg);
        }
        25% {
            transform: rotate(-5deg);
        }
        75% {
            transform: rotate(5deg);
        }
        100% {
            transform: rotate(0deg);
        }
    }

    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin-top: 20px;
    font-weight: normal;
    font-size: 28px;

    svg {
        animation: shake 0.3s ease-in 3;
    }

    dl {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;

        dt {
            position: relative;
            margin-right: 10px;

            &:after {
                content: '';
                display: inline-block;
                position: absolute;
                top: 50%;
                width: 1px;
                height: 65%;
                margin-left: 10px;
                background-color: rgba(255, 255, 255, 0.3);
                transform: translateY(-50%);
            }
        }
    }

    ${({ theme }) => theme.breakpoints.down('lg')} {
        display: none;
    }
`;

export const BusList = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    width: 100%;

    ${({ theme }) => theme.breakpoints.down('lg')} {
        display: none;
    }
`;

export const BusBadge = styled.strong<{ color?: string }>`
    padding: 0 10px;
    border-radius: 30px;
    margin-right: 10px;
    z-index: 1;
    background-color: ${({ color }) => (color ? color : 'transparent')};

    ${({ theme }) => theme.breakpoints.down('lg')} {
        margin-right: 5px;
        font-size: 16px;
    }
`;

export const BusListItem = styled.a<{ color?: string }>`
    overflow: hidden;
    display: flex;
    align-items: center;
    width: 100%;
    padding: 20px 20px;
    border-radius: 12px;
    border-width: 1px;
    border-style: solid;
    border-color: ${({ color }) => (color ? color : 'transparent')};
    box-sizing: border-box;
    cursor: pointer;

    ${BusBadge} {
        background-color: ${({ color }) => (color ? color : 'transparent')};
    }

    &:hover {
        position: relative;
        color: ${({ color }) => (color ? color : 'transparent')};

        &:before {
            content: '';
            display: inline-block;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: ${({ color }) => (color ? color : 'transparent')};
            filter: brightness(1.8) saturate(0.2);
        }

        ${BusBadge} {
            color: #fff;
        }

        & > ul {
            li {
                &:after {
                    border-color: ${({ color }) => (color ? color : 'transparent')};
                }
            }
        }
    }
`;

export const BusListUl = styled.ul`
    display: flex;
    align-items: center;

    li {
        position: relative;
        font-size: 20px;

        &:not(:last-of-type) {
            display: flex;
            align-items: center;
            position: relative;
            padding-right: 10px;
            margin-right: 10px;

            &:after {
                content: '';
                display: inline-block;
                position: absolute;
                top: 50%;
                right: 0;
                width: 7px;
                height: 7px;
                border-right: 1px solid #fff;
                border-bottom: 1px solid #fff;
                transform: translateY(-50%) rotate(-45deg);
            }
        }
    }
`;

export const BusLineTitle = styled.h4`
    display: flex;
    justify-content: center;
    margin-top: 70px;
    margin-bottom: 20px;
    font-size: 38px;
    letter-spacing: -0.75px;

    & ${BusListUl} {
        display: inline-flex;

        li {
            font-size: 38px;

            &:after {
                width: 15px;
                height: 15px;
            }

            &:not(:last-of-type) {
                padding-right: 20px;
                margin-right: 20px;
            }
        }
    }

    strong {
        margin-left: 20px;
        opacity: 0.5;
    }

    ${({ theme }) => theme.breakpoints.down('lg')} {
        display: none;
    }
`;

export const BusBoxList = styled.div`
    display: flex;
    align-items: stretch;
    justify-content: center;
    gap: 20px;

    ${({ theme }) => theme.breakpoints.down('lg')} {
        flex-direction: column;
        gap: 10px;
    }
`;

export const BusBoxItem = styled.div<{ color?: string }>`
    overflow: hidden;
    display: flex;
    align-items: center;
    gap: 15px;
    position: relative;
    width: 100%;
    padding: 20px;
    color: #222;
    border: 1px solid transparent;
    border-radius: 12px;
    box-sizing: border-box;

    &:before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        filter: brightness(1.8) saturate(0.2);
    }

    svg {
        width: 30px;
        height: 30px;
        z-index: 1;
        opacity: 0.7;
    }

    dl {
        display: flex;
        flex-direction: column;
        justify-content: center;
        position: relative;
        z-index: 1;

        dt {
            font-size: 22px;
        }

        dd {
            font-size: 32px;
            line-height: 1.3;

            &.desc {
                font-size: 16px;
                letter-spacing: -0.75px;
                opacity: 0.6;
            }
        }
    }

    ${({ theme }) => theme.breakpoints.down('lg')} {
        gap: 15px;
        padding: 10px 20px;

        svg {
            width: 20px;
            height: 20px;
        }

        dl {
            display: grid;
            grid-template-columns: repeat(2, auto);
            align-items: center;

            dt,
            dd {
                font-size: 18px;
            }

            dt {
                &:after {
                    content: ':';
                    margin: 0 5px;
                }
            }

            dd {
                &:nth-of-type(2) {
                    grid-column-start: 1;
                    grid-column-end: 3;
                }

                &.desc {
                    font-size: 14px;
                }
            }
        }
    }
`;

export const BusBox = styled.div<{ color?: string }>`
    flex-shrink: 0;

    ${BusBoxItem} {
        border-color: ${({ color }) => (color ? color : 'transparent')};

        &:before {
            background-color: ${({ color }) => (color ? color : 'transparent')};
        }
    }
`;

export const BusDetailBox = styled.div`
    padding: 50px;
    background-color: rgba(255, 255, 255, 0.09);
    border-radius: 12px;
    box-sizing: border-box;

    ${({ theme }) => theme.breakpoints.down('lg')} {
        padding: 0 15px;
        background-color: transparent;
    }
`;

export const BusTabMenu = styled.ul<{ color?: string }>`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    margin-top: 10px;
    padding: 0 15px;
    box-sizing: border-box;

    li {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 40px;
        margin-bottom: 20px;
        font-size: 18px;
        background-color: #656565;

        &.active {
            background-color: ${({ color }) => (color ? color : '#656565')};
        }

        &:first-of-type {
            border-radius: 6px 0 0 6px;
        }

        &:last-of-type {
            border-radius: 0 6px 6px 0;
        }
    }
`;

export const MapArea = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    margin-left: 80px;
    gap: 10px;

    button {
        width: 100%;
        text-align: center;
        box-sizing: border-box;
    }

    & > div {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 300px;
        background-color: rgba(255, 255, 255, 0.09);
    }

    ${({ theme }) => theme.breakpoints.down('lg')} {
        margin-left: 0;
    }
`;

export const BusDescWrap = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 20px;

    & > div {
        &:nth-of-type(1) {
            flex-shrink: 0;
        }
    }

    ${({ theme }) => theme.breakpoints.down('lg')} {
        flex-direction: column;

        & > div {
            &:nth-of-type(1) {
                flex-shrink: 1;
                width: 100%;
            }
        }
    }
`;

export const IconBox = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 32px;
    height: 32px;
    background-color: #3d3c52;
    border-radius: 30%;
`;

export const BusIconList = styled.div`
    display: grid;
    grid-template-columns: repeat(2, auto);
    grid-column-gap: 10px;
    grid-row-gap: 5px;

    &:not(:last-of-type) {
        margin-bottom: 20px;
    }

    ${({ theme }) => theme.breakpoints.down('lg')} {
        display: flex;
        align-items: center;
        margin-bottom: 20px;
    }
`;

export const TitleText = styled.p`
    font-size: 20px;
    letter-spacing: -0.75px;

    ${({ theme }) => theme.breakpoints.down('lg')} {
        font-size: 16px;
    }
`;

export const SubText = styled.p`
    grid-column-start: 2;
    grid-column-end: 3;
    position: relative;
    padding-left: 10px;
    font-size: 14px;
    letter-spacing: -0.75px;

    &:before {
        content: '';
        display: inline-block;
        position: absolute;
        top: 9px;
        left: 0;
        width: 5px;
        height: 1px;
        background-color: rgba(255, 255, 255, 0.3);
    }

    ${({ theme }) => theme.breakpoints.down('lg')} {
        padding-left: 0;
        font-size: 16px;

        &:before {
            display: none;
        }
    }
`;

export const SelectText = styled.span`
    margin-left: 10px;
    font-size: 20px;
    letter-spacing: -0.75px;
`;
