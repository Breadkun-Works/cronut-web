import CartMenuById from '@/components/page/cafe/menu/cafemenu-by-id';
import { ICartInfo } from '@/types/cart';
const getCartById = async (cartId: string): Promise<any> => {
    const secretKey = process.env.SECRET_ENCRYPT_KEY;
    console.log('📌 SECRET_ENCRYPT_KEY:', secretKey); // ✅ SECRET_ENCRYPT_KEY 확인 (디버깅)

    if (!secretKey) {
        throw new Error('SECRET_ENCRYPT_KEY not found');
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cafe/carts/${cartId}`, {
        headers: {
            Accept: 'application/vnd.breadkun.v1+json',
            Origin: 'http://localhost:3000',
            'X-SSR-Token': secretKey // ✅ SECRET_ENCRYPT_KEY를 X-SSR-Token으로 전달,
        }
    });

    return response.json();
};

// ✅ SSR로 데이터를 로드하여 클라이언트 컴포넌트로 전달
export default async function CartMenuPage({ params }: { params: { id: string; userId: string } }) {
    const cartId = params.id;
    console.log('📌 Cart ID:', cartId);

    try {
        const cartBasic = await getCartById(cartId);
        return <CartMenuById cartBasic={cartBasic.data.cafeCart} entry={'personalCart'} cartId={cartId} />;
    } catch (error) {
        console.error('Error fetching cart:', error);
        return <div>Error loading cart. Please try again.</div>;
    }
}
