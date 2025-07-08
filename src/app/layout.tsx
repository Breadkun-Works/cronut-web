// RootLayout.tsx - Server Component
import './globals.css';
import { Metadata } from 'next';
import { ReactNode } from 'react';
import ClientLayout from './ClientLayout';
import { nanumFonts } from '@/fonts/nanumFonts';
import { DEFAULT_OG_IMAGE } from '@/data';
import Script from 'next/script';

export const metadata: Metadata = {
    openGraph: {
        images: [DEFAULT_OG_IMAGE],
        type: 'website',
        siteName: 'BBANGDORI'
    },
    title: 'BBANGDORI',
    description:
        '더존ICT의 구내식당 식단, 통근 버스의 실시간 도착 시간, 오늘의 빵, 사내 카페 메뉴, 날씨 등 다양한 생활 정보를 안내하는 더존 빵돌이 웹 서비스입니다.'
};

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
    return (
        <html lang="ko" className={nanumFonts.variable}>
            <head title={'더존 빵돌이 | 다양한 더존ICT 생활 정보'}>
                <Script src={`https://www.googletagmanager.com/gtag/js?id=G-92E8PST3BH`} strategy="afterInteractive" />
                <Script id="gtag-init" strategy="afterInteractive">
                    {`window.dataLayer = window.dataLayer || [];
                            function gtag(){dataLayer.push(arguments);}
                            gtag('js', new Date());
                            gtag('config', 'G-92E8PST3BH');`}
                </Script>
                <link rel="icon" href="/favicon.ico" />
                <link rel="apple-touch-icon" sizes="192x192" href="/logo192.png" />
            </head>
            <body>
                <ClientLayout>{children}</ClientLayout>
            </body>
        </html>
    );
}
