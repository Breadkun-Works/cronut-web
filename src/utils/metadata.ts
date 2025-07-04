import { cookies } from 'next/headers';
import { Metadata } from 'next';
import { DEFAULT_OG_IMAGE } from '@/data';

export const createPageMetadata = (
    baseTitle?: string,
    description?: string,
    ogDescription?: string,
    url?: string
): Promise<Metadata> | Metadata => {
    const cookieStore = cookies();
    const company = cookieStore.get('recentCompany')?.value ?? 'KANGCHON';
    const companyName = company === 'KANGCHON' ? '강촌' : '을지';

    const fullTitle = baseTitle ? `${baseTitle} | ${companyName} - BBANGDORI` : 'BBANGDORI';
    const fullDescription =
        description ??
        '더존ICT의 구내식당 식단, 통근 버스의 실시간 도착 시간, 오늘의 빵, 사내 카페 메뉴, 날씨 등 다양한 생활 정보를 안내하는 더존 빵돌이 웹 서비스입니다.';

    const fullOgDescription =
        ogDescription ??
        '더존ICT의 구내식당 식단, 통근 버스의 실시간 도착 시간, 오늘의 빵, 사내 카페 메뉴, 날씨 등 다양한 생활 정보를 안내하는 더존 빵돌이 웹 서비스입니다.';
    return {
        title: fullTitle,
        description: fullDescription,
        openGraph: {
            title: baseTitle ? `${baseTitle} - BBANGDORI` : 'BBANGDORI',
            description: fullOgDescription,
            images: [DEFAULT_OG_IMAGE],
            url,
            type: 'website',
            siteName: 'BBANGDORI'
        }
    };
};
