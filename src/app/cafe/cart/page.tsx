'use client';
import { CartWrapper, CartButton, PageWrapper, CartTitle } from '@/styles/cart/cart.styles';
import styled from 'styled-components';
import React, { useState } from 'react';
import { getPlaceholderText } from '@/utils/util';
import { useCreateCart } from '@/apis/cafe/cafe-api';
import { useCompanyContext } from '@/context/CompanyContext';
import CompanySelector from '@/app/CompanySelect';
import Image from 'next/image';
import { companyDropdownItem } from '@/types/common';
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
    const { company } = useCompanyContext(); // company와 setCompany를 가져옵니다.

    const { mutate, isError, isPending } = useCreateCart({
        onSuccess: data => {
            console.log('성공:', data);
        },
        onError: error => {
            console.error('실패:', error.response?.data);
        }
    });

    const handleCreateCart = () => {
        mutate({
            cafeLocation: company,
            title: newCartName,
            description: ''
        });
    };

    return (
        <PageWrapper>
            <CartTitle>
                <Image className={'title__icon'} src="/icon/home-title-icon.webp" alt="title" width={22} height={22} />
                <div className={'title__select'}>
                    <div className={'title__letter'}>{companyDropdownItem.find(c => c.value === company)?.label}</div>
                    <CompanySelector />
                    <Image
                        className={'title__select-button'}
                        src="/icon/home-select-arrow.webp"
                        alt="dropdown-button"
                        width={10}
                        height={7.3}
                    />
                </div>
            </CartTitle>

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
        </PageWrapper>
    );
};

export default CartPage;
