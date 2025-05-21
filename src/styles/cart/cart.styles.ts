import styled from '@emotion/styled';
import {
    Avatar,
    Badge,
    Box,
    Button,
    ButtonProps,
    Card,
    CardContent,
    CardMedia,
    Chip,
    Container,
    DialogContent,
    Typography
} from '@mui/material';
import { COLORS_DARK } from '@/data';
import { TemperatureBadgeProps } from '@/types/cart';
import { ShoppingCart } from 'lucide-react';
import { keyframes } from '@emotion/react';

interface ConfirmHeaderProps {
    isMobile: boolean;
}

const slideMarquee = keyframes`
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
`;

export const PageWrapper = styled.div`
    width: 100%;
    max-width: 950px;
    .cart-wrapper {
        display: flex;
        justify-content: center;
    }
`;

export const CartContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
    max-width: 680px;
`;

export const CartButton = styled.button`
    width: 100%;
    height: 40px;
    font-size: 16px;
    font-weight: bold;
    border-radius: 5px;
    border: 1px solid ${COLORS_DARK.accent.main};
    box-sizing: border-box;
    background-color: ${COLORS_DARK.accent.main};
    color: #fff;
    padding: 0 10px;
    text-align: center;
    margin: 20px 0;
    cursor: pointer;
`;

export const StyledMenuTitle = styled(Typography)(({ theme }) => ({
    fontWeight: 'bold',
    fontSize: '1.3rem',

    color: COLORS_DARK.text.primary,
    textAlign: 'center',
    whiteSpace: 'pre-line',

    [theme.breakpoints.up('sm')]: {
        fontSize: '1.5rem'
    }
}));

export const StyledMenuTitleWithName = styled(Box)(({ theme }) => ({
    fontWeight: 'bold',
    fontSize: '1.1rem',
    color: COLORS_DARK.text.primary,
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',

    [theme.breakpoints.up('lg')]: {
        fontSize: '1.2rem'
    },

    [theme.breakpoints.up(762)]: {
        flexDirection: 'row',
        whiteSpace: 'nowrap',
        textAlign: 'center',
        fontSize: '1.3rem'
    }
}));

// 온도 뱃지를 위한 Box 컴포넌트
export const StyledMenuTempBox = styled.div`
    display: flex;
    gap: 8px;
    margin-top: 8px;
    justify-content: flex-start;
`;

export const TabIcon = styled(StyledMenuTempBox)`
    margin-bottom: 0.5rem;
    display: flex;
    justify-content: center;
`;

export const MenuCardMedia = styled(CardMedia, {
    shouldForwardProp: prop => prop !== 'isMenu'
})<{ isMenu: boolean }>(({ isMenu }) => ({
    height: 0,
    paddingTop: '100%',
    backgroundColor: 'white',
    position: 'relative',
    transition: 'transform 0.3s ease',
    ...(!isMenu && {
        '&:hover': {
            transform: 'scale(1.05)'
        }
    })
}));

export const PageContainer = styled(Container)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    width: '100%',

    backgroundColor: theme.palette.background.default,
    padding: 16,

    [theme.breakpoints.up('lg')]: {
        padding: '24px 16px 16px 16px',
        width: '90%',
        margin: '0 auto'
    }
}));

interface ConfirmHeaderProps {
    isMobile: boolean;
}

// styled 컴포넌트 정의
export const StyledCartHeader = styled(Box, {
    shouldForwardProp: prop => prop !== 'isMobile'
})<ConfirmHeaderProps>(({ isMobile, theme }) => ({
    position: 'sticky',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px 0 14px 10px',
    // padding: isMobile ? '14px 8px' : 16,
    marginBottom: isMobile ? 0 : 16,
    borderBottom: `1px solid ${COLORS_DARK.border.default}`,
    backgroundColor: COLORS_DARK.background.main,
    // 아이콘 크기 반응형 조정
    svg: {
        width: '1.4rem',
        height: '1.4rem',
        [theme.breakpoints.up('sm')]: {
            width: '1.6rem',
            height: '1.6rem'
        },
        [theme.breakpoints.up('md')]: {
            width: '1.75rem',
            height: '1.75rem'
        }
    }
}));

export const StyledCartHeaderTitle = styled(Typography, {
    shouldForwardProp: prop => prop !== 'isMobile' && prop !== 'maxWidth'
})<{
    isMobile: boolean;
    maxWidth?: number;
}>(({ isMobile, maxWidth, theme }) => ({
    maxWidth: !isMobile ? (maxWidth ? `${maxWidth - 10}px` : '400px') : 'none',
    // maxWidth: maxWidth ? `${maxWidth - 10}px` : isMobile ? '160px' : '400px',
    overflow: 'hidden',
    marginRight: isMobile ? '12px' : 0,
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    cursor: isMobile ? 'pointer' : 'default',
    fontWeight: 700,
    color: COLORS_DARK.text.primary,
    fontSize: '1.2rem',

    [theme.breakpoints.up('sm')]: {
        fontSize: '1.3rem'
    },
    [theme.breakpoints.up('md')]: {
        fontSize: '1.4rem'
    }
}));

export const HeaderContent = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column', // 기본적으로 두 줄 (모바일)
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '1.5rem',
    marginBottom: '1.2rem',
    textAlign: 'center',
    overflow: 'hidden',
    fontWeight: 'bold',
    fontSize: '1.3rem',

    [theme.breakpoints.up('sm')]: {
        fontWeight: 'bold',
        fontSize: '1.3rem',
        flexDirection: 'row', // PC에서는 한 줄
        whiteSpace: 'nowrap',
        alignItems: 'center',
        textAlign: 'center',
        justifyContent: 'center',
        gap: '4px',
        overflow: 'hidden'
    }
}));

export const ScrollableContent = styled(Box)`
    flex: 1;
    overflow-y: auto;

    &.mobile {
        padding: 16px 0 16px 0; // 모바일일 때 패딩 제거
    }
`;

export const LinkShareCard = styled(Card)({
    overflow: 'hidden',
    backgroundColor: COLORS_DARK.theme.blue,
    border: `1px solid ${COLORS_DARK.background.lighter}`,
    borderRadius: '20px',
    marginBottom: '16px'
});

export const LinkShareContent = styled(CardContent)({
    padding: '12px !important'
});

export const ButtonsContainer = styled(Box, {
    shouldForwardProp: prop => prop !== 'disabledAll'
})<{ disabledAll?: boolean }>(({ disabledAll }) => ({
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 16,
    marginTop: disabledAll ? 0 : 16
}));

export const ButtonIcon = styled(Box)<{ disabled?: boolean }>(({ disabled }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    svg: {
        color: disabled ? COLORS_DARK.text.disabled : COLORS_DARK.accent.main
    }
}));

export const OrderFooter = styled.div`
    position: fixed;
    inset: auto 0 0 0;
    background-color: ${COLORS_DARK.theme.blue};
    z-index: 10;
    padding: 16px;
    box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.2);

    @media (max-height: 700px) {
        padding: 12px;
        min-height: 40px;
    }
    min-height: 50px;
`;

export const OrderAmountCard = styled.div`
    background-color: ${COLORS_DARK.theme.purple};
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 16px;
    border: 1px solid rgba(255, 171, 0, 0.2);

    @media (max-height: 700px) {
        padding: 12px;
    }
`;

export const FooterButton = styled(Button)<ButtonProps>(({ theme, variant, disabled }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,

    [theme.breakpoints.down('sm')]: {
        padding: '8px 0'
    },

    '@media (max-height: 700px)': {
        fontSize: '0.875rem'
    },
    padding: '12px 0',
    width: '100%',
    borderRadius: 12,

    border: `2px solid ${COLORS_DARK.accent.main}`,
    backgroundColor: variant === 'contained' ? COLORS_DARK.accent.main : 'white',
    color: variant === 'contained' ? '#fff' : COLORS_DARK.accent.main,

    '& svg': {
        color: variant === 'contained' ? '#fff' : COLORS_DARK.accent.main
    },

    '&:hover': {
        backgroundColor: variant === 'contained' ? '#e08a1e' : '#f5f5f5'
    },

    ...(disabled && {
        backgroundColor: theme.palette.action.disabledBackground,
        color: theme.palette.action.disabled,
        border: `2px solid ${theme.palette.action.disabled}`,
        cursor: 'not-allowed',

        '& svg': {
            color: theme.palette.action.disabled
        }
    })
}));

export const CartItemCard = styled(Card)({
    marginBottom: 16,
    overflow: 'hidden',
    transition: 'all 0.2s ease-in-out',
    borderRadius: '12px',
    '&:hover': {
        transform: 'translateY(-2px)'
    }
});

export const CartItemContent = styled(CardContent)(({ theme }) => ({
    padding: '16px',
    [theme.breakpoints.down('sm')]: {
        padding: '12px !important'
    },
    [theme.breakpoints.up(680)]: {
        padding: '20px'
    }
}));

export const ItemImage = styled(Box, {
    shouldForwardProp: prop => prop !== 'width' && prop !== 'height'
})<{ width?: number | string; height?: number | string }>(({ theme, width, height }) => ({
    position: 'relative',
    width: width ?? 60,
    height: height ?? 60,
    borderRadius: 8,
    overflow: 'hidden',
    flexShrink: 0,
    [theme.breakpoints.up('md')]: {
        width: width ?? 100,
        height: height ?? 100
    }
}));

export const UserAvatar = styled(Avatar)(({ theme }) => ({
    fontWeight: 600,
    backgroundColor: 'white', //COLORS_DARK.accent.main,
    color: COLORS_DARK.text.primary,
    '& img': {
        height: 'auto !important', // height 제거
        width: '100%',
        objectFit: 'contain' // 비율 유지
    },
    padding: 2,
    // xs (모바일)
    width: 24,
    height: 24,
    fontSize: '0.875rem',
    marginRight: 6,

    [theme.breakpoints.up('sm')]: {
        width: 28,
        height: 28,
        fontSize: '1rem',
        marginRight: 8
    },
    [theme.breakpoints.up('md')]: {
        width: 32,
        height: 32,
        marginRight: 8
    }
}));

export const ConfirmTemperatureBadge = styled(Chip)<TemperatureBadgeProps>(({ theme, temperature, height }) => ({
    height: height,
    borderRadius: 4,
    fontWeight: 600,
    fontSize: '0.65rem',
    backgroundColor: temperature === 'ICED' ? COLORS_DARK.badge.ice : COLORS_DARK.badge.hot,
    color: '#fff',
    marginTop: -1,
    boxShadow: 'none',
    [theme.breakpoints.down('sm')]: {
        fontSize: '0.6rem'
    },
    [theme.breakpoints.up('md')]: {
        fontSize: '0.75rem'
    }
}));

export const StyledScrollableCartList = styled(Box, {
    shouldForwardProp: prop =>
        prop !== 'bottomHeight' && prop !== 'isEmpty' && prop !== 'footerOpen' && prop !== 'isScrollable'
})<{ bottomHeight: number; isEmpty?: boolean; footerOpen: boolean; isScrollable: boolean }>(
    ({ theme, footerOpen, bottomHeight }) => ({
        flex: 1,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        paddingBottom: footerOpen && bottomHeight > 24 ? bottomHeight : 24,

        '&::-webkit-scrollbar': {
            width: 0,
            height: 0
        },
        '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'transparent'
        },

        [theme.breakpoints.down('md')]: {
            paddingTop: '16px'
        },

        [theme.breakpoints.up('sm')]: {
            '&::-webkit-scrollbar': {
                width: '6px'
            },
            '&::-webkit-scrollbar-track': {
                backgroundColor: COLORS_DARK.background.main
            },
            scrollbarWidth: 'thin',
            scrollbarColor: 'auto #212529'
        },
        [theme.breakpoints.up('lg')]: {
            paddingTop: 6
        }
    })
);

export const ShoppingCartIcon = styled(ShoppingCart)(({ theme }) => ({
    width: 60,
    height: 60,
    color: COLORS_DARK.text.tertiary,
    marginBottom: theme.spacing(3),
    [theme.breakpoints.down('sm')]: {
        width: 48,
        height: 48
    },
    [theme.breakpoints.down('xs')]: {
        width: 40,
        height: 40
    }
}));

export const CartWarningWrapper = styled(Box)<{ isOverflowed: boolean }>(({ theme }) => ({
    width: '100%',
    maxWidth: 902,
    overflow: 'hidden',
    padding: '10px',
    borderRadius: '12px',
    border: '1px solid #ff6b6b',
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    textAlign: 'center',
    position: 'relative',
    marginTop: '12px',
    [theme.breakpoints.down('md')]: {
        marginTop: '8px',
        padding: '8px'
    }
}));

export const CartWarningText = styled('div')<{ isOverflowed: boolean }>(({ theme, isOverflowed }) => ({
    display: 'flex',
    whiteSpace: 'nowrap',
    fontWeight: 700,
    color: '#ff6b6b',
    // fontSize: '0.8rem',
    alignItems: 'center',
    justifyContent: isOverflowed ? 'unset' : 'center',
    // [theme.breakpoints.up('sm')]: {
    //     fontSize: '0.95rem'
    // },
    // [theme.breakpoints.up('xs')]: {
    //     fontSize: '0.9rem'
    // },
    // [theme.breakpoints.up('md')]: {
    //     fontSize: '1rem'
    // },
    // [theme.breakpoints.up('lg')]: {
    //     fontSize: '18px'
    // },
    overflow: 'hidden',
    position: 'relative',
    '.marquee': {
        display: 'flex',
        whiteSpace: 'nowrap',
        flexWrap: 'nowrap',
        animation: isOverflowed ? `${slideMarquee} 25s linear infinite` : 'none'
    },
    '.marquee-content': {
        display: 'inline-block',
        whiteSpace: 'nowrap'
    }
}));

export const OrderLabelTypography = styled(Typography)(({ theme }) => ({
    fontWeight: 700,
    color: COLORS_DARK.text.primary,
    fontSize: '0.875rem', // 기본값: xs

    [theme.breakpoints.up('sm')]: {
        fontSize: '1rem'
    },
    [theme.breakpoints.up('md')]: {
        fontSize: '1.15rem'
    },

    '@media (max-height: 700px)': {
        fontSize: '0.875rem'
    }
}));

export const OrderPriceTypography = styled(Typography)(({ theme }) => ({
    fontWeight: 700,
    color: COLORS_DARK.text.primary,
    fontSize: '1rem', // 기본값: xs

    [theme.breakpoints.up('sm')]: {
        fontSize: '1.15rem'
    },
    [theme.breakpoints.up('md')]: {
        fontSize: '1.3rem'
    },
    [theme.breakpoints.up('xl')]: {
        fontSize: '1.35rem'
    },
    [theme.breakpoints.up('xxl')]: {
        fontSize: '1.4rem'
    }
}));

export const QuantityTypography = styled(Typography)(({ theme }) => ({
    color: COLORS_DARK.text.primary,
    fontWeight: 500,
    fontSize: '0.9rem',

    [theme.breakpoints.up('sm')]: {
        fontSize: '0.95rem'
    },
    [theme.breakpoints.up('md')]: {
        fontSize: '1rem'
    }
    // [theme.breakpoints.up('lg')]: {
    //     fontSize: '1rem'
    // }
}));

export const PriceTypography = styled(Typography)(({ theme }) => ({
    color: COLORS_DARK.accent.main,
    fontWeight: 700,
    fontSize: '1.1rem', // 기본값(xs 기준)

    // [theme.breakpoints.up('sm')]: {
    //     fontSize: '1.2rem'
    // },
    [theme.breakpoints.up('md')]: {
        fontSize: '1.2rem'
    }
}));

export const SnackbarDialogContent = styled(DialogContent)({
    backgroundColor: COLORS_DARK.theme.purple,
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '320px',
    width: 'auto',
    minHeight: '90px',
    boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.5)'
});

export const SnackbarDialogText = styled(Typography)(({ theme }) => ({
    fontWeight: 700,
    color: COLORS_DARK.text.primary,
    marginLeft: '0.3rem',
    fontSize: '0.875rem',
    [theme.breakpoints.up('md')]: {
        fontSize: '0.95rem'
    },
    [theme.breakpoints.up('lg')]: {
        fontSize: '1rem'
    },
    [theme.breakpoints.up('xl')]: {
        fontSize: '1.1rem'
    },
    [theme.breakpoints.up('xxl')]: {
        fontSize: '1.125rem'
    },
    [theme.breakpoints.up('xxxl')]: {
        fontSize: '1.2rem'
    }
}));

export const MenuImageContainer = styled(Box)(({ theme }) => ({
    width: 40,
    height: 40,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 8,
    flexShrink: 0,
    border: '1px solid rgba(255, 255, 255, 0.2)',

    [theme.breakpoints.down(330)]: {
        width: 35,
        height: 35
    },

    [theme.breakpoints.up('sm')]: {
        width: 45,
        height: 45,
        marginRight: 10
    },

    [theme.breakpoints.up('md')]: {
        width: 48,
        height: 48,
        marginRight: 12
    }
}));

export const MenuCount = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D97706',
    color: '#FFFFFF',
    borderRadius: '20%',
    fontWeight: 'bold',
    width: 20,
    height: 22,
    [theme.breakpoints.up('sm')]: {
        width: 24,
        height: 28
    }
}));
