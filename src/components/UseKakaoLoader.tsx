import { useKakaoLoader as useKakaoLoaderOrigin } from 'react-kakao-maps-sdk';
// 참고 https://apis.map.kakao.com/web/guide/
export default function useKakaoLoader() {
    const appkey = process.env.NEXT_PUBLIC_KAKAO_API_KEY || '';
    return useKakaoLoaderOrigin({
        appkey,
        libraries: ['clusterer', 'drawing', 'services']
    });
}
