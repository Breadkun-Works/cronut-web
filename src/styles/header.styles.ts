import { IconButton } from '@mui/material';
import styled from '@emotion/styled';
import { Ellipsis, Headset } from 'lucide-react';

export const MobileMenuButton = styled(IconButton)(({ theme }) => ({
    display: 'none',
    [theme.breakpoints.down(768)]: {
        display: 'flex'
    }
}));

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
