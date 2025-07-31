'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { MobileNav, MenuBoxWrap, MenuItem, MenuCloseButton } from '@/styles/components/MenuBox.styles';
import { Close } from '@mui/icons-material';

function MenuBox({ setMenuBox }: { setMenuBox: React.Dispatch<React.SetStateAction<boolean>> }) {
    const router = usePathname();
    const activePaths = ['/cafe/menu', '/cafe/cart/menu'];
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
        <>
            <MenuBoxWrap onClick={() => setMenuBox(false)}>
                <MenuCloseButton onClick={() => setMenuBox(false)}>
                    <Close />
                </MenuCloseButton>
                <MobileNav>
                    <ul>
                        <li>
                            <MenuItem href={'/'} onClick={() => setMenuBox(false)} active={router === '/'}>
                                HOME
                            </MenuItem>
                        </li>
                        <li>
                            <MenuItem href={'/meal'} onClick={() => setMenuBox(false)} active={router === '/meal'}>
                                MEAL
                            </MenuItem>
                        </li>
                        <li>
                            <MenuItem href={'/bus'} onClick={() => setMenuBox(false)} active={router === '/bus'}>
                                BUS
                            </MenuItem>
                        </li>
                        <li>
                            <MenuItem
                                href={'/cafe/menu'}
                                onClick={() => setMenuBox(false)}
                                active={activePaths.some(path => router.startsWith(path))}
                            >
                                CAFE
                            </MenuItem>
                        </li>
                    </ul>
                </MobileNav>
            </MenuBoxWrap>
        </>
    );
}

export default MenuBox;
