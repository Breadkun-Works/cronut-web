import React, { useEffect } from 'react';
import styles from '../style/MenuBox.module.scss';
import classNames from 'classnames/bind';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const ms = classNames.bind(styles);

function MenuBox({ setMenuBox }: { setMenuBox: React.Dispatch<React.SetStateAction<boolean>> }) {
    const handleTouchMove = (e: TouchEvent) => e.preventDefault();

    const router = usePathname();

    useEffect(() => {
        const parentElement = document.body; // DOM의 body 태그 지정
        // MenuBox 마운트시,
        parentElement.style.overflow = 'hidden';
        parentElement.addEventListener('touchmove', handleTouchMove, { passive: false }); // Touch 디바이스 스크롤 정지
        // MenuBox 언마운트시,
        return () => {
            parentElement.style.overflow = 'visible';
            parentElement.removeEventListener('touchmove', handleTouchMove); // Touch 디바이스 스크롤 정지 해제
        };
    }, []);

    return (
        <div className={ms('menu-box')}>
            <div className={ms('menu-box__mask')} onClick={() => setMenuBox(false)} />
            <nav className={ms('menu-box__menus')}>
                <Link
                    className={router === '/' ? ms('menu-box__menu-active') : ms('menu-box__menu')}
                    // className={({ isActive }) => (isActive ? ms('menu-box__menu-active') : ms('menu-box__menu'))}
                    href={'/'}
                    onClick={() => setMenuBox(false)}
                >
                    HOME
                </Link>
                <Link
                    className={router === '/meal' ? ms('menu-box__menu-active') : ms('menu-box__menu')}
                    // className={({ isActive }) => (isActive ? ms('menu-box__menu-active') : ms('menu-box__menu'))}
                    href={'/meal'}
                    onClick={() => setMenuBox(false)}
                >
                    MEAL
                </Link>
                <Link
                    className={router === '/bus' ? ms('menu-box__menu-active') : ms('menu-box__menu')}
                    // className={({ isActive }) => (isActive ? ms('menu-box__menu-active') : ms('menu-box__menu'))}
                    href={'/bus'}
                    onClick={() => setMenuBox(false)}
                >
                    BUS
                </Link>
                <button className={ms('menu-box__exit')} onClick={() => setMenuBox(false)}>
                    닫기
                </button>
            </nav>
        </div>
    );
}

export default MenuBox;
