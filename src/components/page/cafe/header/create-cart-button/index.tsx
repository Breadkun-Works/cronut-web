'use client';

import { useState, useEffect } from 'react';
import { Button, Box, Badge } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Plus } from 'lucide-react';
import { styled } from '@mui/material/styles';
import { COLORS_DARK } from '@/data';
import { useRouter } from 'next/navigation';

interface HeaderCartButtonProps {
    itemCount?: number;
}

const StyledButton = styled(Button)(({ theme }) => ({
    backgroundColor: COLORS_DARK.accent.dark,
    color: 'white',
    borderRadius: '30px',
    padding: '8px 16px',
    boxShadow: '0 4px 10px rgba(207, 117, 0, 0.5)',
    transition: 'all 0.3s ease',
    '&:hover': {
        backgroundColor: COLORS_DARK.accent.dark,
        boxShadow: '0 6px 12px rgba(207, 117, 0, 0.7)',
        transform: 'translateY(-2px)'
    }
}));

// 펄스 애니메이션을 위한 컴포넌트
const PulseEffect = styled(motion.div)({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: '30px',
    zIndex: -1
});

// 장바구니 아이콘과 + 기호를 포함하는 컨테이너
const CartIconContainer = styled(Box)({
    position: 'relative',
    display: 'inline-flex',
    width: 32, // 충분한 너비 확보
    height: 32, // 충분한 높이 확보
    alignItems: 'center',
    justifyContent: 'center'
});

// + 기호 스타일링
const PlusIcon = styled(Box)({
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#ff3d00',
    borderRadius: '50%',
    width: 16,
    height: 16,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
    zIndex: 1
});

export default function HeaderCartButton({ itemCount = 0 }: HeaderCartButtonProps) {
    const [expanded, setExpanded] = useState(false);
    const [showPulse, setShowPulse] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // 처음에는 접혀있다가 약간의 지연 후 펼치기
        const expandTimer = setTimeout(() => {
            setExpanded(true);

            // 3초 후에 다시 접기
            const collapseTimer = setTimeout(() => {
                setExpanded(false);

                // 접힌 후 펄스 효과 중지
                setTimeout(() => {
                    setShowPulse(false);
                }, 500);
            }, 3000);

            return () => clearTimeout(collapseTimer);
        }, 500);

        return () => clearTimeout(expandTimer);
    }, []);

    return (
        <Box sx={{ position: 'relative', paddingRight: '10px' }}>
            {/* 펄스 효과 */}
            {showPulse && (
                <PulseEffect
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.7, 0.3, 0.7]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: 'loop'
                    }}
                    style={{ backgroundColor: 'rgba(207, 117, 0, 0.3)' }}
                />
            )}

            <StyledButton sx={{ paddingRight: 2.5 }}>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        overflow: 'visible', // 오버플로우를 visible로 변경
                        position: 'relative'
                    }}
                >
                    <AnimatePresence initial={false}>
                        {expanded && (
                            <motion.div
                                initial={{ width: 0, opacity: 0, marginRight: 0 }}
                                animate={{
                                    width: 'auto',
                                    opacity: 1,
                                    marginRight: 1.5, // 여백 증가
                                    transition: {
                                        duration: 0.5,
                                        type: 'spring',
                                        stiffness: 100
                                    }
                                }}
                                exit={{
                                    width: 0,
                                    opacity: 0,
                                    marginRight: 0,
                                    transition: {
                                        duration: 0.5,
                                        type: 'spring',
                                        stiffness: 100
                                    }
                                }}
                                style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}
                            >
                                장바구니를 생성해보세요~
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <motion.div
                        animate={expanded ? { scale: 1 } : { scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.5, delay: expanded ? 0 : 0.5 }}
                        style={{ marginRight: 4 }} // 오른쪽 여백 추가
                    >
                        <CartIconContainer
                            onClick={() => {
                                router.push('/cafe/cart');
                            }}
                        >
                            <ShoppingCart size={22} /> {/* 아이콘 크기 약간 줄임 */}
                            <PlusIcon>
                                <Plus size={10} strokeWidth={3} />
                            </PlusIcon>
                            {itemCount > 0 && (
                                <Badge
                                    badgeContent={itemCount}
                                    color="error"
                                    sx={{
                                        position: 'absolute',
                                        bottom: -5,
                                        left: -5,
                                        '& .MuiBadge-badge': {
                                            backgroundColor: '#ff3d00',
                                            color: 'white'
                                        }
                                    }}
                                />
                            )}
                        </CartIconContainer>
                    </motion.div>
                </Box>
            </StyledButton>
        </Box>
    );
}
