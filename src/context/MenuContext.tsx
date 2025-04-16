'use client';
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { CookiesProvider } from 'react-cookie';
interface MenuContextProps {
    menuBox: boolean;
    setMenuBox: React.Dispatch<React.SetStateAction<boolean>>;
}
export const MenuContext = createContext<MenuContextProps | undefined>(undefined);

export const MenuProvider = ({ children }: { children: ReactNode }) => {
    const [menuBox, setMenuBox] = useState(false);

    // useMemo로 감싸서 불필요한 리렌더링 방지
    const contextValue = useMemo(() => ({ menuBox, setMenuBox }), [menuBox]);

    useEffect(() => {
        const handleResize = () => {
            if (menuBox && window.innerWidth >= 768) {
                setMenuBox(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [menuBox]);

    return (
        <CookiesProvider>
            <MenuContext.Provider value={contextValue}>{children}</MenuContext.Provider>
        </CookiesProvider>
    );
};

export const useMenuContext = () => {
    const context = useContext(MenuContext);
    if (!context) {
        throw new Error('useMenuContext must be used within a MenuProvider');
    }
    return context;
};
