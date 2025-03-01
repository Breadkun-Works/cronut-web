'use client';

import { ReactNode, useState, useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import queryClient from '../lib/queryClient';
import Header from '@/components/Header';
import { MenuProvider } from '@/context/MenuContext';
import { CompanyProvider } from '@/context/CompanyContext';
import { PageWrapper } from '@/styles/cart/cart.styles';
import createEmotionCache from '@/lib/createEmotionCache';
import { CacheProvider } from '@emotion/react';

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
            <QueryClientProvider client={queryClient}>
                <MenuProvider>
                    <Header />
                    <main>
                        <PageWrapper>
                            <CompanyProvider>{children}</CompanyProvider>
                        </PageWrapper>
                    </main>
                </MenuProvider>
            </QueryClientProvider>
        </CacheProvider>
    );
}
