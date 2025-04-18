'use client';

import { Backdrop, Box, Divider, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useEffect } from 'react';
import { COLORS_DARK } from '@/data';
import { Link } from 'lucide-react';
import Image from 'next/image';

export function ShareCartDialog({
    open,
    onClose,
    cartTitle
}: Readonly<{
    open: boolean;
    onClose(): void;
    cartTitle: string;
}>) {
    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.between('xs', 'sm')); // <360
    const isMd = useMediaQuery(theme.breakpoints.between('sm', 'md')); // 360 ~ 479

    const iconSize = isSm ? 24 : 28;
    const fontSize = isSm ? 12 : 14;
    const paddingY = isSm ? 1.5 : 2;
    const gap = isSm ? 1.5 : 2;

    const handleLinkShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: '빵돌이 장바구니',
                    text: `[${cartTitle}]에 놀러오세요~!☕️🍞🥐`,
                    url: window.location.href
                });
            } catch (err) {
                console.error('공유 취소 또는 오류', err);
            }
        } else {
            try {
                await navigator.clipboard.writeText(window.location.href);
                alert('링크가 복사되었습니다.'); // ✅ 토스트로 바꿔도 됨
            } catch (err) {
                console.error('클립보드 복사 실패', err);
            }
        }
    };

    const handleAmaranthShare = (message: string) => {
        const payload = {
            type: 'MSG',
            data: {
                recvEmpSeq: [],
                content: message
            }
        };

        const base64 = btoa(
            encodeURIComponent(JSON.stringify(payload)).replace(/%([0-9A-F]{2})/g, (_, p1) =>
                String.fromCharCode(parseInt(p1, 16))
            )
        );

        const shareUrl = `amaranth10://amaranth10/write?${base64}`;

        window.open(shareUrl);
    };

    useEffect(() => {
        if (!isSm && !isMd && open) {
            onClose();
        }
    }, [isSm, isMd, open]);

    if (!open) return null;

    return (
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
                    onClick={handleLinkShare}
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

                <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255,255,255,0.1)', mx: 0.5 }} />

                {/* 아마란스 쪽지 공유 */}
                <Box
                    onClick={() => handleAmaranthShare(`${cartTitle}에 초대합니다! 음료를 담아주세요!`)}
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
                        style={{
                            width: iconSize,
                            height: iconSize,
                            objectFit: 'contain'
                        }}
                    />
                    <Typography sx={{ mt: 1, fontSize, textAlign: 'center' }}>
                        아마란스
                        <br /> 쪽지 공유
                    </Typography>
                </Box>
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
    );
}
