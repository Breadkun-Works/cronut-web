'use client';
import { CartButton, PageWrapper, CartContainer } from '@/styles/cart/cart.styles';
import React, { useState } from 'react';
import { useConditionalTimeout } from '@/utils/util';
import { useCreateCart } from '@/apis/cafe/cafe-api';
import { useCompanyContext } from '@/context/CompanyContext';
import NotificationBox from '@/components/NotificationBox';
import { useRouter } from 'next/navigation';
import styled from '@emotion/styled';
import {
    Box,
    FormControl,
    FormControlLabel,
    InputLabel,
    MenuItem,
    Radio,
    RadioGroup,
    Select,
    TextField,
    Typography
} from '@mui/material';
import { CompanySelect } from '@/components/CompanySelect';
type PaymentType = 'treat' | 'dutch';

const CssTextField = styled(TextField)({
    '& .MuiInputBase-root, & .MuiOutlinedInput-root, & .MuiFilledInput-root': {
        color: '#fff',
        fontSize: '16px',
        backgroundColor: '#333',
        '&:hover': {
            backgroundColor: '#444'
        },
        '&.Mui-focused': {
            backgroundColor: '#555'
        }
    },
    '& label, & label.Mui-focused': {
        color: '#fff'
    },
    '& .MuiInput-underline:after, & .MuiFilledInput-underline:after': {
        borderBottomColor: '#fff'
    }
});

const CartPage = () => {
    const [newCart, setNewCart] = useState({ title: '', description: '' });
    const [paymentType, setPaymentType] = useState<PaymentType>('treat');
    const [bankName, setBankName] = useState('');
    const [accountNumber, setAccountNumber] = useState('');

    const { company } = useCompanyContext(); // company와 setCompany를 가져옵니다.
    const router = useRouter();

    const { mutate, isPending, isSuccess } = useCreateCart({
        onSuccess: data => {
            const option = paymentType === 'dutch' ? `?accountNumber=${accountNumber}&bankName=${bankName}` : '';
            router.push(`/cafe/cart/redirect/${data.data.cafeCart.id}${option}`);
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
    /* 추가 및 수정해야됨 */
    const banks = ['토스뱅크', '국민은행', '신한은행', '우리은행', '하나은행', '농협은행'];

    return (
        <PageWrapper>
            <CompanySelect />
            <div className={'cart-wrapper'}>
                <CartContainer>
                    <div style={{ fontSize: '20px', margin: '20px 0', textAlign: 'center' }}>
                        음료 주문을 시작합니다.
                        <br />
                        주문서는 생성 후 <span style={{ fontWeight: 'bold', textDecoration: 'underline' }}>3시간</span>
                        동안 사용 가능합니다.
                        <br />
                        <br />
                        장바구니 이름을 입력해주세요.
                    </div>
                    <CssTextField
                        label="이름"
                        value={newCart.title}
                        onChange={e => setNewCart({ ...newCart, title: e.target.value })}
                        sx={{
                            width: '100%',
                            mt: 2
                        }}
                    />
                    <CssTextField
                        label="설명"
                        variant="filled"
                        value={newCart.description}
                        onChange={e => setNewCart({ ...newCart, description: e.target.value })}
                        sx={{
                            width: '100%',
                            my: 2
                        }}
                    />
                    <Box sx={{ width: '100%', border: '1px solid #383838', borderRadius: 2, p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            결제 방식
                        </Typography>

                        <RadioGroup
                            value={paymentType}
                            onChange={e => setPaymentType(e.target.value as PaymentType)}
                            row
                            sx={{ gap: 2, mb: 2 }}
                        >
                            <FormControlLabel value="treat" control={<Radio />} label="제가 살게요" />
                            <FormControlLabel value="dutch" control={<Radio />} label="각자 계산할게요" />
                        </RadioGroup>

                        {paymentType === 'dutch' && (
                            <Box sx={{ mt: 2, p: 2, bgcolor: '#1C1F21', borderRadius: 2 }}>
                                <Typography variant="subtitle2" gutterBottom>
                                    계좌 정보 입력
                                </Typography>

                                <FormControl fullWidth sx={{ mt: 2 }}>
                                    <InputLabel id="bank-label">은행</InputLabel>
                                    <Select
                                        labelId="bank-label"
                                        value={bankName}
                                        label="은행"
                                        onChange={e => setBankName(e.target.value)}
                                        sx={{ bgcolor: '#2C2F31', borderColor: '#383838' }}
                                        MenuProps={{
                                            PaperProps: {
                                                sx: {
                                                    bgcolor: '#2C2F31',
                                                    color: 'white'
                                                }
                                            }
                                        }}
                                    >
                                        {banks.map(bank => (
                                            <MenuItem key={bank} value={bank}>
                                                {bank}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <TextField
                                    fullWidth
                                    label="계좌번호"
                                    placeholder="계좌번호를 입력하세요 (- 없이)"
                                    value={accountNumber}
                                    onChange={e => setAccountNumber(e.target.value)}
                                    sx={{
                                        fontSize: '16px',
                                        bgcolor: '#2C2F31',
                                        borderColor: '#383838',
                                        mt: 2,
                                        input: { color: 'white' }
                                    }}
                                />
                            </Box>
                        )}
                    </Box>
                    <CartButton onClick={handleCreateCart}>주문하기</CartButton>
                </CartContainer>
            </div>
            {showLoading && <NotificationBox firstText={'장바구니 생성 중...'} secText={'잠시만 기다려 주세요.'} />}
        </PageWrapper>
    );
};

export default CartPage;
