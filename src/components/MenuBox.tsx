'use client';
import React, { useEffect } from 'react';
import styles from '../styles/MenuBox.module.scss';
import classNames from 'classnames/bind';
import Link from 'next/link';
import { InquiryModal } from '@/components/InquiryModal';
import { usePathname } from 'next/navigation';
import { useModal } from '@/atom/common-atom';

const ms = classNames.bind(styles);

function MenuBox({ setMenuBox }: { setMenuBox: React.Dispatch<React.SetStateAction<boolean>> }) {
    const router = usePathname();
    const { openModal, closeModal, modal } = useModal('inquiryModal');
    useEffect(() => {
        const handleTouchMove = (e: TouchEvent) => e.preventDefault();
        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setMenuBox(false);
            }
        };

        document.body.style.overflow = 'hidden';
        document.body.addEventListener('touchmove', handleTouchMove, { passive: false });
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            document.body.style.overflow = 'visible';
            document.body.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [setMenuBox]);

    return (
        <div className={ms('menu-box')}>
            <div className={ms('menu-box__mask')} onClick={() => setMenuBox(false)} />
            <nav className={ms('menu-box__menus')}>
                <Link
                    className={router === '/' ? ms('menu-box__menu-active') : ms('menu-box__menu')}
                    href={'/'}
                    onClick={() => setMenuBox(false)}
                >
                    HOME
                </Link>
                <Link
                    className={router === '/meal' ? ms('menu-box__menu-active') : ms('menu-box__menu')}
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
                <Link
                    className={router.startsWith('/cafe') ? ms('menu-box__menu-active') : ms('menu-box__menu')}
                    href={'/cafe/menu'}
                    onClick={() => setMenuBox(false)}
                >
                    CAFE
                </Link>
                <button className={ms('menu-box__exit')} onClick={() => setMenuBox(false)}>
                    닫기
                </button>
                <InquiryModal isOpen={modal.isOpen} onClose={closeModal} />
            </nav>
        </div>
    );
}

export default MenuBox;
