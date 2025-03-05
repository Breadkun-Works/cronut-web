/** @type {import('next').NextConfig} */
const nextConfig = {
    compiler: {},
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
