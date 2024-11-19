import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    compiler: {
        styledComponents: true, // SSR 지원 활성화
    },
};

export default nextConfig;
