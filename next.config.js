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
                hostname: `ax40oxk5pwva.objectstorage.ap-chuncheon-1.oci.customer-oci.com`
            }
        ]
    },
    eslint: {
        ignoreDuringBuilds: true // 빌드 시 lint 미적용
    },
    async headers() {
        return [
            {
                source: '/(.*)', // 전체 경로
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'no-store, no-cache, must-revalidate, proxy-revalidate' // 캐시 무효화
                    },
                    {
                        key: 'Pragma',
                        value: 'no-cache' // 구버전 대응
                    },
                    {
                        key: 'Expires',
                        value: '0'
                    }
                ]
            }
        ];
    }
};

module.exports = nextConfig;
