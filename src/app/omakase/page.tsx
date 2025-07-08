import { createPageMetadata } from '@/utils/metadata';
import SpinLogo from '@/components/common/SpinLogo';

export const generateMetadata = () =>
    createPageMetadata(
        '오마카세',
        '오늘의 구내식당 식단을 간편하게 확인해보세요.',
        '오늘의 구내식당 식단을 간편하게 확인해보세요.'
    );

const Omakase = () => {
    return <SpinLogo text1={'COMING SOON'} text2={'서비스 준비중입니다.'} />;
};

export default Omakase;
