/** @type {import('next').NextConfig} */
const nextConfig = {
    compiler: {},
    reactStrictMode: true,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'babkaotalk.herokuapp.com'
            },
            {
                protocol: 'https',
                hostname: 'plus.unsplash.com' // 임시 이미지 호스트 추가
            }
        ]
    },
    eslint: {
        ignoreDuringBuilds: true // 빌드 시 lint 미적용
    }
};

module.exports = nextConfig;
