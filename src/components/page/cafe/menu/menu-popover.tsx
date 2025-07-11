'use client';

import type React from 'react';
import { forwardRef, useEffect, useState } from 'react';

import {
    Box,
    Button,
    Card,
    CardMedia,
    Dialog,
    DialogContent,
    Divider,
    IconButton,
    Slide,
    Typography
} from '@mui/material';
import type { TransitionProps } from '@mui/material/transitions';
import { DrinkTemperature } from '@/types/common';
import type { ICafeMenuPopoverProps, IExtendedCafeMenuBoardResponse } from '@/types/cart';
import { Minus, Plus, ShoppingCart, X } from 'lucide-react';
import { getCookie } from '@/utils/cookie';
import { useAddMenuCart } from '@/apis/cafe/cafe-api';
import { COLORS_DARK } from '@/data';
import { HotToggleButton, IcedToggleButton, StyledToggleButtonGroup } from '@/styles/cart/menu/cart-menu.styles';
import { useResponsive } from '@/utils/hook';
import { useModal } from '@/atom/common-atom';
import { CommonModal } from '@/components/page/cafe/modal/common-modal';
import { useRouter } from 'next/navigation';

const Transition = forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement;
    },
    ref: React.Ref<unknown>
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export const MenuPopover = ({
    open,
    onClose,
    popoverProps,
    width,
    cartId,
    onSuccess,
    handleChangeMenuData
}: ICafeMenuPopoverProps) => {
    const { isMobile } = useResponsive();
    const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);
    const userName = getCookie('BRK-UserName');
    const uuid = getCookie('BRK-UUID');
    const userProfile = getCookie('BRK-UserProfile');
    const [adjustedName, setAdjustedName] = useState(userName);
    const expiredModal = useModal('expiredModal');
    const router = useRouter();

    const userNameWarning = useModal('userNameWarning');
    // 창 크기 변경 감지
    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        if (typeof window !== 'undefined') {
            window.addEventListener('resize', handleResize);
            return () => {
                window.removeEventListener('resize', handleResize);
            };
        }
    }, []);

    const drinkTempMenu = popoverProps.options.find(o => o.drinkTemperature === popoverProps.temp);

    const [selectedTempMenu, setSelectedTempMenu] = useState({
        ...drinkTempMenu,
        checked: false,
        quantity: 1,
        price: drinkTempMenu?.price ?? 0
    });

    // 이미지 크기를 화면 너비에 비례하게 계산
    const imageSize = isMobile ? `${width * 0.2}px` : `${width * 0.25}px`;
    const maxImageSize = '120px'; // 최대 크기 제한

    const handleChange = (name: string, value: any) => {
        if (name === 'drinkTemperature') {
            const newMenu = popoverProps.options.find(p => p.drinkTemperature === value);
            setSelectedTempMenu({
                ...newMenu,
                imageUrl: newMenu?.imageUrl,
                checked: false,
                quantity: 1,
                price: drinkTempMenu?.price ?? 0
            });
        }
        setSelectedTempMenu(prevMenu => {
            const updatedMenu = { ...prevMenu, [name]: value };

            // 수량 데이터
            let quantity = prevMenu.quantity ?? 1;

            // 수량 변경 시 totalPrice 업데이트 (최소 1 유지)
            if (name === 'quantity') {
                quantity = Math.max(1, value);
                updatedMenu.quantity = quantity;
            }

            return updatedMenu;
        });

        handleChangeMenuData((prev: Record<string, IExtendedCafeMenuBoardResponse>) => ({
            ...prev,
            [popoverProps.menuName]: {
                ...prev[popoverProps.menuName],
                temp: value // temp만 변경
            }
        }));
    };

    const handleClick = () => {
        const adjustedUserName = userName.length > 30 ? userName.slice(0, 30) : userName;
        setAdjustedName(adjustedUserName);

        if (userName.length > 30) {
            userNameWarning.openModal();
        } else {
            handleAddToCart();
        }
    };

    const handleAddToCart = () => {
        if (cartId && selectedTempMenu) {
            const adjustedUserName = userName.length > 30 ? userName.slice(0, 30) : userName;

            addMenuToCart.mutate({
                cafeCartId: cartId,
                cartData: {
                    cafeMenuId: selectedTempMenu.id ?? 0,
                    isPersonalCup: selectedTempMenu.checked,
                    quantity: selectedTempMenu.quantity,
                    imageUrl: userProfile
                },
                user: { uuid: uuid, userName: adjustedUserName, userProfile }
            });
        }
    };

    const handleClose = () => {
        expiredModal.closeModal();
        router.push(`/cafe/cart/${cartId}`);
    };

    const handleConfirm = () => {
        router.push('/cafe/cart');
    };

    const addMenuToCart = useAddMenuCart({
        onSuccess: () => {
            // console.log('장바구니 추가 성공');
            onSuccess();
            if (userNameWarning.modal.isOpen) {
                userNameWarning.closeModal();
            }
            onClose();
        },
        onError: error => {
            if (error?.response?.data?.error?.message === 'CafeCart must be ACTIVE') {
                console.log('entered');
                expiredModal.openModal();
            }
            console.error('장바구니 추가 실패:', error);
        }
    });

    if (expiredModal.modal.isOpen) {
        return (
            <CommonModal
                open={expiredModal.modal.isOpen}
                title={'장바구니 만료'}
                content={
                    <Box>
                        <Typography variant="body1" fontWeight={'bold'}>
                            {popoverProps.cartName}
                        </Typography>
                        장바구니의 이용 가능 시간이 만료되었습니다.
                    </Box>
                }
                onClose={handleClose}
                onConfirm={handleConfirm}
                confirmText={'장바구니로 이동'}
            />
        );
    }

    return (
        <>
            <Dialog
                open={open}
                onClose={onClose}
                slots={{ transition: Transition }}
                hideBackdrop
                aria-describedby="menu-option-dialog"
                sx={{
                    '& .MuiDialog-container': {
                        alignItems: 'flex-end',
                        justifyContent: 'center'
                    },
                    '& .MuiDialog-paper': {
                        backgroundColor: '#2c3034',
                        width: `${width}px`, // 동적으로 설정된 너비
                        maxWidth: 'none',
                        margin: 0,
                        borderRadius: isMobile ? '16px 16px 0 0' : '16px',
                        position: 'fixed',
                        bottom: 0,
                        left: isMobile ? 0 : 'auto',
                        right: isMobile ? 0 : 'auto',
                        boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                        overflow: 'hidden',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                    }
                }}
            >
                {/* 닫기 버튼 */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        zIndex: 10,
                        backgroundColor: 'rgba(255, 158, 68, 0.1)',
                        borderRadius: '50%',
                        width: 25,
                        height: 25,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                            backgroundColor: 'rgba(255, 158, 68, 0.2)'
                        }
                    }}
                    onClick={onClose}
                >
                    <X size={18} color={COLORS_DARK.accent.main} />
                </Box>

                <DialogContent
                    sx={{
                        p: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        height: '100%',
                        overflow: 'visible'
                    }}
                >
                    {popoverProps && (
                        <>
                            {/* 헤더 영역 - 이미지와 메뉴명 */}
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    p: 3,
                                    pb: 2,
                                    gap: 3
                                }}
                            >
                                <Card
                                    sx={{
                                        width: imageSize,
                                        height: imageSize,
                                        maxWidth: maxImageSize,
                                        maxHeight: maxImageSize,
                                        flexShrink: 0,
                                        overflow: 'hidden',
                                        borderRadius: '8px',
                                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                                        border: `2px solid rgba(255, 158, 68, 0.2)`,
                                        backgroundColor: COLORS_DARK.background.lighter
                                    }}
                                >
                                    <CardMedia
                                        component="img"
                                        sx={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            transition: 'transform 0.3s ease',
                                            '&:hover': {
                                                transform: 'scale(1.05)'
                                            }
                                        }}
                                        src={selectedTempMenu.imageUrl ?? ''}
                                        alt={popoverProps.menuName}
                                    />
                                </Card>
                                <Box>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontWeight: 'bold',
                                            color: COLORS_DARK.text.primary,
                                            fontSize: {
                                                xs: '1rem',
                                                sm: '1.125rem',
                                                md: '1.15rem'
                                            },
                                            mb: 0.5
                                        }}
                                    >
                                        {popoverProps.menuName}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: COLORS_DARK.accent.main,
                                            fontSize: {
                                                xs: '1rem',
                                                sm: '1.2rem'
                                            },
                                            fontWeight: 500
                                        }}
                                    >
                                        {selectedTempMenu.price?.toLocaleString()}원
                                    </Typography>
                                </Box>
                            </Box>

                            <Divider sx={{ borderColor: COLORS_DARK.divider, mx: 3 }} />

                            {/* 옵션 선택 영역 */}
                            <Box sx={{ p: 3, pt: 2 }}>
                                {/* 온도 선택 토글 버튼 */}
                                <Box sx={{ mb: 3 }}>
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            mb: 1.5,
                                            color: COLORS_DARK.text.primary,
                                            fontWeight: 600,
                                            fontSize: '0.95rem'
                                        }}
                                    >
                                        온도 선택
                                    </Typography>
                                    <StyledToggleButtonGroup
                                        defaultValue={popoverProps.options[0].drinkTemperature}
                                        exclusive
                                        onChange={(_, value) => {
                                            if (value !== null) {
                                                handleChange('drinkTemperature', value);
                                            }
                                        }}
                                        aria-label="temperature selection"
                                    >
                                        {popoverProps.options.find(
                                            p => p.drinkTemperature === DrinkTemperature.HOT
                                        ) && (
                                            <HotToggleButton
                                                value={DrinkTemperature.HOT}
                                                aria-label="hot option"
                                                disabled={popoverProps.options.every(
                                                    o => o.drinkTemperature !== DrinkTemperature.HOT
                                                )}
                                                selected={selectedTempMenu.drinkTemperature === DrinkTemperature.HOT}
                                            >
                                                HOT
                                            </HotToggleButton>
                                        )}
                                        {popoverProps.options.find(
                                            p => p.drinkTemperature === DrinkTemperature.ICED
                                        ) && (
                                            <IcedToggleButton
                                                selected={selectedTempMenu.drinkTemperature === DrinkTemperature.ICED}
                                                value={DrinkTemperature.ICED}
                                                aria-label="iced option"
                                                disabled={popoverProps.options.every(
                                                    o => o.drinkTemperature !== DrinkTemperature.ICED
                                                )}
                                            >
                                                ICED
                                            </IcedToggleButton>
                                        )}
                                    </StyledToggleButtonGroup>
                                </Box>

                                {/* 수량 선택 */}
                                <Box sx={{ mb: 3 }}>
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            mb: 1.5,
                                            color: COLORS_DARK.text.primary,
                                            fontWeight: 600,
                                            fontSize: '0.95rem'
                                        }}
                                    >
                                        수량 선택
                                    </Typography>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            backgroundColor: COLORS_DARK.background.light,
                                            borderRadius: '8px',
                                            p: 1
                                        }}
                                    >
                                        <IconButton
                                            onClick={() => handleChange('quantity', selectedTempMenu.quantity - 1)}
                                            disabled={selectedTempMenu.quantity <= 1 || !selectedTempMenu.available}
                                            sx={{
                                                bgcolor: 'rgba(255, 158, 68, 0.1)',
                                                color: COLORS_DARK.accent.main,
                                                width: 36,
                                                height: 36,
                                                '&:hover': {
                                                    bgcolor: 'rgba(255, 158, 68, 0.2)'
                                                },
                                                '&.Mui-disabled': {
                                                    color: COLORS_DARK.accent.disabled
                                                },
                                                transition: 'all 0.2s ease'
                                            }}
                                        >
                                            <Minus size={16} />
                                        </IconButton>
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                color: COLORS_DARK.text.primary,
                                                fontWeight: 'bold',
                                                fontSize: '1.1rem'
                                            }}
                                        >
                                            {selectedTempMenu?.quantity}
                                        </Typography>
                                        <IconButton
                                            onClick={() => handleChange('quantity', selectedTempMenu.quantity + 1)}
                                            sx={{
                                                bgcolor: 'rgba(255, 158, 68, 0.1)',
                                                color: COLORS_DARK.accent.main,
                                                width: 36,
                                                height: 36,
                                                '&:hover': {
                                                    bgcolor: 'rgba(255, 158, 68, 0.2)'
                                                },
                                                transition: 'all 0.2s ease'
                                            }}
                                        >
                                            <Plus size={16} />
                                        </IconButton>
                                    </Box>
                                </Box>

                                <Divider sx={{ borderColor: COLORS_DARK.divider, mb: 2 }} />

                                {/* 총 가격 표시 */}
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        mb: 3,
                                        backgroundColor: COLORS_DARK.theme.purple,
                                        border: `1px solid rgba(255, 171, 0, 0.2)`,
                                        p: 2,
                                        borderRadius: '8px'
                                    }}
                                >
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            color: COLORS_DARK.text.primary,
                                            fontSize: '1rem',
                                            fontWeight: 600
                                        }}
                                    >
                                        총 가격
                                    </Typography>
                                    <Box>
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                // color: COLORS_DARK.accent.main,
                                                color: COLORS_DARK.text.primary,
                                                fontWeight: 'bold',
                                                fontSize: {
                                                    xs: '1.125rem',
                                                    sm: '1.15rem',
                                                    md: '1.2rem'
                                                },
                                                textAlign: 'right'
                                            }}
                                        >
                                            {(selectedTempMenu.quantity * selectedTempMenu.price).toLocaleString()}원
                                        </Typography>
                                    </Box>
                                </Box>

                                {/* 장바구니 담기 버튼 */}
                                <Button
                                    variant="contained"
                                    fullWidth
                                    onClick={handleClick}
                                    sx={{
                                        backgroundColor: COLORS_DARK.accent.main,
                                        color: COLORS_DARK.text.primary,
                                        '&:hover': {
                                            backgroundColor: COLORS_DARK.accent.light
                                        },
                                        fontSize: {
                                            xs: '1rem',
                                            sm: '1.125rem',
                                            md: '1.15rem'
                                        },
                                        fontWeight: 'bold',
                                        py: 1.5,
                                        borderRadius: '8px',
                                        textTransform: 'none',
                                        transition: 'all 0.2s ease',
                                        '&:active': {
                                            transform: 'scale(0.98)'
                                        }
                                    }}
                                >
                                    장바구니에 담기
                                    <ShoppingCart size={20} style={{ marginLeft: '8px' }} />
                                </Button>
                            </Box>
                        </>
                    )}
                </DialogContent>
            </Dialog>
            <CommonModal
                open={userNameWarning.modal.isOpen}
                onClose={() => userNameWarning.closeModal()}
                content={
                    <Box>
                        <Typography
                            sx={{
                                whiteSpace: 'pre-line',
                                textAlign: 'center',
                                wordBreak: 'keep-all'
                            }}
                        >
                            이름이 30자를 초과하여 30자까지만 저장됩니다. <br />
                        </Typography>
                    </Box>
                }
                onConfirm={handleAddToCart}
            />
        </>
    );
};
