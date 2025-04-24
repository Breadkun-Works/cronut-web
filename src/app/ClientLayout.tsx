'use client';

import { ReactNode, useState, useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import queryClient from '../lib/queryClient';
import Header from '@/components/Header';
import { MenuProvider } from '@/context/MenuContext';
import { CompanyProvider } from '@/context/CompanyContext';
import createEmotionCache from '@/lib/createEmotionCache';
import { CacheProvider } from '@emotion/react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { MuiTheme } from '@/data';
import { SnackbarProvider } from '@/context/SnackBarContext';

export default function ClientLayout({ children }: Readonly<{ children: ReactNode }>) {
    const [isClient, setIsClient] = useState(false);
    const cache = createEmotionCache();

    useEffect(() => {
        setIsClient(true); // Indicating client-side rendering
    }, []);

    if (!isClient) {
        return null; // Render nothing on the server side
    }

    return (
        <CacheProvider value={cache}>
            <ThemeProvider theme={MuiTheme}>
                <SnackbarProvider>
                    <CssBaseline /> {/* 기본 CSS 리셋 */}
                    <QueryClientProvider client={queryClient}>
                        <MenuProvider>
                            <Header />
                            <main style={{ maxWidth: '950px', margin: '0 auto' }}>
                                <CompanyProvider>{children}</CompanyProvider>
                            </main>
                        </MenuProvider>
                    </QueryClientProvider>
                </SnackbarProvider>
            </ThemeProvider>
        </CacheProvider>
    );
}
