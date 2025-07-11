// export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
//     return {
//         title: '카페 주문 - BBANGDORI',
//         description: '더존 빵돌이 카페 주문 페이지입니다.',
//         openGraph: {
//             title: '카페 주문 - BBANGDORI',
//             description: '더존 빵돌이 카페 주문 페이지입니다. 주문에 참여해볼까요?',
//             url: `https://breadkun-dev.vercel.app/cafe/cart/${params.id}`, // TODO: 환경변수로 수정해야됨
//             type: 'website',
//             siteName: '더존 빵돌이',
//             images: [DEFAULT_OG_IMAGE]
//         }
//     };
// }

const Layout = ({ children }: { children: React.ReactNode; params: { id: string } }) => {
    return <>{children}</>;
};

export default Layout;
