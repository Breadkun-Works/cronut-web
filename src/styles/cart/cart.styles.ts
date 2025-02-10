import styled from 'styled-components';

export const CartWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
    max-width: 680px'
`;

export const CartButtonWrapper = styled.button`
    background-color: #8b4513;
    border: none;
    cursor: pointer;
    border-radius: 50%;
    padding: 7px;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;

    &:active {
        transform: scale(1.3);
    }
`;

export const CartButton = styled.button`
    width: 100%;
    height: 40px;
    font-size: 16px;
    font-weight: bold;
    border-radius: 5px;
    border: 1px solid #8b4513;
    box-sizing: border-box;
    background-color: #8b4513;
    color: #fff;
    padding: 0 10px;
    text-align: center;
    margin: 20px 0;
`;
