'use client';

import type React from 'react';

import {
    Box,
    Button,
    Card,
    CardMedia,
    Checkbox,
    Dialog,
    DialogContent,
    FormControl,
    FormControlLabel,
    IconButton,
    Slide,
    ToggleButton,
    Typography,
    useMediaQuery,
    useTheme
} from '@mui/material';
import { forwardRef, useState } from 'react';
import type { TransitionProps } from '@mui/material/transitions';
import { DrinkTemperature } from '@/types/common';
import type { ICafeMenuOption } from '@/types/cart';
import { MenuPopoverToggleButtonGroup } from '@/styles/cart/cart.styles';
import { Minus, Plus, ShoppingCart, ShoppingCartIcon } from 'lucide-react';

interface ICafeMenuPopoverProps {
    open: boolean;
    onClose: () => void;
    popoverProps: { menuName: string; options: Array<ICafeMenuOption> };
    width: number;
}

const Transition = forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export const MenuPopover = ({ open, onClose, popoverProps, width }: ICafeMenuPopoverProps) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [drinkTemp, setDrinkTemp] = useState<DrinkTemperature>(
        (popoverProps.options?.[0].drinkTemperature as DrinkTemperature) || DrinkTemperature.HOT
    );

    const drinkTempMenu = popoverProps.options.find(o => o.drinkTemperature === drinkTemp);

    const [selectedTempMenu, setSelectedTempMenu] = useState({
        ...drinkTempMenu,
        checked: false,
        quantity: 1,
        totalPrice: (drinkTempMenu?.price ?? 0) + (drinkTempMenu?.deposit ?? 0)
    });

    console.log(selectedTempMenu);

    // 이미지 크기를 화면 너비에 비례하게 계산
    const imageSize = isMobile ? `${width * 0.2}px` : `${width * 0.25}px`;
    const maxImageSize = '120px'; // 최대 크기 제한

    const handleChange = (name: string, value: any) => {
        setSelectedTempMenu(prevMenu => {
            const updatedMenu = { ...prevMenu, [name]: value };

            // "checked"가 변경될 때 totalPrice 업데이트
            if (name === 'checked') {
                const price = prevMenu.price ?? 0;
                const quantity = prevMenu.quantity ?? 1;
                updatedMenu.totalPrice = price * quantity;
            }

            return updatedMenu;
        });
    };

    const handleAddToCart = () => {
        // Implement the logic to add the item to the cart
        console.log('Added to cart:', {
            menuName: popoverProps.menuName,
            temperature: drinkTemp,
            quanity: selectedTempMenu.quantity
        });
        onClose();
    };

    return (
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
                    backgroundColor: '#cf7500',
                    width: `${width}px`, // 동적으로 설정된 너비
                    maxWidth: 'none' // maxWidth를 없애서 직접 설정한 너비가 적용되도록
                }
            }}
        >
            <DialogContent
                sx={{
                    p: { xs: 2, sm: 3 },
                    padding: '40px'
                }}
            >
                {popoverProps && (
                    <>
                        {/* 이미지와 메뉴명 - 더 유동적인 반응형으로 수정 */}
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                mb: 3,
                                gap: 2
                            }}
                        >
                            <Card
                                sx={{
                                    display: 'flex', // flexbox로 배치
                                    flexDirection: { xs: 'column', sm: 'row' }, // 모바일에서는 세로, 데스크탑에서는 가로 배치
                                    width: imageSize,
                                    height: imageSize,
                                    maxWidth: maxImageSize,
                                    maxHeight: maxImageSize,
                                    flexShrink: 0,
                                    overflow: 'hidden',
                                    borderRadius: 2,
                                    alignItems: 'center' // 텍스트를 이미지 중앙에 맞추기
                                }}
                            >
                                <CardMedia
                                    component="img"
                                    sx={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover'
                                    }}
                                    src={'https://img.freepik.com/free-photo/iced-cola-tall-glass_1101-740.jpg'}
                                    alt={popoverProps.menuName}
                                />
                            </Card>
                            <Typography
                                variant="h6"
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center', // 텍스트 중앙 정렬
                                    justifyContent: 'center', // 텍스트가 가운데에 위치하도록 설정
                                    height: '100%', // 전체 카드의 높이를 사용
                                    fontWeight: 'bold',
                                    color: 'white',
                                    fontSize: {
                                        xs: '0.9rem',
                                        sm: '1.1rem',
                                        md: '1.25rem'
                                    },
                                    ml: { xs: 0, sm: 2 } // 모바일에서는 텍스트와 이미지 간격을 없애고, 큰 화면에서 간격 추가
                                }}
                            >
                                {popoverProps.menuName}
                            </Typography>
                        </Box>

                        {/* 개인 텀블러 체크박스 */}
                        <Box sx={{ display: 'flex', width: '100%', mb: 2 }}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={selectedTempMenu.checked}
                                        onChange={e => handleChange('checked', e.target.checked)}
                                        sx={{
                                            color: 'white',
                                            '&.Mui-checked': {
                                                color: 'white'
                                            }
                                        }}
                                    />
                                }
                                label="개인 텀블러 사용"
                                sx={{
                                    color: 'white',
                                    '& .MuiFormControlLabel-label': {
                                        fontSize: {
                                            xs: '0.8rem',
                                            sm: '0.9rem',
                                            md: '1rem'
                                        }
                                    }
                                }}
                            />
                        </Box>

                        {/* 온도 선택 토글 버튼 - 가운데 정렬 */}
                        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', mb: 3 }}>
                            <FormControl component={'fieldset'} sx={{ width: '66.67%' }}>
                                {' '}
                                {/* 다이얼로그의 2/3 너비 */}
                                <Typography
                                    variant="body1"
                                    sx={{
                                        mb: 1,
                                        color: 'white',
                                        fontWeight: 'medium',
                                        textAlign: 'center'
                                    }}
                                >
                                    온도 선택
                                </Typography>
                                <MenuPopoverToggleButtonGroup
                                    onChange={(_, value) => {
                                        if (value !== null) {
                                            handleChange('drinkTemperature', value);
                                        }
                                    }}
                                    exclusive
                                    defaultValue={popoverProps.options[0].drinkTemperature}
                                    sx={{
                                        width: '100%',
                                        display: 'flex',
                                        justifyContent: 'space-evenly', // 각 버튼 간격 균등
                                        '& .MuiToggleButton-root': {
                                            flex: 1, // 각 버튼이 동일한 너비를 가짐
                                            py: 1.5,
                                            fontSize: {
                                                xs: '0.8rem', // 모바일에서 폰트 크기 줄이기
                                                sm: '0.9rem', // 작은 화면에서 폰트 크기 설정
                                                md: '1rem' // 중간 화면 크기에서 폰트 크기 설정
                                            },
                                            fontWeight: 'bold',
                                            minWidth: 'auto' // 최소 너비를 자동으로 설정
                                        }
                                    }}
                                >
                                    <ToggleButton
                                        value={DrinkTemperature.HOT}
                                        selected={drinkTemp === DrinkTemperature.HOT}
                                        disabled={popoverProps.options.every(
                                            o => o.drinkTemperature !== DrinkTemperature.HOT
                                        )}
                                    >
                                        HOT
                                    </ToggleButton>
                                    <ToggleButton
                                        selected={drinkTemp === DrinkTemperature.ICED}
                                        value={DrinkTemperature.ICED}
                                        disabled={popoverProps.options.every(
                                            o => o.drinkTemperature !== DrinkTemperature.ICED
                                        )}
                                        onClick={() => {
                                            setDrinkTemp(DrinkTemperature.ICED);
                                        }}
                                    >
                                        ICED
                                    </ToggleButton>
                                </MenuPopoverToggleButtonGroup>
                            </FormControl>
                        </Box>

                        {/* 수량 선택 NumberInput - 가운데 정렬 */}
                        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', mb: 3 }}>
                            <Box sx={{ width: '66.67%' }}>
                                <Typography
                                    variant="body1"
                                    sx={{
                                        mb: 1,
                                        color: 'white',
                                        fontWeight: 'medium',
                                        textAlign: 'center'
                                    }}
                                >
                                    수량 선택
                                </Typography>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        gap: 2
                                    }}
                                >
                                    <IconButton
                                        onClick={() => handleChange('quantity', selectedTempMenu.quantity - 1)}
                                        disabled={selectedTempMenu.quantity <= 1 || !selectedTempMenu.available}
                                        sx={{
                                            bgcolor: 'rgba(255, 255, 255, 0.2)',
                                            color: 'white',
                                            width: {
                                                xs: '32px',
                                                sm: '38px'
                                            },
                                            height: {
                                                xs: '32px',
                                                sm: '38px'
                                            }
                                        }}
                                    >
                                        <Minus />
                                    </IconButton>
                                    <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
                                        {selectedTempMenu.quantity}
                                    </Typography>
                                    <IconButton
                                        onClick={() => handleChange('quantity', selectedTempMenu.quantity + 1)}
                                        sx={{
                                            bgcolor: 'rgba(255, 255, 255, 0.2)',
                                            color: 'white',
                                            width: {
                                                xs: '32px',
                                                sm: '38px'
                                            },
                                            height: {
                                                xs: '32px',
                                                sm: '38px'
                                            }
                                        }}
                                    >
                                        <Plus />
                                    </IconButton>
                                </Box>
                            </Box>
                        </Box>

                        {/* 총 가격 표시 */}
                        {selectedTempMenu?.price && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                                <Typography
                                    variant="h5"
                                    sx={{
                                        color: 'white',
                                        fontWeight: 'bold',
                                        fontSize: {
                                            xs: '1rem', // 모바일에서 작은 글씨
                                            sm: '1.2rem', // 작은 화면에서 중간 크기
                                            md: '1.5rem', // 중간 화면에서 큰 크기
                                            lg: '1.8rem' // 큰 화면에서 더 큰 크기
                                        },
                                        lineHeight: {
                                            xs: '1.4', // 모바일에서 줄 간격을 좀 더 넓게
                                            sm: '1.6', // 작은 화면에서 적당한 줄 간격
                                            md: '1.8', // 중간 화면에서 더 넓은 줄 간격
                                            lg: '2' // 큰 화면에서 더 넓은 줄 간격
                                        }
                                    }}
                                >
                                    총 금액: {selectedTempMenu.totalPrice.toLocaleString()} 원
                                </Typography>
                            </Box>
                        )}
                        {/* 장바구니 추가 버튼 */}
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Button
                                variant={'contained'}
                                endIcon={<ShoppingCart />}
                                disabled={!selectedTempMenu.available}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: { xs: '8px 16px', sm: '10px 20px' }, // 모바일에서는 패딩 줄이기
                                    fontSize: { xs: '0.8rem', sm: '1rem' }, // 모바일에서 폰트 크기 줄이기
                                    minWidth: 'auto', // 최소 너비 자동으로 설정
                                    marginTop: { xs: 1, sm: 0 }, // 모바일에서는 버튼 간격 주기
                                    backgroundColor: 'white',
                                    color: '#cf7500',
                                    '&:hover': {
                                        backgroundColor: 'rgba(255, 255, 255, 0.8)'
                                    }
                                }}
                            >
                                장바구니 담기
                            </Button>
                        </Box>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
};
