import crypto from 'crypto';
// import ConfirmClientPage from './ConfirmClientPage';
import ConfirmClientPageV2 from './ConfirmClientPageV2';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
    const cartData = await fetchCart(params.id);
    const cart = cartData.data.cafeCart;

    return {
        title: cart.title,
        description: cart.description,
        openGraph: {
            title: cart.title,
            description: cart.description,
            images: ''
        }
    };
}
const fetchCart = async (cafeCartId: string): Promise<any> => {
    const secretKey: string = process.env.SECRET_ENCRYPT_KEY!;
    const res = await fetch(`https://api.breadkun.com/api/cafe/carts/${cafeCartId}`, {
        headers: {
            Accept: 'application/vnd.breadkun.v1+json',
            Origin: 'https://breadkun-dev.vercel.app',
            'X-SSR-Token': secretKey
        }
    });
    if (res.status === 404) {
        notFound();
    }
    return res.json();
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
    if (encryptedData) {
        const key = cartData.data.cafeCart.secureShareKey;
        const keyBuffer = Buffer.from(key, 'base64');
        const decryptedData = decryptAES256(encryptedData, keyBuffer);
        return <ConfirmClientPageV2 decryptedData={decryptedData} cartId={params.id} status={status} />;
    } else {
        return <ConfirmClientPageV2 cartId={params.id} status={status} />;
    }
}
