'use client';
import { createContext, useContext, useEffect, useState } from 'react';

interface MenuContextProps {
    menuBox: boolean;
    setMenuBox: React.Dispatch<React.SetStateAction<boolean>>;
}
export const MenuContext = createContext<MenuContextProps | undefined>(undefined);

export const MenuProvider = ({ children }: { children: React.ReactNode }) => {
    const [menuBox, setMenuBox] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            if (menuBox && window.innerWidth >= 768) {
                setMenuBox(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [menuBox]);

    return <MenuContext.Provider value={{ menuBox, setMenuBox }}>{children}</MenuContext.Provider>;
};

export const useMenuContext = () => {
    const context = useContext(MenuContext);
    if (!context) {
        throw new Error('useMenuContext must be used within a MenuProvider');
    }
    return context;
};
