'use client';

import React, { useEffect, useState } from 'react';
import {
    Box,
    Modal,
    Typography,
    IconButton,
    TextField,
    Button,
    MenuItem,
    Select,
    InputLabel,
    FormControl
} from '@mui/material';
import { Send } from '@mui/icons-material';
import ModalBase from '@/components/common/ModalBase';
import { COLORS_DARK } from '@/data';
import { useContactMutation } from '@/apis/contact/contact-api';
import { ContactType, ContactModalProps, ContactFormData, ContactSendForm } from '@/types/contact';
import { snackBarAtom } from '@/atom/common-atom';
import { useAtom } from 'jotai';

export function ContactModal({ isOpen, onClose, contactType }: ContactModalProps) {
    const [selectedContactType, setSelectedContactType] = useState<ContactType>(contactType || 'bug-report');
    const [formData, setFormData] = useState<ContactFormData>({ contact: '', email: '', content: '' });
    const [, setSnackBar] = useAtom(snackBarAtom);

    const formMap = new Map<ContactType, ContactSendForm>([
        [
            'bug-report',
            {
                username: '🚨 장애 신고',
                avatar_url:
                    'https://ax40oxk5pwva.objectstorage.ap-chuncheon-1.oci.customer-oci.com/p/ggBWzbdG5d85FYMMw0ox2fgAuITiYbFVcSJRa2f4is_rp69RHi1H3-HSMMUpU1el/n/ax40oxk5pwva/b/BreadFiles/o/images/logo/pullmanPadding.png',
                embeds: [
                    {
                        title: '🚨 장애 신고 도착!',
                        color: 16733525,
                        fields: [
                            {
                                name: '📝 내용',
                                value: formData.content,
                                inline: false
                            }
                        ],
                        footer: {
                            text: `더존빵돌이(Web) > ${window.location.pathname}`
                        }
                    }
                ]
            }
        ],
        [
            'join-request',
            {
                username: '💕 프로젝트 합류 문의',
                avatar_url:
                    'https://ax40oxk5pwva.objectstorage.ap-chuncheon-1.oci.customer-oci.com/p/ggBWzbdG5d85FYMMw0ox2fgAuITiYbFVcSJRa2f4is_rp69RHi1H3-HSMMUpU1el/n/ax40oxk5pwva/b/BreadFiles/o/images/logo/pullmanPadding.png',
                embeds: [
                    {
                        title: '📨 프로젝트 합류 문의 도착!',
                        color: 3447003,
                        fields: [
                            {
                                name: '📞 연락처',
                                value: formData.contact,
                                inline: true
                            },
                            {
                                name: '✉️ 이메일',
                                value: formData.email,
                                inline: true
                            },
                            {
                                name: '📝 내용',
                                value: formData.content,
                                inline: false
                            }
                        ],
                        footer: {
                            text: `더존빵돌이(Web) > ${window.location.pathname}`
                        }
                    }
                ]
            }
        ],
        [
            'other',
            {
                username: '📬 기타 문의',
                avatar_url:
                    'https://ax40oxk5pwva.objectstorage.ap-chuncheon-1.oci.customer-oci.com/p/ggBWzbdG5d85FYMMw0ox2fgAuITiYbFVcSJRa2f4is_rp69RHi1H3-HSMMUpU1el/n/ax40oxk5pwva/b/BreadFiles/o/images/logo/pullmanPadding.png',
                embeds: [
                    {
                        title: '📨 문의 도착!',
                        color: 10181046,
                        fields: [
                            {
                                name: '📞 연락처',
                                value: formData.contact || '-',
                                inline: true
                            },
                            {
                                name: '✉️ 이메일',
                                value: formData.email || '-',
                                inline: true
                            },
                            {
                                name: '📝 내용',
                                value: formData.content || '-',
                                inline: false
                            }
                        ],
                        footer: {
                            text: `더존빵돌이(Web) > ${window.location.pathname}`
                        }
                    }
                ]
            }
        ]
    ]);

    const submitMutation = useContactMutation({
        onSuccess: () => {
            setSnackBar({
                message: '문의가 성공적으로 전송되었습니다!',
                open: true,
                severity: 'success'
            });
            setFormData({ contact: '', email: '', content: '' });
        },
        onError: () => {
            setSnackBar({
                message: '문의 전송에 실패했습니다. 다시 시도해주세요.',
                open: true,
                severity: 'error'
            });
        }
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        submitMutation.mutate({
            type: selectedContactType,
            formData: formMap.get(selectedContactType) as ContactSendForm
        });
    };

    const getTitle = () => {
        switch (selectedContactType) {
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
        switch (selectedContactType) {
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
                    value={selectedContactType}
                    onChange={e => setSelectedContactType(e.target.value as ContactType)}
                    label="문의 유형"
                    sx={{
                        bgcolor: '#334155',
                        color: 'white',
                        '& .MuiOutlinedInput-notchedOutline': { borderColor: '#475569' },
                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#94a3b8' }
                    }}
                    readOnly={!!contactType}
                >
                    <MenuItem value="bug-report">🐛 장애신고</MenuItem>
                    <MenuItem value="join-request">🤝 합류신청</MenuItem>
                    <MenuItem value="other">💬 기타</MenuItem>
                </Select>
            </FormControl>

            {selectedContactType && (
                <form onSubmit={handleSubmit}>
                    {(selectedContactType === 'join-request' || selectedContactType === 'other') && (
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

                    {(selectedContactType === 'join-request' || selectedContactType === 'other') && (
                        <TextField
                            fullWidth
                            label="이메일"
                            placeholder="example@email.com"
                            value={formData.email}
                            onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                            required={selectedContactType === 'join-request'}
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
                            selectedContactType === 'bug-report'
                                ? '어떤 문제가 발생했는지 자세히 설명해주세요...'
                                : selectedContactType === 'join-request'
                                  ? '어떤 분야에서 기여하고 싶은지 알려주세요...'
                                  : '궁금한 점이나 의견을 적어주세요...'
                        }
                        value={formData.content}
                        onChange={e => setFormData(prev => ({ ...prev, content: e.target.value }))}
                        required
                        multiline
                        rows={3}
                        sx={{ mb: 3 }}
                        slotProps={{
                            input: {
                                style: { color: 'white', fontSize: '16px' },
                                inputProps: { maxLength: 50 }
                            },
                            inputLabel: {
                                style: { color: 'white' }
                            }
                        }}
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

            <Typography variant="caption" color="#94a3b8" mt={3} display="block" textAlign="center">
                문의해주신 내용은 빠른 시일 내에 검토 후 답변드리겠습니다.
            </Typography>
        </ModalBase>
    );
}
