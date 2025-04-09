import { useEffect, useState } from 'react';

const MOBILE_MAX_WIDTH = 480;

export const useIsMobile = () => {
    const [isMobile, setIsMobile] = useState<boolean>(
        typeof window !== 'undefined' ? window.innerWidth <= MOBILE_MAX_WIDTH : false
    );

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= MOBILE_MAX_WIDTH);
        };

        window.addEventListener('resize', handleResize);

        // 초기 체크 (혹시 hydration 시점에서 window 사이즈 다를 수 있으니까)
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, [window?.innerWidth]);

    return isMobile;
};
