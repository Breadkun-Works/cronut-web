// RootLayout.tsx - Server Component
import './globals.css';
import { Metadata } from 'next';
import { ReactNode } from 'react';
import ClientLayout from './ClientLayout';

export const metadata: Metadata = {
    title: '더존 빵돌이 | 다양한 더존ICT 생활 정보',
    description:
        '더존ICT의 구내식당 식단, 통근 버스의 실시간 도착 시간, 오늘의 빵, 사내 카페 메뉴, 날씨 등 다양한 생활 정보를 안내하는 더존 빵돌이 웹 서비스입니다.'
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
    return (
        <html lang="en">
            <head title={'더존 빵돌이 | 다양한 더존ICT 생활 정보'}>
                <link rel="icon" href="/favicon.ico" />
                <link rel="apple-touch-icon" sizes="192x192" href="/logo192.png" />
            </head>
            <body>
                <ClientLayout>{children}</ClientLayout>
            </body>
        </html>
    );
}
