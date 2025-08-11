import styled from '@emotion/styled';

export const FooterText = styled.p`
    margin-top: 25px;
    font-size: 12px;
    text-align: center;
    color: #94a3b8;

    br {
        display: none;
    }

    ${({ theme }) => theme.breakpoints.down('md')} {
        br {
            display: block;
        }
    }
`;
