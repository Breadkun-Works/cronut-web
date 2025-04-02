'use client';
import { MapPin } from 'lucide-react';
import { Company, companyDropdownItem } from '@/types/common';
import React from 'react';
import { useCompanyContext } from '@/context/CompanyContext';
import { Container, FormControl, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { COLORS_DARK } from '@/data';

export const CompanySelect = ({ entry }: { entry?: string }) => {
    const { company, setCompany } = useCompanyContext();

    const handleChange = (event: SelectChangeEvent<string>) => {
        const selectedCompany = event.target.value as Company;
        setCompany(selectedCompany);
        localStorage.setItem('recentCompany', selectedCompany);
    };

    return (
        <Container>
            <FormControl variant="standard" sx={{ m: 1 }}>
                <Select
                    value={company.toString() || 'KANGCHON'} // 문자열로 변환하여 전달
                    onChange={e => handleChange(e)}
                    MenuProps={{
                        PaperProps: {
                            sx: {
                                bgcolor: '#2C2F31',
                                color: 'white'
                            }
                        }
                    }}
                    displayEmpty
                    sx={{
                        border: 'none',
                        '&:before': { borderBottom: 'none' }, // 기본 보더 제거
                        '&:after': { borderBottom: 'none' }, // 포커스 시 보더 제거
                        '&:hover:not(.Mui-disabled):before': { borderBottom: 'none' } // 호버 시 보더 제거
                    }}
                    renderValue={(selected: string) => (
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 6,
                                ...(entry === 'home' && { fontSize: 'clamp(1px, 5.38vw, 25px)' })
                            }}
                        >
                            <MapPin size={'3vh'} />
                            {selected === 'KANGCHON' ? '더존 강촌 캠퍼스' : '더존 을지타워'}
                        </div>
                    )}
                >
                    {companyDropdownItem.map(companyDropdown => {
                        return (
                            <MenuItem
                                sx={{
                                    backgroundColor:
                                        companyDropdown.value === company
                                            ? `${COLORS_DARK.accent.dark} !important`
                                            : 'transparent',
                                    ...(entry === 'home' && {
                                        fontSize: 'clamp(1px, 4vw, 15px)'
                                    })
                                }}
                                key={companyDropdown.value}
                                value={companyDropdown.value}
                            >
                                {companyDropdown.label}
                            </MenuItem>
                        );
                    })}
                </Select>
            </FormControl>
        </Container>
    );
};
