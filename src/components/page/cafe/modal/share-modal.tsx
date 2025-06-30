'use client';

import { Backdrop, Box, Divider, Snackbar, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { COLORS_DARK } from '@/data';
import { Link } from 'lucide-react';
import Image from 'next/image';
import { useResponsive } from '@/utils/hook';
import { isMobileDevice } from '@/utils/util';

export function ShareCartDialog({
    open,
    onClose,
    cartTitle,
    showToast
}: Readonly<{
    open: boolean;
    onClose(): void;
    cartTitle: string;
    showToast(message: string, variant: 'success' | 'error'): void;
}>) {
    const { isSmall } = useResponsive();

    const iconSize = isSmall ? 24 : 28;
    const fontSize = isSmall ? 12 : 14;
    const paddingY = isSmall ? 1.5 : 2;
    const gap = isSmall ? 1.5 : 2;

    const [snackbar, setSnackbar] = useState({ open: false, message: '' });

    const handleLinkShare = async (e: React.MouseEvent<HTMLDivElement>) => {
        const shareCartData = {
            text: `[더존 빵돌이] 띵동🛎️~ 빵돌이의 장바구니 도착!\n\n🛒 ${cartTitle} 장바구니에 입장해주세요~!☕️🍞🥐`,
            url: window.location.href
        };

        if (!navigator.canShare) {
            e.stopPropagation();
            const url = window.location.href;

            try {
                await navigator.clipboard.writeText(url).then(() => {
                    showToast('🔗 링크가 복사되었습니다!', 'success');
                });
            } catch (err) {
                showToast('❌ 복사에 실패했어요 😢', 'error');
            } finally {
                onClose();
            }
        } else if (navigator.canShare(shareCartData)) {
            try {
                await navigator.share(shareCartData);
            } catch (err) {
                showToast('❌ 복사에 실패했어요 😢', 'error');
            } finally {
                onClose();
            }
        }
    };

    const handleAmaranthShare = () => {
        const payload = {
            type: 'MSG',
            data: {
                recvEmpSeq: [],
                content: `띵동🛎️~ 빵돌이의 장바구니 도착!\n\n🛒 ${cartTitle} 장바구니에 입장해주세요~!☕️🍞🥐\n   👉 ${window.location.href}`
            }
        };

        const base64 = btoa(
            encodeURIComponent(JSON.stringify(payload)).replace(/%([0-9A-F]{2})/g, (_, p1) =>
                String.fromCharCode(parseInt(p1, 16))
            )
        );

        const shareUrl = `amaranth10://amaranth10/write?${base64}`;

        const win = window.open(shareUrl, '_blank', 'noopener,noreferrer');
        if (win) {
            onClose();
        }
    };

    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (window.innerWidth >= 480 && open) {
            onClose();
        }
    }, [window.innerWidth, open]);

    if (!open) return null;

    console.log(open);

    return (
        <>
            <Backdrop
                open={open}
                onClick={onClose}
                sx={{
                    zIndex: 1300,
                    backgroundColor: 'rgba(0, 0, 0, 0.75)',
                    color: '#fff',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    px: 2,
                    py: 4
                }}
            >
                {/* 공유 버튼 박스 */}
                <Box
                    onClick={e => e.stopPropagation()}
                    sx={{
                        backgroundColor: COLORS_DARK.background.main,
                        borderRadius: '24px',
                        border: '1px solid rgba(255,255,255,0.1)',
                        padding: '16px 20px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                        display: 'flex',
                        justifyContent: 'center',
                        gap,
                        width: '90%',
                        maxWidth: 400
                    }}
                >
                    {/* 링크 공유 */}
                    <Box
                        onClick={e => handleLinkShare(e)}
                        sx={{
                            flex: 1,
                            py: paddingY,
                            borderRadius: 2,
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            '&:hover': {
                                backgroundColor: '#333'
                            }
                        }}
                    >
                        <Link style={{ width: iconSize, height: iconSize, color: COLORS_DARK.accent.main }} />
                        <Typography sx={{ mt: 1, fontSize }}>링크 공유</Typography>
                    </Box>

                    {/* 아마란스 쪽지 공유 */}
                    {isMobileDevice() && (
                        <>
                            <Divider
                                orientation="vertical"
                                flexItem
                                sx={{ borderColor: 'rgba(255,255,255,0.1)', mx: 0.5 }}
                            />
                            <Box
                                onClick={handleAmaranthShare}
                                sx={{
                                    flex: 1,
                                    py: paddingY,
                                    borderRadius: 2,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    '&:hover': {
                                        backgroundColor: '#333'
                                    }
                                }}
                            >
                                <Image
                                    src="/icon/post-thick.svg"
                                    alt="아마란스 쪽지 공유 아이콘"
                                    width={iconSize}
                                    height={iconSize}
                                    objectFit={'contain'}
                                />
                                <Typography sx={{ mt: 1, fontSize, textAlign: 'center' }}>
                                    아마란스
                                    <br /> 쪽지 공유
                                </Typography>
                            </Box>
                        </>
                    )}
                </Box>

                {/* 닫기 버튼 */}
                <Box
                    onClick={onClose}
                    sx={{
                        mt: { xs: 2, sm: 3 },
                        color: COLORS_DARK.accent.main,
                        border: `2px solid ${COLORS_DARK.accent.main}`,
                        borderRadius: 2,
                        px: { xs: 3, sm: 4 },
                        py: { xs: 0.5, sm: 1 },
                        fontSize: { xs: 12, sm: 14 },
                        fontWeight: 'bold',
                        cursor: 'pointer'
                    }}
                >
                    닫기
                </Box>
            </Backdrop>
            {snackbar.open && (
                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={2000}
                    onClose={() => setSnackbar({ open: false, message: '' })}
                    message={snackbar.message}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                    ContentProps={{
                        sx: {
                            backgroundColor: COLORS_DARK.accent.main,
                            color: '#fff',
                            fontSize: 14,
                            fontWeight: 'bold'
                        }
                    }}
                />
            )}
        </>
    );
}
