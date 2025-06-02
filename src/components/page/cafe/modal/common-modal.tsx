'use client';

import { COLORS_DARK } from '@/data';
import { Backdrop, Box, Button, Typography, useMediaQuery, useTheme } from '@mui/material';
import { ICommonModalTypes } from '@/types/common';
import { useHasVerticalScroll, useMaxWidthByViewport } from '@/utils/hook';

export const CommonModal = (props: ICommonModalTypes) => {
    const { open, onClose, content, title, onConfirm, confirmText, width } = props;
    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down('sm'));
    const { fontSize } = useMaxWidthByViewport();
    const { ref, hasScroll } = useHasVerticalScroll();

    return (
        <Backdrop
            open={open}
            onClick={onClose}
            aria-hidden={false}
            sx={{
                zIndex: 1400,
                backgroundColor: 'rgba(0, 0, 0, 0.75)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 2
            }}
        >
            <Box
                onClick={e => e.stopPropagation()}
                sx={{
                    width: width ?? '90%',
                    maxWidth: 500,
                    backgroundColor: COLORS_DARK.background.main,
                    borderRadius: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    border: '1px solid rgba(255,255,255,0.1)',
                    boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.5)',
                    overflow: 'hidden'
                }}
            >
                <Box
                    sx={{
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'baseline',
                        justifyContent: 'space-between',
                        padding: '16px 16px 0 16px'
                    }}
                >
                    <Typography
                        fontSize={isSm ? 18 : 20}
                        fontWeight="bold"
                        sx={{
                            textAlign: 'center',
                            flex: 1
                        }}
                    >
                        {title}
                    </Typography>
                </Box>

                <Box
                    sx={{
                        position: 'relative',
                        display: 'flex',
                        flex: '1 1 auto',
                        flexDirection: 'column',
                        overflow: 'hidden',
                        padding: props.fixedContent ? '16px 16px 0 16px' : '30px 30px 10px 30px',
                        maxHeight: '60vh',
                        textAlign: 'center',
                        alignItems: props.fixedContent ? '' : 'center'
                    }}
                >
                    {/* 스크롤 영역 */}
                    <Box
                        ref={ref}
                        sx={{
                            overflowY: 'auto',
                            paddingRight: hasScroll ? '8px' : 0, // 스크롤바 여백
                            '&::-webkit-scrollbar': {
                                width: '6px'
                            },
                            '&::-webkit-scrollbar-thumb': {
                                backgroundColor: '#444',
                                borderRadius: '4px'
                            },
                            '&::-webkit-scrollbar-track': {
                                backgroundColor: COLORS_DARK.background.main
                            }
                        }}
                    >
                        {content}
                    </Box>
                </Box>
                {props.fixedContent && <Box padding={2}>{props.fixedContent}</Box>}
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: 2,
                        maxWidth: 500,
                        margin: 2
                    }}
                >
                    <Button
                        onClick={onClose}
                        sx={{
                            // backgroundColor: 'transparent',
                            backgroundColor: '#fff',
                            color: COLORS_DARK.accent.main,
                            border: `2px solid ${COLORS_DARK.accent.main}`,
                            fontWeight: 'bold',
                            fontSize: fontSize,
                            px: isSm ? 2 : 4,
                            py: isSm ? 0.5 : 1,
                            borderRadius: 2,
                            width: '100px',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        닫기
                    </Button>
                    {onConfirm && (
                        <Button
                            onClick={onConfirm}
                            sx={{
                                backgroundColor: COLORS_DARK.accent.main,
                                color: '#fff',
                                fontWeight: 'bold',
                                fontSize,
                                // fontSize:confirmText==='새 장바구니 만들기'?:fontSize,
                                px: isSm ? 2 : 4,
                                py: isSm ? 0.5 : 1,
                                borderRadius: 2,
                                minWidth: confirmText === '새 장바구니 만들기' ? 160 : undefined,
                                // minWidth: 160,
                                whiteSpace: 'nowrap'
                            }}
                        >
                            {confirmText ?? '확인'}
                        </Button>
                    )}
                </Box>
            </Box>
            {/*<Box*/}
            {/*    sx={{*/}
            {/*        display: 'flex',*/}
            {/*        justifyContent: 'center',*/}
            {/*        gap: 2,*/}
            {/*        width: width ?? '90%',*/}
            {/*        maxWidth: 500,*/}
            {/*        mt: 2*/}
            {/*    }}*/}
            {/*>*/}
            {/*    <Button*/}
            {/*        onClick={onClose}*/}
            {/*        sx={{*/}
            {/*            backgroundColor: 'transparent',*/}
            {/*            color: COLORS_DARK.accent.main,*/}
            {/*            border: `2px solid ${COLORS_DARK.accent.main}`,*/}
            {/*            fontWeight: 'bold',*/}
            {/*            px: isSm ? 2 : 4,*/}
            {/*            py: isSm ? 0.5 : 1,*/}
            {/*            borderRadius: 2,*/}
            {/*            width: '100px'*/}
            {/*        }}*/}
            {/*    >*/}
            {/*        닫기*/}
            {/*    </Button>*/}
            {/*    {onConfirm && (*/}
            {/*        <Button*/}
            {/*            onClick={onConfirm}*/}
            {/*            sx={{*/}
            {/*                backgroundColor: COLORS_DARK.accent.main,*/}
            {/*                color: '#fff',*/}
            {/*                fontWeight: 'bold',*/}
            {/*                fontSize,*/}
            {/*                px: isSm ? 2 : 4,*/}
            {/*                py: isSm ? 0.5 : 1,*/}
            {/*                borderRadius: 2,*/}
            {/*                width: '100px'*/}
            {/*            }}*/}
            {/*        >*/}
            {/*            {confirmText ?? '확인'}*/}
            {/*        </Button>*/}
            {/*    )}*/}
            {/*</Box>*/}
        </Backdrop>
    );
};
