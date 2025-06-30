import { StyledCartHeader, StyledCartHeaderTitle } from '@/styles/cart/cart.styles';
import { Box, IconButton, Snackbar, Tooltip } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { useResponsive } from '@/utils/hook';
import { ClipboardList, Share2 } from 'lucide-react';
import { cartItemsAtom } from '@/atom/cart-atom';
import { useAtom } from 'jotai';
import { ShareCartDialog } from '@/components/page/cafe/modal/share-modal';
import { CafeSummaryModal } from '@/components/page/cafe/modal/cafe-summary-modal';
import { EllipsisTooltip } from '@/components/common/EllipsisTooltip';
import { COLORS_DARK } from '@/data';
import { isMobileDevice } from '@/utils/util';

interface ICartHeaderProps {
    title: string;
    snackbar: { open: boolean; message?: string; variant?: 'success' | 'error'; device?: 'PC' | 'MOBILE' };
    setSnackbar: (
        value: React.SetStateAction<{
            open: boolean;
            message?: string;
            variant?: 'success' | 'error';
            device?: 'PC' | 'MOBILE';
        }>
    ) => void;
}
export const CartHeader = ({ title, snackbar, setSnackbar }: ICartHeaderProps) => {
    const confirmHeaderRef = useRef<HTMLDivElement>(null);
    const { isMobile, isDesktop } = useResponsive();
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

    return (
        <>
            <StyledCartHeader isMobile={isMobile}>
                <Box
                    sx={{
                        width: isMobile ? '80%' : '85%'
                    }}
                    ref={confirmHeaderRef}
                >
                    <EllipsisTooltip title={title} entry={'cartHeader'}>
                        <StyledCartHeaderTitle isMobile={isMobile} maxWidth={headerWidth}>
                            {title}
                        </StyledCartHeaderTitle>
                    </EllipsisTooltip>
                </Box>
                <Box
                    sx={{
                        width: isMobile ? '20%' : '15%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        gap: 0.5
                    }}
                >
                    {!isMobileDevice() && !isMobile ? (
                        <Tooltip title="요약 보기" placement="top" arrow>
                            <IconButton
                                disabled={cartItems.length === 0}
                                onClick={() => setHeaderModalOpen({ type: 'summary', open: true })}
                                sx={{ cursor: 'pointer' }}
                            >
                                <ClipboardList />
                            </IconButton>
                        </Tooltip>
                    ) : (
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                            <IconButton
                                disabled={cartItems.length === 0}
                                onClick={() =>
                                    cartItems.length > 0 && setHeaderModalOpen({ type: 'summary', open: true })
                                }
                                sx={{ cursor: 'pointer', padding: 0 }}
                            >
                                <ClipboardList />
                            </IconButton>
                            <IconButton
                                sx={{ cursor: 'pointer', padding: 0 }}
                                onClick={() => setHeaderModalOpen({ type: 'share', open: true })}
                            >
                                <Share2 />
                            </IconButton>
                        </Box>
                    )}
                </Box>
                <StyledCartHeaderTitle isMobile={isMobile}></StyledCartHeaderTitle>
            </StyledCartHeader>
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
