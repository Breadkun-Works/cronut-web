import { atom } from 'jotai';
import { CafeCartItem } from '@/types/cart';

// 장바구니 아이템 리스트 (전역 Atom)
export const cartItemsAtom = atom<CafeCartItem[]>([]);

// 장바구니 아이템 개수 (전역 Atom)
export const cartItemsCountAtom = atom(get => get(cartItemsAtom).length);
