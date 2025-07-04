'use client';

import { Box, FormControl, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { MapPin, Utensils } from 'lucide-react';
import { Company, companyDropdownItem, companyMealDropdownItem } from '@/types/common';
import { COLORS_DARK } from '@/data';
import { useResponsive } from '@/utils/hook';
import React from 'react';
import { useAtom } from 'jotai';
import { companyAtom } from '@/atom/common-atom';
import { useCookies } from 'react-cookie';

export const CompanySelect = ({ entry }: { entry?: string }) => {
    const [company, setCompany] = useAtom(companyAtom);
    const [, setCookie] = useCookies(['recentCompany']);
    const { isSmall, isMobile } = useResponsive();
    const handleChange = (event: SelectChangeEvent<string>) => {
        const selectedCompany = event.target.value as Company;
        setCompany(selectedCompany);
        setCookie('recentCompany', selectedCompany, { path: '/' });
    };

    return (
        <Box>
            <FormControl variant="standard">
                <Select
                    value={company.toString() || 'KANGCHON'}
                    onChange={handleChange}
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
                        '&:before': { borderBottom: 'none' },
                        '&:after': { borderBottom: 'none' },
                        '&:hover:not(.Mui-disabled):before': { borderBottom: 'none' }
                    }}
                    renderValue={(selected: string) => (
                        <Box
                            display="flex"
                            alignItems="center"
                            gap={1.5}
                            sx={{ fontSize: isMobile ? '1.2rem' : '1.3rem' }}
                        >
                            <Box
                                sx={{
                                    backgroundColor: '#3D3C52', // 원형 배경 색상
                                    borderRadius: '30%',
                                    width: 32,
                                    height: 32,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0
                                }}
                            >
                                {entry === 'meal' ? (
                                    <Utensils size={isSmall ? '1.2rem' : '1.3rem'} />
                                ) : (
                                    <MapPin size={isSmall ? '1.2rem' : '1.3rem'} />
                                )}
                            </Box>

                            {entry === 'meal'
                                ? companyMealDropdownItem.find(c => c.value === selected)?.label
                                : entry === 'cafe'
                                  ? [
                                        { value: 'KANGCHON', label: '강촌 카페' },
                                        { value: 'EULJI', label: '을지 카페' }
                                    ].find(c => c.value === selected)?.label
                                  : companyDropdownItem.find(c => c.value === selected)?.label}
                        </Box>
                    )}
                >
                    {(entry === 'meal'
                        ? companyMealDropdownItem
                        : entry === 'cafe'
                          ? [
                                { value: 'KANGCHON', label: '강촌 카페' },
                                { value: 'EULJI', label: '을지 카페' }
                            ]
                          : companyDropdownItem
                    ).map(companyDropdown => (
                        <MenuItem
                            key={companyDropdown.value}
                            value={companyDropdown.value}
                            sx={{
                                backgroundColor:
                                    companyDropdown.value === company
                                        ? `${COLORS_DARK.accent.dark} !important`
                                        : 'transparent',
                                fontSize: isSmall ? '1.1rem' : '1.2rem' // 메뉴에도 반영
                            }}
                        >
                            {companyDropdown.label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    );
};
