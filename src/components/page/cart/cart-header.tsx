import { CartHeaderBtn, CartHeaderDesc, CartHeaderTitle, CartHeaderWrap } from '@/styles/cart/cart.styles';
import { Box, IconButton, Snackbar, Tooltip } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { useResponsive } from '@/utils/hook';
import { Share2 } from 'lucide-react';
import { cartItemsAtom } from '@/atom/cart-atom';
import { useAtom } from 'jotai';
import { ShareCartDialog } from '@/components/page/cafe/modal/share-modal';
import { CafeSummaryModal } from '@/components/page/cafe/modal/cafe-summary-modal';
import { EllipsisTooltip } from '@/components/common/EllipsisTooltip';
import { COLORS_DARK } from '@/data';
import { isMobileDevice } from '@/utils/util';
import { AnimatedReceiptIcon } from '@/styles/cart/menu/cart-menu.styles';
import { Stack } from '@/components/ui/Stack/Stack';
import { CartWaring } from '@/components/page/cart/cart-warning';

interface ICartHeaderProps {
    title: string;
    description: string;
    cafeLocation: string;
    snackbar: { open: boolean; message?: string; variant?: 'success' | 'error'; device?: 'PC' | 'MOBILE' };
    status?: 'ACTIVE' | 'INACTIVE';
    setSnackbar: (
        value: React.SetStateAction<{
            open: boolean;
            message?: string;
            variant?: 'success' | 'error';
            device?: 'PC' | 'MOBILE';
        }>
    ) => void;
}
export const CartHeader = ({ title, description, cafeLocation, snackbar, setSnackbar, status }: ICartHeaderProps) => {
    const confirmHeaderRef = useRef<HTMLDivElement>(null);
    const { isMobile } = useResponsive();
    const [cartItems] = useAtom(cartItemsAtom);

    const [headerModalOpen, setHeaderModalOpen] = useState({ type: '', open: false });
    const [headerWidth, setHeaderWidth] = useState<number | undefined>(undefined);
    const showSnackbar = (message: string, variant: 'success' | 'error' = 'success') => {
        setSnackbar({ open: true, message, variant, device: 'MOBILE' });
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ open: false, message: '', variant: 'success', device: 'PC' });
    };

    useEffect(() => {
        const updateWidth = () => {
            if (confirmHeaderRef.current) {
                const width = confirmHeaderRef.current.getBoundingClientRect().width;
                setHeaderWidth(width);
            }
        };

        updateWidth();

        const observer = new ResizeObserver(() => {
            updateWidth();
        });

        if (confirmHeaderRef.current) {
            observer.observe(confirmHeaderRef.current);
        }

        return () => observer.disconnect();
    }, [title]);

    const [isScrolled, setIsScrolled] = useState(false);
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 80);
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // 초기값 반영
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const semiHeaderRef = useRef<HTMLDivElement>(null); // 세미 헤더 (있다면)
    const isCartInactive = status === 'INACTIVE';

    return (
        <>
            <CartHeaderWrap className={isScrolled ? 'round' : ''}>
                <Box ref={semiHeaderRef}>
                    <CartWaring isCartInactive={isCartInactive} />
                </Box>
                <Stack direction={'row'} justify={'space-between'}>
                    <Stack direction={'column'} align={'flex-start'} margin={'0 10px 0 0'}>
                        <EllipsisTooltip title={title} entry={'cartHeader'}>
                            <CartHeaderTitle>{title}</CartHeaderTitle>
                        </EllipsisTooltip>
                        {description && (
                            <CartHeaderDesc className={isScrolled ? 'hide' : ''}>
                                <p>{description}</p>
                            </CartHeaderDesc>
                        )}
                    </Stack>
                    <CartHeaderBtn>
                        {!isMobileDevice() && !isMobile ? (
                            <Tooltip title="요약 보기" placement="top" arrow>
                                <IconButton
                                    disabled={cartItems.length === 0}
                                    onClick={() => setHeaderModalOpen({ type: 'summary', open: true })}
                                >
                                    <AnimatedReceiptIcon />
                                </IconButton>
                            </Tooltip>
                        ) : (
                            <>
                                <IconButton
                                    disabled={cartItems.length === 0}
                                    onClick={() =>
                                        cartItems.length > 0 && setHeaderModalOpen({ type: 'summary', open: true })
                                    }
                                >
                                    <AnimatedReceiptIcon />
                                </IconButton>
                                <IconButton onClick={() => setHeaderModalOpen({ type: 'share', open: true })}>
                                    <Share2 />
                                </IconButton>
                            </>
                        )}
                    </CartHeaderBtn>
                </Stack>
            </CartHeaderWrap>

            {headerModalOpen.open && headerModalOpen.type === 'share' && (
                <ShareCartDialog
                    cartTitle={title as string}
                    open={headerModalOpen.open && headerModalOpen.type === 'share'}
                    onClose={() => {
                        setHeaderModalOpen({ open: false, type: '' });
                    }}
                    showToast={showSnackbar}
                />
            )}

            {headerModalOpen.open && headerModalOpen.type === 'summary' && (
                <CafeSummaryModal
                    cafeLocation={cafeLocation}
                    cartItems={cartItems}
                    open={headerModalOpen.open}
                    onClose={() => setHeaderModalOpen({ type: '', open: false })}
                />
            )}
            {snackbar.open && snackbar.device === 'MOBILE' && (
                <Snackbar
                    open={snackbar.open && snackbar.device === 'MOBILE'}
                    autoHideDuration={2000}
                    onClose={handleCloseSnackbar}
                    message={snackbar.message}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                    ContentProps={{
                        sx: {
                            backgroundColor: COLORS_DARK.accent.main,
                            color: '#fff',
                            fontSize: 14,
                            fontWeight: 'bold',
                            maxWidth: '500px'
                        }
                    }}
                />
            )}
        </>
    );
};
