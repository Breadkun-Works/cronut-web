'use client';

import { Box, Card, CardContent, CardMedia, Tab, Tabs, Typography } from '@mui/material';
import Grid2 from '@mui/material/Grid2'; // Grid2 올바르게 import
import { CafeMenuData } from '@/data';
import { useState } from 'react';
import { useGetCafeMenuInfinite } from '@/apis/cafe/cafe-api';
import { DrinkCategory } from '@/types/common';
import { useCompanyContext } from '@/context/CompanyContext';

const TabPanel = ({ children, value, index, ...other }: any) => {
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
};

const CafeMenu = () => {
    const [tabValue, setTabValue] = useState(0);

    const handleTabChange = (event: React.SyntheticEvent, newTabValue: number) => {
        const selectedCategory = CafeMenuData[newTabValue].value;
        setTabValue(newTabValue);
        setQuery({ ...query, category: selectedCategory });
    };

    const { company } = useCompanyContext();
    const [query, setQuery] = useState({ size: 12, category: DrinkCategory.COFFEE, name: '', cafeLocation: company });

    const { data, hasNextPage } = useGetCafeMenuInfinite(query);

    console.log(data);

    return (
        <Box sx={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Tabs centered value={tabValue} onChange={handleTabChange}>
                    {CafeMenuData.map((cafeMenu, cafeMenuIdx) => (
                        <Tab key={cafeMenuIdx} label={cafeMenu.name} value={cafeMenuIdx} sx={cafeMenu.sx} />
                    ))}
                </Tabs>
            </div>

            <TabPanel value={tabValue} index={0}>
                {data?.pages?.[0]?.records && data?.pages?.[0]?.records?.length > 0 ? (
                    <Grid2 container spacing={2}>
                        {data?.pages?.[0]?.records.map((record, idx) => (
                            <Grid2
                                key={idx}
                                component={'div'}
                                sx={{
                                    flexBasis: { xs: '100%', sm: '30%' }, // ✅ 대신 flexBasis로 비율 조정
                                    maxWidth: { xs: '100%', sm: '30%' }
                                }}
                            >
                                {/* 여기에 상품 카드 컴포넌트 넣기 */}
                                <Card>
                                    <CardMedia component={'img'}></CardMedia>
                                    <CardContent>
                                        <Typography variant="h6" textAlign={'center'}>
                                            {record.name}
                                        </Typography>
                                    </CardContent>
                                </Card>
                                {/*<Box sx={{ border: '1px solid gray', padding: 2, textAlign: 'center' }}>*/}
                                {/*    {record.name}*/}
                                {/*</Box>*/}
                            </Grid2>
                        ))}
                    </Grid2>
                ) : (
                    <div>?</div>
                )}
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
                {data?.pages?.[0]?.records && data?.pages?.[0]?.records?.length > 0 ? (
                    <Grid2 container spacing={2}>
                        {data?.pages?.[0]?.records.map((record, idx) => (
                            <Grid2
                                key={idx}
                                component={'div'}
                                sx={{
                                    flexBasis: { xs: '100%', sm: '30%' }, // ✅ 대신 flexBasis로 비율 조정
                                    maxWidth: { xs: '100%', sm: '30%' }
                                }}
                            >
                                {/* 여기에 상품 카드 컴포넌트 넣기 */}
                                <Card>
                                    <CardMedia component={'img'}></CardMedia>
                                    <CardContent>
                                        <Typography variant="h6">{record.name}</Typography>
                                    </CardContent>
                                </Card>
                                {/*<Box sx={{ border: '1px solid gray', padding: 2, textAlign: 'center' }}>*/}
                                {/*    {record.name}*/}
                                {/*</Box>*/}
                            </Grid2>
                        ))}
                    </Grid2>
                ) : (
                    <div>?</div>
                )}
            </TabPanel>
            <TabPanel value={tabValue} index={2}>
                {data?.pages?.[0]?.records && data?.pages?.[0]?.records?.length > 0 ? (
                    <Grid2 container spacing={2}>
                        {data?.pages?.[0]?.records.map((record, idx) => (
                            <Grid2
                                key={idx}
                                component={'div'}
                                sx={{
                                    flexBasis: { xs: '100%', sm: '30%' }, // ✅ 대신 flexBasis로 비율 조정
                                    maxWidth: { xs: '100%', sm: '30%' }
                                }}
                            >
                                {/* 여기에 상품 카드 컴포넌트 넣기 */}
                                <Card>
                                    <CardMedia component={'img'}></CardMedia>
                                    <CardContent>
                                        <Typography variant="h6">{record.name}</Typography>
                                    </CardContent>
                                </Card>
                            </Grid2>
                        ))}
                    </Grid2>
                ) : (
                    <div>?</div>
                )}
            </TabPanel>
        </Box>
    );
};

export default CafeMenu;
