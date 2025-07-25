import styled from '@emotion/styled';

export const NotificationBoxWrap = styled.div`
    position: fixed;
    top: 50%;
    left: 50%;
    padding: 20px 50px;
    border-radius: 12px;
    transform: translate(-50%, -50%);
    text-align: center;
    background-color: ${({ bgColor }) => (bgColor ? bgColor : '#834A00')};
    box-sizing: border-box;

    ${({ theme }) => theme.breakpoints.down('md')} {
        width: 80%;
        padding: 20px 0;
    }
`;

export const NotificationTitle = styled.h4`
    margin: 0 0 10px 0;
    font-size: 25px;
`;

export const NotificationSubTitle = styled.p`
    margin: 0;
    font-size: 20px;
`;
