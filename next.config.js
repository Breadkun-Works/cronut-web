/** @type {import('next').NextConfig} */
const nextConfig = {
    compiler: {
        styledComponents: true // SSR 지원 활성화
    },
    reactStrictMode: true,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'babkaotalk.herokuapp.com'
            }
        ]
    },
    eslint: {
        ignoreDuringBuilds: true // 빌드 시 lint 미적용
    }
};

module.exports = nextConfig;
