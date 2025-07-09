declare global {
    interface Window {
        kakao: any;
        gtag: (...args: any[]) => void;
    }
}

export {};
