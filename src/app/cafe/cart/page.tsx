'use client';
import { CartButton, PageWrapper, CartTitle, CartContainer } from '@/styles/cart/cart.styles';
import styled from 'styled-components';
import React, { useState } from 'react';
import { getPlaceholderText, useConditionalTimeout } from '@/utils/util';
import { useCreateCart } from '@/apis/cafe/cafe-api';
import { useCompanyContext } from '@/context/CompanyContext';
import CompanySelector from '@/app/CompanySelect';
import Image from 'next/image';
import { companyDropdownItem } from '@/types/common';
import NotificationBox from '@/components/NotificationBox';
import { useRouter } from 'next/navigation';
import { meta } from 'eslint-plugin-react/lib/rules/jsx-props-no-spread-multi';
const Input = styled.input`
    width: 100%;
    height: 40px;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 0 10px;
    box-sizing: border-box;
`;

const CartPage = () => {
    const [newCart, setNewCart] = useState({ title: '', description: '' });
    const { company } = useCompanyContext(); // company와 setCompany를 가져옵니다.
    const router = useRouter();

    const { mutate, isError, isPending, isSuccess } = useCreateCart({
        onSuccess: data => {
            console.log('성공:', data);
            router.push(`/cafe/cart/${data.data.cafeCart.id}`);
        },
        onError: error => {
            console.error('실패:', error.response?.data);
        }
    });

    const showLoading = useConditionalTimeout(isPending && !isSuccess, 1000);

    const handleCreateCart = () => {
        mutate({
            cafeLocation: company,
            title: newCart.title,
            ...(newCart.description && { description: newCart.description })
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
            <div className={'cart-wrapper'}>
                <CartContainer>
                    <div style={{ fontSize: '20px', margin: '20px 0', textAlign: 'center' }}>
                        음료 주문을 시작합니다.
                        <br />
                        주문서는 생성 후 3시간동안 사용 가능합니다.
                        <br />
                        <br />
                        장바구니 이름을 입력해주세요.
                    </div>
                    <Input
                        type="text"
                        placeholder={getPlaceholderText('이름')}
                        value={newCart.title}
                        onChange={e => setNewCart({ ...newCart, title: e.target.value })}
                    />
                    <CartButton onClick={handleCreateCart}>주문하기</CartButton>
                </CartContainer>
            </div>
            {showLoading && <NotificationBox firstText={'장바구니 생성 중...'} secText={'잠시만 기다려 주세요.'} />}
        </PageWrapper>
    );
};

export default CartPage;
