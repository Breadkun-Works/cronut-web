import React from 'react';
import {
    NotificationBoxWrap,
    NotificationSubTitle,
    NotificationTitle
} from '@/styles/components/NotificationBox.styles';

function NotificationBox({ firstText, secText, bgColor }: { firstText: string; secText: string; bgColor?: string }) {
    return (
        <>
            <NotificationBoxWrap bgColor={bgColor}>
                <NotificationTitle>{firstText}</NotificationTitle>
                <NotificationSubTitle>{secText}</NotificationSubTitle>
            </NotificationBoxWrap>
        </>
    );
}

export default NotificationBox;
