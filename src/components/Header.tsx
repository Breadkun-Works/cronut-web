'use client';
import React from 'react';
import styles from '../styles/Header.module.scss';
import classNames from 'classnames/bind';
import Link from 'next/link';
import { useMenuContext } from '@/context/MenuContext';
import { usePathname } from 'next/navigation';
import MenuBox from './MenuBox';

const hs = classNames.bind(styles);

function Header() {
    const { menuBox, setMenuBox } = useMenuContext();

    const router = usePathname();

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
