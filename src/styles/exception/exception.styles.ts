import styled from '@emotion/styled';
import { Box } from '@mui/material';

export const StyledBox = styled(Box)(({ theme }) => ({
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(4),
    minHeight: 'calc(100vh - 90px)'
}));
