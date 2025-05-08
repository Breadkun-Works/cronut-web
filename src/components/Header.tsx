'use client';
import React, { useEffect } from 'react';
import styles from '../styles/Header.module.scss';
import classNames from 'classnames/bind';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import MenuBox from './MenuBox';
import { useAtom } from 'jotai';
import { menuBoxAtom, windowResizeAtom } from '@/atom/common-atom';

const hs = classNames.bind(styles);

function Header() {
    const [menuBox, setMenuBox] = useAtom(menuBoxAtom);
    const [, setResize] = useAtom(windowResizeAtom);

    const router = usePathname();

    // 윈도우 리사이즈 감지 (Jotai로 처리)
    useEffect(() => {
        const handleResize = () => setResize(); // Atom에서 처리
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [setResize]);

    return (
        <>
            <header className={hs('header')}>
                <Link href={'/'}>
                    <img
                        className={hs('header__logo')}
                        src="/logo/breadkunLogoDarkMode.webp"
                        alt="breadkun-header-logo"
                    />
                </Link>
                <nav className={hs('header__nav')}>
                    <button className={hs('header__nav--button')} onClick={() => setMenuBox(true)}>
                        <img
                            className={hs('header__nav--button--img')}
                            src="/icon/header-menu-button.webp"
                            alt="breadkun-header-menu"
                        />
                    </button>
                    <div className={hs('header__nav--menus')}>
                        <Link
                            className={router === '/' ? hs('header__nav--menu', 'active') : hs('header__nav--menu')}
                            // className={({ isActive }) =>
                            //     isActive ? hs('header__nav--menu', 'active') : hs('header__nav--menu')
                            // }
                            href={'/'}
                            onClick={() => setMenuBox(false)}
                        >
                            HOME
                        </Link>
                        <Link
                            className={router === '/meal' ? hs('header__nav--menu', 'active') : hs('header__nav--menu')}
                            // className={({ isActive }) =>
                            //     isActive ? hs('header__nav--menu', 'active') : hs('header__nav--menu')
                            // }
                            href={'/meal'}
                            onClick={() => setMenuBox(false)}
                        >
                            MEAL
                        </Link>
                        <Link
                            className={router === '/bus' ? hs('header__nav--menu', 'active') : hs('header__nav--menu')}
                            // className={({ isActive }) =>
                            //     isActive ? hs('header__nav--menu', 'active') : hs('header__nav--menu')
                            // }
                            href={'/bus'}
                            onClick={() => setMenuBox(false)}
                        >
                            BUS
                        </Link>
                        <Link
                            className={
                                router.startsWith('/cafe') ? hs('header__nav--menu', 'active') : hs('header__nav--menu')
                            }
                            href={'/cafe/menu'}
                            onClick={() => setMenuBox(false)}
                        >
                            CAFE
                        </Link>
                    </div>
                </nav>
            </header>
            {menuBox && <MenuBox setMenuBox={setMenuBox} />}
        </>
    );
}

export default Header;
