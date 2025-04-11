import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    Tabs,
    Tab,
    Box,
    Typography,
    Paper,
    Divider
} from '@mui/material';
import { Copy, Check, ScanQrCode } from 'lucide-react';
import QRCodeComponent from '@/components/QRCodeComponent';
import { useIsMobile } from '@/utils/hook';

export default function PaymentModal({ open, setOpen, cafeAccount, totalPrice, handlePayment }: any) {
    const isMobile = useIsMobile();
    const [tab, setTab] = useState('bank');
    const [copied, setCopied] = useState(false);

    const copyAccountNumber = () => {
        if (typeof navigator.clipboard === 'undefined') {
            const textArea = document.createElement('textarea');
            textArea.value = `${cafeAccount.bankName} ${cafeAccount.accountNumber}`;
            textArea.style.position = 'fixed';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();

            try {
                const successful = document.execCommand('copy');
                if (successful) {
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1500);
                }
            } catch (err) {
                console.error('링크 복사 실패', err);
            }

            document.body.removeChild(textArea);
        } else {
            navigator.clipboard
                .writeText(`${cafeAccount.bankName} ${cafeAccount.accountNumber}`)
                .then(() => {
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1500);
                })
                .catch(err => console.error('링크 복사 실패', err));
        }
    };

    return (
        <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
            <DialogTitle sx={{ bgcolor: '#2C2F31', color: 'white' }}>정산하기</DialogTitle>
            <DialogContent sx={{ bgcolor: '#2C2F31', color: 'white' }}>
                <DialogContentText sx={{ color: 'gray', mb: 2 }}>
                    정산방법을 선택하고 이체를 진행해주세요.
                </DialogContentText>

                <Tabs
                    value={tab}
                    onChange={(_, newTab) => setTab(newTab)}
                    variant="fullWidth"
                    sx={{ mb: 2, bgcolor: '#1C1F21', borderRadius: 1 }}
                >
                    <Tab label="계좌이체" value="bank" sx={{ color: 'white' }} />
                    <Tab label="토스로 보내기" value="toss" sx={{ color: 'white' }} />
                </Tabs>

                {tab === 'bank' && (
                    <Paper sx={{ p: 2, bgcolor: '#1C1F21' }} elevation={0}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Box>
                                <Typography variant="subtitle2" color="gray">
                                    입금 계좌
                                </Typography>
                                <Typography variant="body1">{cafeAccount.bankName}</Typography>
                                <Typography variant="h6" fontWeight="bold">
                                    {cafeAccount.accountNumber}
                                </Typography>
                                <Typography variant="subtitle2" color="gray">
                                    {cafeAccount.accountHolder}
                                </Typography>
                            </Box>
                            <Button
                                variant="outlined"
                                color="inherit"
                                startIcon={copied ? <Check color="green" /> : <Copy />}
                                onClick={copyAccountNumber}
                                sx={{ borderColor: 'gray', ':hover': { bgcolor: 'gray.800' } }}
                            >
                                {copied ? '복사완료' : '복사하기'}
                            </Button>
                        </Box>
                        <Divider sx={{ bgcolor: 'gray', my: 2 }} />
                        <Box>
                            <Typography variant="subtitle2" color="gray">
                                정산 금액
                            </Typography>
                            <Typography variant="h5" fontWeight="bold" align="right">
                                {totalPrice.toLocaleString()} 원
                            </Typography>
                        </Box>
                    </Paper>
                )}

                {tab === 'toss' && (
                    <Paper sx={{ p: 2, bgcolor: '#1C1F21', textAlign: 'center' }} elevation={0}>
                        {!isMobile ? (
                            <>
                                <Paper
                                    sx={{
                                        bgcolor: 'white',
                                        width: 192,
                                        height: 192,
                                        mx: 'auto',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        mb: 2,
                                        position: 'relative',
                                        p: 1
                                    }}
                                    elevation={1}
                                >
                                    <QRCodeComponent
                                        url={`supertoss://send?amount=${totalPrice}&bank=${cafeAccount.bankName}&accountNo=${cafeAccount.accountNumber}`}
                                    />
                                </Paper>
                                <Typography variant="body2" color="gray">
                                    QR 코드를 스캔하여 이체를 진행해주세요.
                                </Typography>
                            </>
                        ) : (
                            <>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                    onClick={() =>
                                        window.open(
                                            `supertoss://send?amount=${totalPrice}&bank=${cafeAccount.bankName}&accountNo=${cafeAccount.accountNumber}`,
                                            '_blank'
                                        )
                                    }
                                    sx={{
                                        borderRadius: 3,
                                        paddingX: 3,
                                        paddingY: 1.2,
                                        fontWeight: 'bold'
                                    }}
                                >
                                    토스로 송금하기
                                </Button>
                            </>
                        )}

                        <Divider sx={{ bgcolor: 'gray', my: 2 }} />
                        <Typography variant="subtitle2" color="gray">
                            정산 금액
                        </Typography>
                        <Typography variant="h5" fontWeight="bold">
                            {totalPrice.toLocaleString()} 원
                        </Typography>
                    </Paper>
                )}
            </DialogContent>

            <DialogActions sx={{ bgcolor: '#2C2F31' }}>
                <Button
                    variant="outlined"
                    color="inherit"
                    onClick={() => setOpen(false)}
                    sx={{ borderColor: 'gray', color: 'white', ':hover': { bgcolor: '#1C1F21' } }}
                >
                    취소
                </Button>
                <Button
                    variant="contained"
                    onClick={() => handlePayment(false)}
                    sx={{ bgcolor: '#8B4513', ':hover': { bgcolor: '#6B3410' }, color: 'white' }}
                >
                    주문 완료
                </Button>
            </DialogActions>
        </Dialog>
    );
}
