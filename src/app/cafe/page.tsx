'use client';
import { CartWrapper, CartButton } from '@/styles/cart/cart.styles';
import styled from 'styled-components';
import React, { useState } from 'react';
import { getPlaceholderText } from '@/utils/util';
import { useCreateCart } from '@/apis/cafe/cafe-api';
const Input = styled.input`
    width: 100%;
    height: 40px;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 0 10px;
    box-sizing: border-box;
`;

const CartPage = () => {
    const [newCartName, setNewCartName] = useState('');

    const { mutate, isError, isPending } = useCreateCart({
        onSuccess: data => {
            console.log('✅ 성공:', data);
        },
        onError: error => {
            console.error('❌ 실패:', error.response?.data);
        }
    });

    const handleCreateCart = () => {
        mutate({
            cafeLocation: 'KANGCHON',
            title: newCartName,
            description: ''
        });
    };

    return (
        <CartWrapper>
            <div style={{ fontSize: '20px', margin: '20px 0' }}>장바구니 이름을 입력해주세요.</div>
            <Input
                type="text"
                placeholder={getPlaceholderText('이름')}
                value={newCartName}
                onChange={e => setNewCartName(e.target.value)}
            />
            <CartButton>주문하기</CartButton>
        </CartWrapper>
    );
};

export default CartPage;
