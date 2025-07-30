import styled from '@emotion/styled';
import { Ellipsis, Headset } from 'lucide-react';
import { inner } from '@/styles/common.styles';
import { css } from '@emotion/react';

export const HeaderWrap = styled.div<{ bg?: string }>`
    display: flex;
    align-items: center;
    position: sticky;
    top: 0;
    height: 80px;
    background-color: #212529;
    box-sizing: border-box;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
    z-index: 11;

    ${({ theme }) => theme.breakpoints.down('xl')} {
        padding: 0 15px;
    }

    ${({ theme }) => theme.breakpoints.down('lg')} {
        height: 60px;
        border-radius: 0 0 20px 20px;
    }
`;

export const HeaderContent = styled.div`
    ${inner};

    display: flex;
    align-items: center;
    justify-content: space-between;
`;

export const HeaderLogo = styled.div`
    a {
        display: flex;
        align-items: center;
    }

    img {
        width: 130px;
    }

    ${({ theme }) => theme.breakpoints.down('md')} {
        img {
            width: 85px;
        }
    }
`;

export const MenuWrap = styled.div`
    display: flex;
    align-items: center;
`;

export const Menu = styled.div`
    display: flex;
    align-items: center;
    gap: 50px;
    font-size: 25px;

    ${({ theme }) => theme.breakpoints.down('lg')} {
        display: none;
    }
`;

export const MenuItem = styled.a<{ active?: boolean }>`
    text-decoration: none;
    opacity: 0.5;

    ${({ active }) =>
        active &&
        css`
            font-weight: bold;
            opacity: 1;
        `}
`;

export const MobileMenuButton = styled.button`
    display: none;
    padding: 0;

    &:not(:last-of-type) {
        margin-right: 5px;
    }

    ${({ theme }) => theme.breakpoints.down('lg')} {
        display: flex;
    }
`;

export const StyledEllipsis = styled(Ellipsis)(({ theme }) => ({
    width: '3rem',
    height: '3rem',

    [theme.breakpoints.down('md')]: {
        width: '2.5rem',
        height: '2.5rem'
    },

    [theme.breakpoints.down('sm')]: {
        width: '2.2rem',
        height: '2.2rem'
    }
}));

export const StyledHeadset = styled(Headset)(({ theme }) => ({
    width: '2.2rem',
    height: '2.2rem',
    marginLeft: '0.4rem',
    marginRight: '0.4rem',

    [theme.breakpoints.down('md')]: {
        width: '1.8rem',
        height: '1.8rem',
        marginLeft: '0.3rem',
        marginRight: '0.3rem'
    }
}));
