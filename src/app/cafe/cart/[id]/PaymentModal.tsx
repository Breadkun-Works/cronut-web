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
    Divider,
} from '@mui/material';
import { Copy, Check, ScanQrCode } from 'lucide-react';

export default function PaymentModal({ open, setOpen, cafeAccount, totalPrice, handlePayment }: any) {
    const [tab, setTab] = useState('bank');
    const [copied, setCopied] = useState(false);

    const copyAccountNumber = () => {
        navigator.clipboard.writeText(cafeAccount.accountNumber);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
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
                                {copied ? '복사됨' : '복사하기'}
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
                                position: 'relative'
                            }}
                            elevation={1}
                        >
                            <ScanQrCode size={100} />
                            <Box
                                sx={{
                                    position: 'absolute',
                                    inset: 0,
                                    bgcolor: 'rgba(255,255,255,0.8)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: 1
                                }}
                            >
                                <Typography color="black">QR 코드 스캔</Typography>
                            </Box>
                        </Paper>
                        <Typography variant="body2" color="gray">
                            QR 코드를 스캔하여 이체를 진행해주세요.
                        </Typography>
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
                    sx={{ bgcolor: '#8B4513', ':hover': { bgcolor: '#6B3410' } }}
                >
                    주문 완료
                </Button>
            </DialogActions>
        </Dialog>
    );
}
