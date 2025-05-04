'use client';

import { Box, FormControl, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { MapPin, Utensils } from 'lucide-react';
import { useCompanyContext } from '@/context/CompanyContext';
import { Company, companyDropdownItem, companyMealDropdownItem } from '@/types/common';
import { COLORS_DARK, responsiveConfig } from '@/data';
import { useCurrentBreakpoint, useResponsive } from '@/utils/hook';
import React from 'react';

export const CompanySelect = ({ entry }: { entry?: string }) => {
    const { company, setCompany } = useCompanyContext();
    const { isMobile, isTabletOnly } = useResponsive(); // 🔥

    const handleChange = (event: SelectChangeEvent<string>) => {
        const selectedCompany = event.target.value as Company;
        setCompany(selectedCompany);
        localStorage.setItem('recentCompany', selectedCompany);
    };

    const { fontSizeSteps } = responsiveConfig;
    const breakpoint = useCurrentBreakpoint();
    const fontSize = fontSizeSteps.companySelect[breakpoint];
    const iconSize = isMobile ? 18 : isTabletOnly ? 22 : 24; // 모바일 18px, 태블릿 22px, 데스크탑 24px

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
                            gap={1}
                            sx={{ fontSize }} // 🔥 여기
                        >
                            {entry === 'meal' ? <Utensils size={iconSize} /> : <MapPin size={iconSize} />}
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
                                fontSize: fontSize // 메뉴에도 반영
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
