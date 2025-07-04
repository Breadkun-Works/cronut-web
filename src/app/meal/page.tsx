import { createPageMetadata } from '@/utils/metadata';
import Meal from '@/components/page/meal';

export const generateMetadata = () =>
    createPageMetadata(
        '식단',
        '오늘의 구내식당 식단을 간편하게 확인해보세요.',
        '오늘의 구내식당 식단을 간편하게 확인해보세요.'
    );

const MealPage = () => {
    return <Meal />;
};

export default MealPage;
