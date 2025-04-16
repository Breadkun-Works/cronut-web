import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
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

    useEffect(() => {
        const storedCompany = localStorage.getItem('recentCompany');

        if (storedCompany && Object.values(Company).includes(storedCompany as Company)) {
            setCompany(storedCompany as Company);
        } else {
            localStorage.setItem('recentCompany', Company.KANGCHON); // 로컬 스토리지에 기본값 설정
        }
    }, []);

    // 회사 변경시 로컬 스토리지 업데이트
    const handleSetCompany = (newCompany: Company) => {
        setCompany(newCompany);
        localStorage.setItem('recentCompany', newCompany);
    };

    const contextValue = useMemo(() => ({ company, setCompany: handleSetCompany }), [company]);

    return <CompanyContext.Provider value={contextValue}>{children}</CompanyContext.Provider>;
};
