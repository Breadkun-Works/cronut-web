import { atom } from 'jotai';
import { ISnackbarTypes } from '@/components/common/snackbar';
import { Company } from '@/types/common';

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
