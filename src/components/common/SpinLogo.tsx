import React from 'react';
import styles from '../../styles/SpinLogo.module.scss';
import classNames from 'classnames/bind';
import Link from 'next/link';

const ss = classNames.bind(styles);

function SpinLogo({ minHeight, text1, text2 }: { minHeight: string; text1: string; text2: string }) {
    return (
        <div className={ss('spinLogo')}>
            <div className={ss('spinLogo__wrap')} style={{ minHeight: minHeight }}>
                <Link href={'/'}>
                    <img className={ss('spinLogo__wrap--logoImg')} src={'/logo/breadkunSpinLogo.webp'} alt="logo" />
                </Link>
                <div>
                    <div className={ss('spinLogo__wrap--text')}>{text1}</div>
                    <div className={ss('spinLogo__wrap--text')}>{text2}</div>
                </div>
            </div>
        </div>
    );
}

SpinLogo.defaultProps = { minHeight: '100vh' };

export default SpinLogo;
