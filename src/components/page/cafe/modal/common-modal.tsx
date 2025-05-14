// 'use client';
//
// import { COLORS_DARK } from '@/data';
// import { Backdrop, Box, Button, IconButton, Typography, useMediaQuery, useTheme } from '@mui/material';
// import { ICommonModalTypes } from '@/types/common';
// import { useMaxWidthByViewport } from '@/utils/hook';
// import { X } from 'lucide-react';
//
// export const CommonModal = (props: ICommonModalTypes) => {
//     const { open, onClose, content, title, onConfirm, confirmText, width } = props;
//     const theme = useTheme();
//     const isSm = useMediaQuery(theme.breakpoints.between('xs', 'sm')); // <360
//     const isMd = useMediaQuery(theme.breakpoints.between('sm', 'md')); // 360 ~ 479
//     const { fontSize } = useMaxWidthByViewport();
//
//     return (
//         <Backdrop
//             open={open}
//             onClick={onClose}
//             aria-hidden={false}
//             sx={{
//                 zIndex: 1300,
//                 backgroundColor: 'rgba(0, 0, 0, 0.75)',
//                 display: 'flex',
//                 flexDirection: 'column',
//                 alignItems: 'center',
//                 justifyContent: 'center'
//             }}
//         >
//             <Box
//                 onClick={e => e.stopPropagation()}
//                 sx={{
//                     width: width ?? '90%',
//                     maxWidth: 500,
//                     maxHeight: '80vh',
//                     backgroundColor: COLORS_DARK.background.main,
//                     borderRadius: 3,
//                     display: 'flex',
//                     flexDirection: 'column',
//                     border: '1px solid rgba(255,255,255,0.1)',
//                     boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.5)'
//                 }}
//             >
//                 <Box
//                     sx={{
//                         position: 'relative',
//                         textAlign: 'center',
//                         px: 2,
//                         py: 2,
//                         borderBottom: title && '1px solid rgba(255,255,255,0.05)'
//                     }}
//                 >
//                     {title && (
//                         <Typography fontSize={isSm ? 18 : isMd ? 20 : 22} fontWeight="bold">
//                             {title}
//                         </Typography>
//                     )}
//                     {/*{onClose && (*/}
//                     {/*    <IconButton*/}
//                     {/*        onClick={onClose}*/}
//                     {/*        size="small"*/}
//                     {/*        sx={{*/}
//                     {/*            position: 'absolute',*/}
//                     {/*            right: 12,*/}
//                     {/*            top: '50%',*/}
//                     {/*            transform: 'translateY(-50%)',*/}
//                     {/*            color: '#fff'*/}
//                     {/*        }}*/}
//                     {/*    >*/}
//                     {/*        <X size={18} />*/}
//                     {/*    </IconButton>*/}
//                     {/*)}*/}
//                 </Box>
//                 {content}
//             </Box>
//             <Box
//                 sx={{
//                     py: 1.5,
//                     px: 2,
//                     borderTop: '1px solid rgba(255,255,255,0.05)',
//                     display: 'flex',
//                     justifyContent: 'center',
//                     gap: 2
//                 }}
//             >
//                 <Button
//                     onClick={onClose}
//                     sx={{
//                         backgroundColor: onConfirm ? '#fff' : 'transparent',
//                         color: COLORS_DARK.accent.main,
//                         border: `2px solid ${COLORS_DARK.accent.main}`,
//                         // color: COLORS_DARK.accent.main,
//                         fontWeight: 'bold',
//                         px: 4,
//                         py: 1,
//                         borderRadius: 2
//                     }}
//                 >
//                     닫기
//                 </Button>
//                 {onConfirm && (
//                     <Button
//                         onClick={onConfirm}
//                         sx={{
//                             backgroundColor: COLORS_DARK.accent.main,
//                             color: '#fff',
//                             fontWeight: 'bold',
//                             fontSize,
//                             px: 4,
//                             py: 1,
//                             borderRadius: 2
//                         }}
//                     >
//                         {confirmText ?? '확인'}
//                     </Button>
//                 )}
//             </Box>
//         </Backdrop>
//     );
// };
// 'use client';
//
// import { COLORS_DARK } from '@/data';
// import { Backdrop, Box, Button, IconButton, Typography, useMediaQuery, useTheme } from '@mui/material';
// import { ICommonModalTypes } from '@/types/common';
// import { useMaxWidthByViewport } from '@/utils/hook';
// import { X } from 'lucide-react';
//
// export const CommonModal = (props: ICommonModalTypes) => {
//     const { open, onClose, content, title, onConfirm, confirmText, width } = props;
//     const theme = useTheme();
//     const isSm = useMediaQuery(theme.breakpoints.between('xs', 'sm'));
//     const isMd = useMediaQuery(theme.breakpoints.between('sm', 'md'));
//     const { fontSize } = useMaxWidthByViewport();
//
//     return (
//         <Backdrop
//             open={open}
//             onClick={onClose}
//             aria-hidden={false}
//             sx={{
//                 zIndex: 1300,
//                 backgroundColor: 'rgba(0, 0, 0, 0.75)',
//                 display: 'flex',
//                 flexDirection: 'column',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 p: 2
//             }}
//         >
//             <Box
//                 onClick={e => e.stopPropagation()}
//                 sx={{
//                     width: width ?? '90%',
//                     maxWidth: 500,
//                     backgroundColor: COLORS_DARK.background.main,
//                     borderRadius: 3,
//                     display: 'flex',
//                     flexDirection: 'column',
//                     border: '1px solid rgba(255,255,255,0.1)',
//                     boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.5)',
//                     overflow: 'hidden',
//                     padding: '24px 16px'
//                 }}
//             >
//                 {/* Header: 타이틀 중앙 정렬, 닫기 버튼 우측 */}
//                 <Box
//                     sx={{
//                         position: 'relative',
//                         display: 'flex',
//                         alignItems: 'center',
//                         justifyContent: 'center',
//                         mb: 2
//                     }}
//                 >
//                     <Typography
//                         fontSize={isSm ? 18 : isMd ? 20 : 22}
//                         fontWeight="bold"
//                         sx={{
//                             textAlign: 'center'
//                         }}
//                     >
//                         {title}
//                     </Typography>
//                     {onClose && (
//                         <IconButton
//                             onClick={onClose}
//                             size="small"
//                             sx={{
//                                 position: 'absolute',
//                                 right: '12px',
//                                 top: 0,
//                                 color: '#fff',
//                                 transform: 'translateY(-50%)'
//                             }}
//                         >
//                             <X size={22} />
//                         </IconButton>
//                     )}
//                 </Box>
//
//                 <Box
//                     sx={{
//                         overflowY: 'auto',
//                         maxHeight: '50vh',
//                         mb: '12px',
//                         flex: 1,
//                         '&::-webkit-scrollbar': {
//                             width: '4px' // 얇게
//                         },
//                         '&::-webkit-scrollbar-track': {
//                             backgroundColor: 'transparent'
//                         },
//                         '&::-webkit-scrollbar-thumb': {
//                             backgroundColor: 'rgba(255, 255, 255, 0.15)',
//                             borderRadius: '4px'
//                         },
//                         scrollbarWidth: 'thin',
//                         scrollbarColor: 'rgba(255,255,255,0.15) transparent'
//                     }}
//                 >
//                     {content}
//                 </Box>
//
//                 {/* Button Section: 닫기 버튼 중앙 정렬 */}
//                 <Box
//                     sx={{
//                         display: 'flex',
//                         justifyContent: 'center',
//                         gap: 2
//                     }}
//                 >
//                     <Button
//                         onClick={onClose}
//                         sx={{
//                             backgroundColor: 'transparent',
//                             color: COLORS_DARK.accent.main,
//                             border: `2px solid ${COLORS_DARK.accent.main}`,
//                             fontWeight: 'bold',
//                             px: 4,
//                             py: 1,
//                             borderRadius: 2
//                         }}
//                     >
//                         닫기
//                     </Button>
//                     {onConfirm && (
//                         <Button
//                             onClick={onConfirm}
//                             sx={{
//                                 backgroundColor: COLORS_DARK.accent.main,
//                                 color: '#fff',
//                                 fontWeight: 'bold',
//                                 fontSize,
//                                 px: 4,
//                                 py: 1,
//                                 borderRadius: 2
//                             }}
//                         >
//                             {confirmText ?? '확인'}
//                         </Button>
//                     )}
//                 </Box>
//             </Box>
//         </Backdrop>
//     );
// };
'use client';

import { COLORS_DARK } from '@/data';
import { Backdrop, Box, Button, IconButton, Typography, useMediaQuery, useTheme } from '@mui/material';
import { ICommonModalTypes } from '@/types/common';
import { useMaxWidthByViewport } from '@/utils/hook';
import { X } from 'lucide-react';

export const CommonModal = (props: ICommonModalTypes) => {
    const { open, onClose, content, title, onConfirm, confirmText, width } = props;
    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down('sm'));
    const isMd = useMediaQuery(theme.breakpoints.between('sm', 'md'));
    const { fontSize } = useMaxWidthByViewport();

    return (
        <Backdrop
            open={open}
            onClick={onClose}
            aria-hidden={false}
            sx={{
                zIndex: 1300,
                backgroundColor: 'rgba(0, 0, 0, 0.75)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                p: 2
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
                    {/*{onClose && (*/}
                    {/*    <IconButton*/}
                    {/*        onClick={onClose}*/}
                    {/*        size="small"*/}
                    {/*        sx={{*/}
                    {/*            position: 'absolute',*/}
                    {/*            right: 16, // 우측에 고정*/}
                    {/*            top: '50%',*/}
                    {/*            transform: 'translateY(-50%)',*/}
                    {/*            color: '#fff'*/}
                    {/*        }}*/}
                    {/*    >*/}
                    {/*        <X size={22} />*/}
                    {/*    </IconButton>*/}
                    {/*)}*/}
                </Box>

                {/* Content: 충분한 패딩 적용 */}
                <Box
                    sx={{
                        overflowY: 'auto',
                        maxHeight: '50vh',
                        px: 2,
                        py: 2,
                        textAlign: 'center'
                    }}
                >
                    {content}
                </Box>

                {/*<Box*/}
                {/*    sx={{*/}
                {/*        display: 'flex',*/}
                {/*        justifyContent: 'center',*/}
                {/*        gap: 2,*/}
                {/*        pb: 2,*/}
                {/*        pt: 1.5*/}
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
                {/*            borderRadius: 2*/}
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
                {/*                borderRadius: 2*/}
                {/*            }}*/}
                {/*        >*/}
                {/*            {confirmText ?? '확인'}*/}
                {/*        </Button>*/}
                {/*    )}*/}
                {/*</Box>*/}
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 2,
                    width: width ?? '90%',
                    maxWidth: 500,
                    mt: 1.5
                }}
            >
                <Button
                    onClick={onClose}
                    sx={{
                        backgroundColor: 'transparent',
                        color: COLORS_DARK.accent.main,
                        border: `2px solid ${COLORS_DARK.accent.main}`,
                        fontWeight: 'bold',
                        px: isSm ? 2 : 4,
                        py: isSm ? 0.5 : 1,
                        borderRadius: 2,
                        width: '100px'
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
                            px: isSm ? 2 : 4,
                            py: isSm ? 0.5 : 1,
                            borderRadius: 2,
                            width: '100px'
                        }}
                    >
                        {confirmText ?? '확인'}
                    </Button>
                )}
            </Box>
        </Backdrop>
    );
};
