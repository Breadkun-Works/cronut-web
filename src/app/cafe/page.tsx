'use client';
import { CartButtonWrapper, CartWrapper, CartButton } from '@/styles/cart/cart.styles';
import styled from 'styled-components';

const CartPage = () => {
    return (
        <CartWrapper>
            <CartButtonWrapper>
                <CartButton>주문하기</CartButton>
            </CartButtonWrapper>
        </CartWrapper>
    );
};

export default CartPage;
