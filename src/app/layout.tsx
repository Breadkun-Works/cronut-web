// RootLayout.tsx - Server Component
import './globals.css';
import { Metadata } from 'next';
import { ReactNode } from 'react';
import ClientLayout from './ClientLayout';
import { nanumFonts } from '@/fonts/nanumFonts';
import { DEFAULT_OG_IMAGE } from '@/data';
import Script from 'next/script';

export const metadata: Metadata = {
    robots: 'index, follow',
    title: 'BBANGDORI',
    description:
        '더존ICT의 구내식당 식단, 통근 버스의 실시간 도착 시간, 오늘의 빵, 사내 카페 메뉴, 날씨 등 다양한 생활 정보를 안내하는 더존 빵돌이 웹 서비스입니다.',
    keywords: [
        '빵돌이',
        '더존ICT',
        '더존',
        '생활정보',
        '버스',
        '시간',
        '식당',
        '식단',
        '날씨',
        '회식장소',
        '맛집',
        '카페'
    ],
    // 오픈그래프
    openGraph: {
        title: 'BBANGDORI',
        url: 'https://breadkun.com/',
        description:
            '더존ICT의 구내식당 식단, 통근 버스의 실시간 도착 시간, 오늘의 빵, 사내 카페 메뉴, 날씨 등 다양한 생활 정보를 안내하는 더존 빵돌이 웹 서비스입니다.',
        images: [DEFAULT_OG_IMAGE],
        type: 'website',
        siteName: 'BBANGDORI'
    }
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
    return (
        <html lang="ko" className={nanumFonts.variable}>
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="theme-color" content="#212529" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="naver-site-verification" content="114e2081d9285565efb98f83edf15a821be642ef" />
                <link rel="icon" href="/favicon.ico" />
                <link rel="apple-touch-icon" sizes="192x192" href="/logo192.png" />
                <link rel="apple-touch-icon" sizes="512x512" href="/logo512.png" />
                {/* Google Analytics */}
                <Script src={`https://www.googletagmanager.com/gtag/js?id=G-92E8PST3BH`} strategy="afterInteractive" />
                <Script id="gtag-init" strategy="afterInteractive">
                    {`
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', 'G-92E8PST3BH');
                    `}
                </Script>
                {/* KAKAO API */}
                <Script
                    src={`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_API_KEY}&libraries=services`}
                    strategy="afterInteractive"
                />
            </head>
            <body>
                <ClientLayout>{children}</ClientLayout>
                {/* NAVER Analytics */}
                <Script src="//wcs.naver.net/wcslog.js" strategy="afterInteractive" />
                <Script id="naver-analytics" strategy="afterInteractive">
                    {`
                        if (!wcs_add) var wcs_add = {}; 
                        wcs_add['wa'] = '2bc1d10b4c655c';
                        if (window.wcs) {
                            wcs_do();
                        }
                    `}
                </Script>
            </body>
        </html>
    );
}
