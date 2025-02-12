'use client';

import { ReactNode, useState, useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import queryClient from '../lib/queryClient';
import Header from '@/components/Header';
import { MenuProvider } from '@/context/MenuContext';

export default function ClientLayout({ children }: Readonly<{ children: ReactNode }>) {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true); // Indicating client-side rendering
    }, []);

    if (!isClient) {
        return null; // Render nothing on the server side
    }

    return (
        <QueryClientProvider client={queryClient}>
            <MenuProvider>
                <Header />
                <main style={{ maxWidth: '950px', margin: '0 auto' }}>{children}</main>
            </MenuProvider>
        </QueryClientProvider>
    );
}
