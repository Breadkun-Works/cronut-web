'use client';

import {
    Box,
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Container,
    Dialog,
    DialogTitle,
    Slide,
    Tab,
    Tabs,
    Typography,
    useMediaQuery,
    useTheme
} from '@mui/material';
import Grid2 from '@mui/material/Grid2'; // Grid2 올바르게 import
import { breakPoints, CafeMenuData } from '@/data';
import { forwardRef, useEffect, useRef, useState } from 'react';
import { useGetCafeMenuInfinite } from '@/apis/cafe/cafe-api';
import { DrinkCategory } from '@/types/common';
import { useCompanyContext } from '@/context/CompanyContext';
import { StyledCard, StyledCardMedia } from '@/styles/cart/cart.styles';
import { Coffee, CoffeeIcon as Tea, Wine } from 'lucide-react';
import { TransitionProps } from '@mui/material/transitions';
import { MenuPopover } from '@/components/page/cafe/menu/menu-popover';

const returnIcon = (cafeMenu: DrinkCategory) => {
    switch (cafeMenu) {
        case DrinkCategory.COFFEE:
            return <Coffee />;

        case DrinkCategory.TEA:
            return <Tea />;

        default:
            return <Wine />;
    }
};

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
    const theme = useTheme();
    const [tabValue, setTabValue] = useState(0);

    const handleTabChange = (event: React.SyntheticEvent, newTabValue: number) => {
        const selectedCategory = CafeMenuData[newTabValue].value;
        setTabValue(newTabValue);
        setQuery({ ...query, category: selectedCategory });
    };

    const { company } = useCompanyContext();
    const [query, setQuery] = useState({ size: 12, category: DrinkCategory.COFFEE, name: '', cafeLocation: company });
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedMenu, setSelectedMenu] = useState('');

    const { data, hasNextPage, isFetchingNextPage, fetchNextPage } = useGetCafeMenuInfinite(query);

    const loadMoreRef = useRef<HTMLDivElement | null>(null);

    const containerRef = useRef<HTMLDivElement>(null);
    const [dialogWidth, setDialogWidth] = useState<number>(0);

    const handleCardClick = (name: string) => {
        setOpenDialog(!openDialog);
        setSelectedMenu(name);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    useEffect(() => {
        if (!loadMoreRef.current) return;

        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                    console.log('123123123');
                    fetchNextPage();
                }
            },
            { threshold: 0.5 }
        );

        observer.observe(loadMoreRef.current);

        return () => observer.disconnect();
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    // useEffect(() => {
    //     const handleResize = () => {
    //         if (containerRef.current) {
    //             const containerWidth = containerRef.current.offsetWidth;
    //             setDialogWidth((containerWidth * 2) / 3); // 그 외엔 2/3으로 설정
    //         }
    //     };
    //
    //     handleResize();
    //
    //     window.addEventListener('resize', handleResize);
    //
    //     return () => {
    //         window.removeEventListener('resize', handleResize);
    //     };
    // }, [open]);

    // xs 또는 sm 크기일 때 true
    const isXsOrSm = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        const handleResize = () => {
            if (containerRef.current) {
                const containerWidth = containerRef.current.offsetWidth;
                const isSmartphone = window.innerWidth <= 480; // 스마트폰 기준 (480px 이하)

                if (isSmartphone) {
                    // sm 이하일 경우 5/6 너비
                    setDialogWidth((containerWidth * 5) / 6);
                } else {
                    // 그 외엔 1/2 너비
                    setDialogWidth(containerWidth / 2);
                }
            }
        };

        handleResize();

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [open]);

    console.log(data);
    console.log(dialogWidth);
    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography
                variant="h3"
                component="h1"
                align="center"
                gutterBottom
                sx={{
                    mb: { xs: 2, sm: 4 },
                    color: 'white',
                    fontWeight: 'bold'
                }}
            >
                카페 메뉴
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                <Tabs centered value={tabValue} onChange={handleTabChange} aria-label="cafe menu tabs">
                    {CafeMenuData.map((cafeMenu, cafeMenuIdx) => (
                        <Tab
                            key={cafeMenuIdx}
                            icon={
                                <Box sx={{ mb: 0.5, display: 'flex', justifyContent: 'center' }}>
                                    {returnIcon(DrinkCategory[cafeMenu.value as keyof typeof DrinkCategory])}
                                </Box>
                            }
                            label={cafeMenu.name}
                        />
                    ))}
                </Tabs>
            </Box>
            {CafeMenuData.map(cafeMenu => {
                return (
                    <TabPanel key={cafeMenu.index} value={tabValue} index={cafeMenu.index}>
                        <Box component={'div'} ref={containerRef}>
                            {data?.pages?.[0]?.records && data?.pages?.[0]?.records?.length > 0 ? (
                                <Grid2 container spacing={3} key={cafeMenu.index}>
                                    {data?.pages?.map(page => {
                                        return page.records.map((record, idx) => {
                                            return (
                                                <>
                                                    <Grid2
                                                        size={{ xs: 6, md: 4 }}
                                                        key={idx}
                                                        component={'div'}
                                                        ref={loadMoreRef}
                                                    >
                                                        <StyledCard>
                                                            <CardActionArea
                                                                onClick={() => handleCardClick(record.name)}
                                                            >
                                                                <Box sx={{ position: 'relative' }}>
                                                                    <StyledCardMedia
                                                                        image={
                                                                            'https://img.freepik.com/free-photo/iced-cola-tall-glass_1101-740.jpg'
                                                                        }
                                                                        sx={{ backgroundSize: 'contain' }}
                                                                        title={record.name}
                                                                    />
                                                                </Box>
                                                                <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
                                                                    <Typography
                                                                        variant="h6"
                                                                        component="h3"
                                                                        sx={{ color: 'white', textAlign: 'center' }}
                                                                    >
                                                                        {record.name}
                                                                    </Typography>
                                                                </CardContent>
                                                            </CardActionArea>
                                                        </StyledCard>
                                                    </Grid2>
                                                    {openDialog && selectedMenu === record.name && (
                                                        <MenuPopover
                                                            width={dialogWidth}
                                                            open={openDialog}
                                                            onClose={handleCloseDialog}
                                                            popoverProps={{
                                                                menuName: record.name,
                                                                options: record.options
                                                            }}
                                                        />
                                                    )}
                                                </>
                                            );
                                        });
                                    })}
                                </Grid2>
                            ) : (
                                <>??</>
                            )}
                        </Box>
                    </TabPanel>
                );
            })}
        </Container>
    );
};

export default CafeMenu;
