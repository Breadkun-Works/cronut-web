import { useEffect, useState } from 'react';

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
