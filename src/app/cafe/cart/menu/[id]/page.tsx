import CartMenuById from '@/components/page/cafe/menu/cafemenu-by-id';
import { Metadata } from 'next';
import { DEFAULT_OG_IMAGE } from '@/data';
import { fetchCart } from '@/apis/cafe/cafe-api';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
    const cartData = await fetchCart(params.id);

    const cart = cartData.data.cafeCart;

    return {
        title: `${cart.title} | 카페 메뉴 - BBANGDORI`,
        description: cart.description,
        openGraph: {
            title: `${cart.title} | 카페 메뉴 - BBANGDORI`,
            description: `🛒 ${cart.title} 장바구니에 음료를 담아보세요~☕️🍞🥐`,
            images: [DEFAULT_OG_IMAGE]
        }
    };
}

const getCartById = async (cartId: string): Promise<any> => {
    const secretKey = process.env.SECRET_ENCRYPT_KEY;

    if (!secretKey) {
        throw new Error('SECRET_ENCRYPT_KEY not found');
    }

    const response = await fetch(`https://api.breadkun.com/api/cafe/carts/${cartId}`, {
        headers: {
            Accept: 'application/vnd.breadkun.v1+json',
            Origin: 'https://breadkun-dev.vercel.app',
            'X-SSR-Token': secretKey
        },
        cache: 'no-store',
        next: { revalidate: 0 }
    });

    const data = await response.json();

    return data;
};

export default async function CartMenuPage({ params }: { params: { id: string; userId: string } }) {
    const cartId = params.id;

    try {
        const cartBasic = await getCartById(cartId);
        return <CartMenuById cartBasic={cartBasic.data.cafeCart} entry={'personalCart'} cartId={cartId} />;
    } catch (error) {
        return <div>Error loading cart. Please try again.</div>;
    }
}
