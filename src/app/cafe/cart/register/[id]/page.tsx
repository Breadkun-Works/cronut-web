import { createPageMetadata } from '@/utils/metadata';
import { RegisterPage } from '@/components/page/cafe/register';

export const generateMetadata = ({ params }: { params: { id: string } }) =>
    createPageMetadata(
        '카페 주문',
        '더존 빵돌이 카페 주문 페이지입니다.',
        '더존 빵돌이 카페 주문 페이지입니다. 주문에 참여해볼까요?',
        `https://breadkun-dev.vercel.app/cafe/cart/${params.id}`
    );

const RegisterForCart = ({ params }: { params: { id: string } }) => {
    return <RegisterPage params={params} />;
};

export default RegisterForCart;
