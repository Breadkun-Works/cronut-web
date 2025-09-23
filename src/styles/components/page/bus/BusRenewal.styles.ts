import styled from '@emotion/styled';

export const BusWrap = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    height: calc(100vh - 250px);
    margin: 60px 0;

    ${({ theme }) => theme.breakpoints.down('lg')} {
        flex-direction: column;
        height: auto;
        padding: 0 30px;
        gap: 40px;
    }
`;

export const BusImgBox = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;

    img {
        width: 75%;
        height: auto;
    }

    ${({ theme }) => theme.breakpoints.down('lg')} {
        grid-row-start: 1;
        grid-row-end: 3;

        img {
            width: 100%;
        }
    }
`;

export const BusList = styled.ul`
    display: none;
    justify-content: space-between;
    gap: 10px;
    grid-column-start: 1;
    grid-column-end: 3;
    opacity: 0;

    li {
        width: 100%;
        padding: 10px 0;
        font-size: 24px;
        letter-spacing: -0.75px;
        color: #db661b;
        text-align: center;
        border-radius: 5px;
        border: 1px solid #db661b;

        &:hover {
            background-color: rgba(255, 255, 255, 0.7);
        }
    }

    ${({ theme }) => theme.breakpoints.down('lg')} {
        display: inline-flex;
        grid-column-start: 2;
        opacity: 1;

        li {
            padding: 5px 0;
        }
    }
`;

export const BusMenuItem = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
    width: 100%;
    height: 300px;
    cursor: pointer;
    border: 1px solid transparent;

    ${BusImgBox},
    p {
        transition: all 0.4s ease;
    }

    p {
        font-size: 36px;
        letter-spacing: -0.75px;
    }

    &:hover {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        padding: 15px;
        border: 1px solid #db661b;
        border-radius: 12px;
        background-color: rgba(127, 127, 127, 0.12);

        ${BusImgBox} {
            transform: translateX(-10px);
            width: 180px;

            img {
                width: 100%;
            }
        }

        p {
            grid-column-start: 2;
            grid-column-end: 3;
            width: 100%;
            transform: translateX(10px);
        }

        ${BusList} {
            display: flex;
            opacity: 1;
        }
    }

    ${({ theme }) => theme.breakpoints.down('lg')} {
        display: grid;
        grid-template-columns: 125px 1fr;
        grid-row-gap: 5px;
        height: auto;
    }
`;
