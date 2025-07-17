'use client';

import { CartButton, PageWrapper, CartContainer } from '@/styles/cart/cart.styles';
import React, { useState, useEffect } from 'react';
import { useCreateCart } from '@/apis/cafe/cafe-api';
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
import { useDynamicTitle, useResponsive } from '@/utils/hook';
import { useAtom } from 'jotai';
import { companyAtom, snackBarAtom } from '@/atom/common-atom';
import { COLORS_DARK } from '@/data';

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

export const CartPage = () => {
    useDynamicTitle(`장바구니`);
    const { isMobile } = useResponsive();

    const [newCart, setNewCart] = useState({ title: '', description: '' });
    const [paymentType, setPaymentType] = useState<PaymentType>('treat');
    const [bankName, setBankName] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const [company] = useAtom(companyAtom);
    const [, setSnackBar] = useAtom(snackBarAtom);
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

    useEffect(() => {
        if (isPending) {
            setIsLoading(true);
        } else if (isSuccess) {
            const timer = setTimeout(() => {
                setIsLoading(false);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [isPending, isSuccess]);

    const handleCreateCart = () => {
        if (!validateForm()) {
            return;
        }
        mutate({
            cafeLocation: company,
            title: newCart.title,
            ...(newCart.description && { description: newCart.description })
        });
    };
    const validateForm = () => {
        if (!newCart.title.trim()) {
            setSnackBar({ open: true, message: '장바구니의 이름을 입력해주세요', severity: 'warning' });
            return false;
        }
        if (paymentType === 'dutch' && (!bankName || !accountNumber)) {
            setSnackBar({ open: true, message: '계좌 정보를 입력해주세요', severity: 'warning' });

            return false;
        }
        return true;
    };
    /* 추가 및 수정해야됨 */
    const banks = ['토스뱅크', '국민은행', '신한은행', '우리은행', '하나은행', 'NH농협'];

    return (
        <PageWrapper>
            <Box margin={isMobile ? '10px 16px' : '20px 30px'}>
                <CompanySelect entry={'cafe'} />
            </Box>
            <div className={'cart-wrapper'}>
                <CartContainer>
                    <div style={{ fontSize: '1.3rem', margin: '20px 0', textAlign: 'center' }}>
                        음료 주문을 시작합니다 🎉
                        <br />
                        <p
                            style={{
                                fontSize: '1.1rem',
                                whiteSpace: 'pre-line',
                                textAlign: 'center',
                                lineHeight: 1.5,
                                wordBreak: 'keep-all'
                            }}
                        >
                            생성 후{' '}
                            <span style={{ fontWeight: 'bold', textDecoration: 'underline' }}>
                                <span style={{ fontSize: '1.2rem', color: COLORS_DARK.accent.light }}>3</span>시간
                            </span>
                            동안 사용 가능합니다
                        </p>
                    </div>
                    <CssTextField
                        label="장바구니 이름"
                        value={newCart.title}
                        onChange={e => setNewCart({ ...newCart, title: e.target.value })}
                        sx={{
                            width: '100%',
                            mt: 2
                        }}
                        required
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
                                    onChange={e => {
                                        const numericValue = e.target.value.replace(/\D/g, '');
                                        setAccountNumber(numericValue);
                                    }}
                                    type="tel"
                                    inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
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
                    <CartButton onClick={handleCreateCart} disabled={isPending}>
                        장바구니 생성하기
                    </CartButton>
                </CartContainer>
            </div>
            {isLoading && <NotificationBox firstText={'장바구니 생성 중...'} secText={'잠시만 기다려 주세요.'} />}
        </PageWrapper>
    );
};
