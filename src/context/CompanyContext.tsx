import { createContext, ReactNode, useContext, useMemo, useState } from 'react';
import { Company } from '@/types/common';

interface CompanyContextType {
    company: Company;
    setCompany: (company: Company) => void;
}

export const useCompanyContext = () => {
    const context = useContext(CompanyContext);
    if (!context) {
        throw new Error('useCompany must be used within a CompanyProvider');
    }
    return context;
};

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export const CompanyProvider = ({ children }: { children: ReactNode }) => {
    const [company, setCompany] = useState<Company>(
        (localStorage.getItem('recentCompany') as Company) || Company.KANGCHON
    );

    const contextValue = useMemo(() => ({ company, setCompany }), [company]);

    return <CompanyContext.Provider value={contextValue}>{children}</CompanyContext.Provider>;
};
