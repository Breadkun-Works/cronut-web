import { useEffect, useState } from 'react';
import { COLORS_DARK, COLORS_LIGHT } from '@/data';

export function getPlaceholderText(input: string): string {
    return `${input}를 입력해주세요.`;
}

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
