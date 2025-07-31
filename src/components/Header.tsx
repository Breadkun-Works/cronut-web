'use client';
import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import MenuBox from './MenuBox';
import { useAtom } from 'jotai';
import { menuBoxAtom, windowResizeAtom, useModal } from '@/atom/common-atom';
import {
    HeaderLogo,
    HeaderWrap,
    HeaderContent,
    Menu,
    MenuItem,
    MenuWrap,
    MobileMenuButton,
    StyledMenu,
    StyledHeadset
} from '@/styles/components/header.styles';
import { InquiryModal } from '@/components/InquiryModal';

function Header() {
    const [menuBox, setMenuBox] = useAtom(menuBoxAtom);
    const [, setResize] = useAtom(windowResizeAtom);
    const router = usePathname();
    const { openModal, closeModal, modal } = useModal('inquiryModal');

    // 윈도우 리사이즈 감지 (Jotai로 처리)
    useEffect(() => {
        const handleResize = () => setResize(); // Atom에서 처리
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [setResize]);

    return (
        <>
            <HeaderWrap>
                <HeaderContent>
                    <HeaderLogo>
                        <Link href={'/'}>
                            <img src={'/logo/breadkunLogoDarkMode.webp'} alt={'메인 로고'} />
                        </Link>
                    </HeaderLogo>

                    <MenuWrap>
                        <Menu>
                            <MenuItem href={'/'} onClick={() => setMenuBox(false)} active={router === '/'}>
                                HOME
                            </MenuItem>
                            <MenuItem href={'/meal'} onClick={() => setMenuBox(false)} active={router === '/meal'}>
                                MEAL
                            </MenuItem>
                            <MenuItem href={'/bus'} onClick={() => setMenuBox(false)} active={router === '/bus'}>
                                BUS
                            </MenuItem>
                            <MenuItem
                                href={'/cafe/menu'}
                                onClick={() => setMenuBox(false)}
                                active={router === '/cafe/menu'}
                            >
                                CAFE
                            </MenuItem>
                        </Menu>
                        <MobileMenuButton onClick={openModal}>
                            <StyledHeadset />
                        </MobileMenuButton>
                        <MobileMenuButton onClick={() => setMenuBox(true)}>
                            <StyledMenu />
                        </MobileMenuButton>
                    </MenuWrap>
                </HeaderContent>
            </HeaderWrap>
            {menuBox && <MenuBox setMenuBox={setMenuBox} />}
            <InquiryModal isOpen={modal.isOpen} onClose={closeModal} />
        </>
    );
}

export default Header;
