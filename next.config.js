/** @type {import('next').NextConfig} */
const nextConfig = {
    compiler: {
        styledComponents: true // SSR 지원 활성화
    },
    reactStrictMode: true,
    experimental: {
        appDir: true
    }
};

module.exports = nextConfig;
