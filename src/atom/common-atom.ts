import { atom, useAtom } from 'jotai';
import { ISnackbarTypes } from '@/components/common/snackbar';
import { Company } from '@/types/common';
import { useEffect } from 'react';
import { atomFamily, useResetAtom } from 'jotai/utils';

// 메뉴 상태 Atom
export const menuBoxAtom = atom(false);

export const windowResizeAtom = atom(null, (get, set) => {
    if (get(menuBoxAtom) && window.innerWidth >= 768) {
        set(menuBoxAtom, false);
    }
});

// 클라이언트에서만 초기화되는 Atom
export const companyAtom = atom<Company>(Company.KANGCHON); // 기본값

export const snackBarAtom = atom<ISnackbarTypes>({
    message: '',
    severity: 'success',
    open: false
});

// atomFamily로 모달 상태 관리
export const modalAtomFamilyTest = atomFamily((modalId: string) => atom({ id: modalId, isOpen: false }));

export const useModal = (modalId: string) => {
    const [modal, setModal] = useAtom(modalAtomFamilyTest(modalId));

    const openModal = () => {
        setModal({ id: modalId, isOpen: true });
        document.body.style.overflow = 'hidden'; //모달을 연 상태에서는 스크롤 안 되게
    };

    const closeModal = () => {
        setModal({ id: modalId, isOpen: false });
        document.body.style.overflow = 'unset';
    };

    // ✅ 새로고침 또는 페이지 이동 시 모달 닫기
    useEffect(() => {
        const handleUnload = () => {
            setModal({ id: modalId, isOpen: false });
            document.body.style.overflow = 'unset';
        };

        window.addEventListener('unload', handleUnload);
        return () => {
            window.removeEventListener('unload', handleUnload);
        };
    }, [setModal, modalId]);

    return { modal, setModal, openModal, closeModal };
};
