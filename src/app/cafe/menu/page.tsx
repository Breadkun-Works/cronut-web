'use client';

import { Tab, Tabs } from '@mui/material';
import { CafeMenuData } from '@/data';
import styled from '@emotion/styled';
import { useState } from 'react';

const CafeMenu = () => {
    const [tabValue, setTabValue] = useState(0);
    const handleTabChange = (event: React.SyntheticEvent, newTabValue: number) => {
        setTabValue(newTabValue);
    };
    return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Tabs centered value={tabValue} onChange={handleTabChange}>
                {CafeMenuData.map((cafeMenu, cafeMenuIdx) => {
                    return (
                        <Tab
                            key={cafeMenuIdx}
                            label={cafeMenu.name}
                            value={cafeMenuIdx}
                            sx={cafeMenu.sx} // cafeMenu.sx로 접근하여 스타일을 적용
                        />
                    );
                })}
            </Tabs>
        </div>
    );
};

export default CafeMenu;
