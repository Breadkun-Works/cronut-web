export const generateMetadata = () =>
    createPageMetadata(
        '카페 메뉴',
        '카페 메뉴를 확인해보세요!',
        '오늘 뭐 마실지 고민 중이라면? 카페 메뉴를 확인해보세요!'
    );

// export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
//     const cookieStore = cookies();
//     const company = cookieStore.get('recentCompany')?.value ?? 'KANGCHON';
//     const matchedCompany: string = company === Company.KANGCHON ? '강촌' : '을지';
//
//     return {
//         description: '카페 장바구니 메뉴를 이용해보세요!',
//         openGraph: {
//             title: `카페 메뉴 - BBANGDORI`,
//             description: `카페 장바구니 메뉴를 이용해보세요!`,
//             images: [DEFAULT_OG_IMAGE]
//         }
//     };
// }

import CafeMenu from '@/components/page/cafe/menu';
import { createPageMetadata } from '@/utils/metadata';

const CafeMenuPage = () => {
    return <CafeMenu entry={'menu'} title={'카페 메뉴'} />;
};

export default CafeMenuPage;
