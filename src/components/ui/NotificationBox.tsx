import React from 'react';
import styles from '../../styles/NotificationBox.module.scss';
import classNames from 'classnames/bind';

const ns = classNames.bind(styles);

function NotificationBox({ firstText, secText }: { firstText: string; secText: string }) {
    return (
        <div className={ns('bus__notification-wrapper')}>
            <div className={ns('bus__notification')}>
                <div>{firstText}</div> <div>{secText}</div>
            </div>
        </div>
    );
}

export default NotificationBox;
