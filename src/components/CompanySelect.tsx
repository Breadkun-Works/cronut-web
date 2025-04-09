'use client';
import { MapPin, Utensils } from 'lucide-react';
import { Company, companyDropdownItem, companyMealDropdownItem } from '@/types/common';
import React from 'react';
import { useCompanyContext } from '@/context/CompanyContext';
import { Container, FormControl, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { COLORS_DARK } from '@/data';
import { useIsMobile } from '@/utils/hook';

export const CompanySelect = ({ entry }: { entry?: string }) => {
    const { company, setCompany } = useCompanyContext();

    const handleChange = (event: SelectChangeEvent<string>) => {
        const selectedCompany = event.target.value as Company;
        setCompany(selectedCompany);
        localStorage.setItem('recentCompany', selectedCompany);
    };

    const isMobile = useIsMobile();

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
                                ...(['home', 'meal'].includes(entry as string) && isMobile
                                    ? {
                                          fontSize: 'clamp(1px, 5.38vw, 25px)'
                                      }
                                    : { fontSize: '20px' })
                            }}
                        >
                            {entry === 'meal' ? (
                                <Utensils size={'3vh'} style={{ marginRight: '10px' }} />
                            ) : (
                                <MapPin size={'3vh'} style={{ marginRight: '10px' }} />
                            )}
                            {entry === 'meal'
                                ? companyMealDropdownItem.find(c => c.value === selected)?.label
                                : companyDropdownItem.find(c => c.value === selected)?.label}
                        </div>
                    )}
                >
                    {(entry === 'meal' ? companyMealDropdownItem : companyDropdownItem).map(companyDropdown => {
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
