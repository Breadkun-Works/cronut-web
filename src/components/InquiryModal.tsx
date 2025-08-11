'use client';

import React, { useState } from 'react';
import { Box, Typography, TextField, Button, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { Send } from '@mui/icons-material';
import ModalBase from '@/components/common/ModalBase';
import { COLORS_DARK } from '@/data';
import { useInquiryMutation } from '@/apis/contact/contact-api';
import { InquiryModalProps, InquiryType, InquiryFormData } from '@/types/contact';
import { snackBarAtom } from '@/atom/common-atom';
import { useAtom } from 'jotai';
import { FooterText } from '@/styles/components/InquiryModal.styles';

export function InquiryModal({ isOpen, onClose, inquiryType }: InquiryModalProps) {
    const [selectedInquiryType, setSelectedInquiryType] = useState<InquiryType>(inquiryType || 'bug-report');
    const [formData, setFormData] = useState<InquiryFormData>({ contact: '', email: '', content: '' });
    const [, setSnackBar] = useAtom(snackBarAtom);

    const submitMutation = useInquiryMutation({
        onSuccess: () => {
            setSnackBar({
                message: '문의가 성공적으로 전송되었습니다!',
                open: true,
                severity: 'success'
            });
            setFormData({ contact: '', email: '', content: '' });
        },
        onError: (error: any) => {
            setSnackBar({
                message: error.response.data.error,
                open: true,
                severity: 'error'
            });
        }
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        submitMutation.mutate({
            type: selectedInquiryType,
            formData: formData
        });
    };

    const getTitle = () => {
        switch (selectedInquiryType) {
            case 'bug-report':
                return '장애 신고';
            case 'join-request':
                return '합류 신청';
            case 'other':
                return '기타 문의';
            default:
                return '문의 유형을 선택해주세요';
        }
    };

    const getDescription = () => {
        switch (selectedInquiryType) {
            case 'bug-report':
                return '발견하신 문제점을 자세히 알려주세요.';
            case 'join-request':
                return '연락처와 이메일을 함께 남겨주세요.';
            case 'other':
                return '궁금한 점이나 의견을 남겨주세요.';
            default:
                return '어떤 도움이 필요하신가요?';
        }
    };

    return (
        <ModalBase open={isOpen} onClose={onClose} title={'빵돌이 문의'}>
            <Typography variant="h6" gutterBottom sx={{ mb: 1 }}>
                {getTitle()}
            </Typography>
            <Typography variant="body2" color="#cbd5e1" mb={3}>
                {getDescription()}
            </Typography>

            <FormControl fullWidth sx={{ mb: 1 }}>
                <InputLabel id="contact-type-label" sx={{ color: 'white' }}>
                    문의 유형
                </InputLabel>
                <Select
                    labelId="contact-type-label"
                    value={selectedInquiryType}
                    onChange={e => setSelectedInquiryType(e.target.value as InquiryType)}
                    label="문의 유형"
                    sx={{
                        bgcolor: '#334155',
                        color: 'white',
                        '& .MuiOutlinedInput-notchedOutline': { borderColor: '#475569' },
                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#94a3b8' }
                    }}
                    readOnly={!!inquiryType}
                >
                    <MenuItem value="bug-report">🐛 장애신고</MenuItem>
                    <MenuItem value="join-request">🤝 합류신청</MenuItem>
                    <MenuItem value="other">💬 기타</MenuItem>
                </Select>
            </FormControl>

            {selectedInquiryType && (
                <form onSubmit={handleSubmit}>
                    {(selectedInquiryType === 'join-request' || selectedInquiryType === 'other') && (
                        <TextField
                            fullWidth
                            label="연락처"
                            placeholder="010-0000-0000"
                            value={formData.contact}
                            sx={{ mb: 1 }}
                            onChange={e => {
                                const numericValue = e.target.value.replace(/[^0-9-]/g, '');
                                setFormData(prev => ({ ...prev, contact: numericValue }));
                            }}
                            type="tel"
                            slotProps={{
                                input: {
                                    inputProps: { inputMode: 'numeric', pattern: '[0-9]*', maxLength: 13 },
                                    style: { color: 'white', fontSize: '16px' }
                                },
                                inputLabel: {
                                    style: { color: 'white' }
                                }
                            }}
                        />
                    )}

                    {(selectedInquiryType === 'join-request' || selectedInquiryType === 'other') && (
                        <TextField
                            fullWidth
                            label="이메일"
                            placeholder="example@email.com"
                            value={formData.email}
                            onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                            required={selectedInquiryType === 'join-request'}
                            sx={{ mb: 1 }}
                            slotProps={{
                                input: {
                                    inputProps: { inputMode: 'email' },
                                    style: { color: 'white', fontSize: '16px' }
                                },
                                inputLabel: {
                                    style: { color: 'white' }
                                }
                            }}
                        />
                    )}

                    <TextField
                        fullWidth
                        label="내용"
                        placeholder={
                            selectedInquiryType === 'bug-report'
                                ? '어떤 문제가 발생했는지 자세히 설명해주세요...'
                                : selectedInquiryType === 'join-request'
                                  ? '어떤 분야에서 기여하고 싶은지 알려주세요...'
                                  : '궁금한 점이나 의견을 적어주세요...'
                        }
                        value={formData.content}
                        onChange={e => setFormData(prev => ({ ...prev, content: e.target.value }))}
                        required
                        multiline
                        rows={3}
                        sx={{
                            mb: 3,
                            position: 'relative',

                            '.MuiInputBase-colorPrimary': {
                                padding: '16px 14px 25px 14px'
                            },
                            '.MuiFormHelperText-root': {
                                position: 'absolute',
                                bottom: '5px',
                                right: '14px',
                                margin: '0'
                            }
                        }}
                        slotProps={{
                            input: {
                                style: { color: 'white', fontSize: '16px' },
                                inputProps: { maxLength: 500 }
                            },
                            inputLabel: {
                                style: { color: 'white' }
                            }
                        }}
                        helperText={`${formData.content.length}/500`}
                    />

                    <Box display="flex" gap={2}>
                        <Button
                            onClick={onClose}
                            variant="outlined"
                            fullWidth
                            sx={{ color: '#cbd5e1', borderColor: '#475569' }}
                        >
                            취소
                        </Button>
                        <Button
                            type="submit"
                            disabled={submitMutation.isPending || !formData.content.trim()}
                            variant="contained"
                            fullWidth
                            sx={{
                                color: COLORS_DARK.text.primary,
                                bgcolor: COLORS_DARK.accent.main,
                                '&:hover': { bgcolor: COLORS_DARK.accent.dark }
                            }}
                            startIcon={!submitMutation.isPending ? <Send fontSize="small" /> : null}
                        >
                            {submitMutation.isPending ? '전송 중...' : '전송하기'}
                        </Button>
                    </Box>
                </form>
            )}

            <FooterText>
                문의해주신 내용은 빠른 시일 내에 <br />
                검토 후 답변드리겠습니다.
            </FooterText>
        </ModalBase>
    );
}
