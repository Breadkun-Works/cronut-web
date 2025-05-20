import { IconButton } from '@mui/material';
import styled from '@emotion/styled';
import { Ellipsis } from 'lucide-react';

export const MobileMenuButton = styled(IconButton)(({ theme }) => ({
    display: 'none',
    [theme.breakpoints.down(768)]: {
        display: 'flex'
    }
}));

export const StyledEllipsis = styled(Ellipsis)(({ theme }) => ({
    width: '3rem',
    height: '3rem',
    [theme.breakpoints.down('xs')]: {
        width: '2.5rem',
        height: '2.5rem'
    }
}));
