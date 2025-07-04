'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import { DehydratedState, HydrationBoundary, QueryClientProvider } from '@tanstack/react-query';
import queryClient from '../lib/queryClient';
import Header from '@/components/Header';
import createEmotionCache from '@/lib/createEmotionCache';
import { CacheProvider } from '@emotion/react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { MuiTheme } from '@/data';
import { Provider as JotaiProvider, useSetAtom } from 'jotai';
import { CookiesProvider, useCookies } from 'react-cookie';
import { Snackbar } from '@/components/common/snackbar';
import { companyAtom } from '@/atom/common-atom';
import { Company } from '@/types/common';
import InquiryDial from './InquiryDial';
export default function ClientLayout({
    children,
    dehydratedState
}: {
    children: ReactNode;
    dehydratedState?: DehydratedState;
}) {
    const [isClient, setIsClient] = useState(false);
    const cache = createEmotionCache();

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return null;
    }

    return (
        <CacheProvider value={cache}>
            <ThemeProvider theme={MuiTheme}>
                <CssBaseline />
                <QueryClientProvider client={queryClient}>
                    <HydrationBoundary state={dehydratedState}>
                        <JotaiProvider>
                            <CookiesProvider>
                                <Header />
                                <main style={{ maxWidth: '950px', margin: '0 auto' }}>
                                    <InitializeCompany />
                                    {children}
                                    <Snackbar />
                                </main>
                                <InquiryDial />
                            </CookiesProvider>
                        </JotaiProvider>
                    </HydrationBoundary>
                </QueryClientProvider>
            </ThemeProvider>
        </CacheProvider>
    );
}
function InitializeCompany() {
    const setCompany = useSetAtom(companyAtom);
    const [cookies, setCookie] = useCookies(['recentCompany']);

    useEffect(() => {
        // 쿠키에서 값 있는지 확인
        const cookieCompany = cookies.recentCompany;

        const company = cookieCompany ?? Company.KANGCHON;

        setCompany(company as Company);
        if (!cookieCompany) {
            setCookie('recentCompany', company, { path: '/' });
        }
    }, [cookies.recentCompany, setCompany, setCookie]);

    return null;
}
