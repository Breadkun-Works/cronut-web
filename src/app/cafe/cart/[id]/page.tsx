import crypto from 'crypto';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ConfirmClient } from '@/app/cafe/cart/[id]/ConfirmClient';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
    const cartData = await fetchCart(params.id);

    const cart = cartData.data.cafeCart;

    return {
        title: cart.title,
        description: cart.description,
        openGraph: {
            title: `${cart.title} 장바구니에 놀러오세요!`,
            description: `띵동🛎️~ 빵돌이의 장바구니 도착!\n\n🛒 ${cart.title} 장바구니에 입장해주세요~☕️🍞🥐`,
            images: `${process.env.NEXT_PUBLIC_STORAGE_BASE_URL}og-image.png`
        }
    };
}
const fetchCart = async (cafeCartId: string) => {
    const secretKey: string = process.env.SECRET_ENCRYPT_KEY!;
    const res = await fetch(`https://api.breadkun.com/api/cafe/carts/${cafeCartId}`, {
        headers: {
            Accept: 'application/vnd.breadkun.v1+json',
            Origin: 'https://breadkun-dev.vercel.app',
            'X-SSR-Token': secretKey
        },
        cache: 'no-store',
        next: { revalidate: 0 }
    });

    if (res.status === 404) {
        notFound();
    }

    const data = await res.json();
    return data;
};

const decryptAES256 = (encryptedDataBase64Url: string, keyBuffer: Buffer) => {
    const combined = Buffer.from(encryptedDataBase64Url, 'base64url');
    const iv = combined.subarray(0, 16);
    const encryptedText = combined.subarray(16);

    const decipher = crypto.createDecipheriv('aes-256-cbc', keyBuffer, iv);
    let decrypted = decipher.update(encryptedText, undefined, 'utf8');
    decrypted += decipher.final('utf8');

    return JSON.parse(decrypted);
};

export default async function ConfirmPage({
    params,
    searchParams
}: {
    params: { id: string };
    searchParams: { data: string };
}) {
    const encryptedData = searchParams.data;
    const cartData = await fetchCart(params.id);
    const status = cartData.data.cafeCart.status;

    if (encryptedData && status === 'ACTIVE') {
        const key = cartData.data.cafeCart.secureShareKey;
        const keyBuffer = Buffer.from(key, 'base64');
        const decryptedData = decryptAES256(encryptedData, keyBuffer);
        return <ConfirmClient decryptedData={decryptedData} cartId={params.id} cartData={cartData.data.cafeCart} />;
    } else {
        return <ConfirmClient cartId={params.id} cartData={cartData.data.cafeCart} />;
    }
}
