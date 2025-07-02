'use client';
import { useEffect, useState } from 'react';

export const useConditionalTimeout = (condition: boolean, delay: number) => {
    const [isTimeout, setIsTimeout] = useState(false);

    useEffect(() => {
        if (!condition) {
            setIsTimeout(false); // 조건이 false면 리셋
            return;
        }

        const timer = setTimeout(() => setIsTimeout(true), delay);

        return () => clearTimeout(timer); // cleanup
    }, [condition, delay]);

    return isTimeout;
};

export function utf8ToBase64(str: string): string {
    const utf8Bytes = new TextEncoder().encode(str); // UTF-8 바이트로 변환
    let binaryStr = '';
    utf8Bytes.forEach(byte => {
        binaryStr += String.fromCharCode(byte);
    });
    return btoa(binaryStr); // Base64로 인코딩
}

export const handleRefresh = () => {
    if (typeof window !== 'undefined') {
        window.location.reload();
    }
};

export const isMobileDevice = (): boolean => {
    if (typeof navigator === 'undefined' || typeof window === 'undefined') return false; // SSR-safe
    const isMobile = /Mobi|Android|iPhone|iPad|iPod|Windows Phone|BlackBerry/i.test(navigator.userAgent);
    const hasTouch = navigator.maxTouchPoints > 1;
    return isMobile && hasTouch;
};

export const removeServiceWorker = async () => {
    if ('serviceWorker' in navigator) {
        try {
            // 등록된 모든 서비스워커 제거
            navigator.serviceWorker.getRegistrations().then(function (registrations) {
                for (const registration of registrations) {
                    registration.unregister();
                }
            });

            // 브라우저 캐시 정리
            if ('caches' in window) {
                const cacheNames = await caches.keys();
                await Promise.all(cacheNames.map(cacheName => caches.delete(cacheName)));
            }
        } catch (error) {
            console.error('breadkun.com 서비스워커 초기화 중 오류:', error);
        }
    }
};
