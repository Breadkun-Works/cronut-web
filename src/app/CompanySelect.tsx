import { useCompanyContext } from '@/context/CompanyContext';
import { Company, companyDropdownItem, companyMealDropdownItem } from '@/types/common';

const CompanySelector = ({ type }: { type?: string }) => {
    const { company, setCompany } = useCompanyContext(); // company와 setCompany를 가져옵니다.

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedCompany = event.target.value as Company;
        setCompany(selectedCompany);
        localStorage.setItem('recentCompany', selectedCompany);
    };

    return (
        <select value={company} onChange={handleChange} aria-label="회사를 선택해 주세요.">
            {(type === 'meal' ? companyMealDropdownItem : companyDropdownItem).map(company => {
                return (
                    <option key={company.value} value={company.value}>
                        {company.label}
                    </option>
                );
            })}
        </select>
    );
};

export default CompanySelector;
