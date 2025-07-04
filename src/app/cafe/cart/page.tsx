import { CartPage } from '@/components/page/cafe/CartPage';
import { createPageMetadata } from '@/utils/metadata';

export const generateMetadata = () =>
    createPageMetadata('장바구니', '카페 장바구니 메뉴를 이용해보세요!', '카페 장바구니 메뉴를 이용해보세요!');

const Cart = () => {
    return <CartPage />;
};
export default Cart;
