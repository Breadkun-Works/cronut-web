'use client';

import {
    BusBadge,
    BusBox,
    BusBoxItem,
    BusBoxList,
    BusDetailBox,
    BusDetailWrap,
    BusLineTitle,
    BusList,
    BusListItem,
    BusListUl,
    BusTimer,
    BusTitle,
    IconBox,
    MapArea,
    BusDescWrap,
    BusIconList,
    TitleText,
    SubText,
    SelectText
} from '@/styles/bus/detail/page.styles';
import React, { useEffect, useState } from 'react';
import { AlarmClock, Bus, CalendarCheck, Clock4, Hourglass, MapPinned, Pin } from 'lucide-react';
import { Stack } from '@/components/ui/Stack/Stack';
import { Button } from '@/components/ui/Button/Button';
import { MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { SxProps, Theme } from '@mui/material';
import { css } from '@emotion/react';

const BusDetailPage = () => {
    const [isMobile, setIsMobile] = useState(false);
    const [value, setValue] = useState('');
    const color = {
        orange: '#CD7C2F',
        lightGreen: '#747F00',
        pink: '#C0428C',
        mint: '#77C4A3',
        deepGreen: '#0C8E72',
        green: '#00A84D',
        purple: '#996CAC'
    };

    const selectMap: SxProps<Theme> = {
        width: 'auto',
        maxWidth: 'auto',
        border: 'none',
        '&:before': { borderBottom: 'none' },
        '&:after': { borderBottom: 'none' },
        '&:hover:not(.Mui-disabled):before': { borderBottom: 'none' }
    };

    const selectMapProps: Partial<React.ComponentProps<typeof Select>['MenuProps']> = {
        PaperProps: {
            sx: {
                backgroundColor: '#2C2F31',
                color: 'white',
                '& .MuiMenuItem-root.Mui-selected': {
                    backgroundColor: 'rgba(0,0,0,.3)',
                    color: 'white'
                },
                '& .MuiMenuItem-root.Mui-selected:hover': {
                    backgroundColor: 'rgba(0,0,0,.3)'
                }
            } as SxProps<Theme>
        }
    };

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 1024);
        handleResize(); // 초기값
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const busData = [
        { color: color.orange, type: '직행', stops: ['태릉', '강촌'] },
        { color: color.lightGreen, type: '경유', stops: ['상봉', '강촌'] },
        { color: color.mint, type: '경유', stops: ['태릉', '구리', '강촌'] },
        { color: color.deepGreen, type: '직행', stops: ['평내호평', '강촌'] },
        { color: color.green, type: '직행', stops: ['강변', '강촌'] },
        { color: color.pink, type: '경유', stops: ['잠실', '천호', '강촌'] },
        { color: color.purple, type: '직행', stops: ['천호', '강촌'] }
    ];

    return (
        <>
            <BusDetailWrap>
                <BusTitle>
                    {/*<CompanySelectWrap>*/}
                    {/*    <CompanySelect entry={'bus'} />*/}
                    {/*</CompanySelectWrap>*/}
                    <p>빵돌이 셔틀버스</p>
                    <BusTimer>
                        <AlarmClock />
                        <dl>
                            <dt>현재 시간</dt>
                            <dd>오전 07:35:40</dd>
                        </dl>
                    </BusTimer>
                </BusTitle>

                {isMobile ? (
                    <>
                        {/* 모바일 */}
                        <Stack
                            justify={isMobile ? 'space-between' : 'center'}
                            style={{ width: '100%', padding: '0 15px' }}
                        >
                            <Select
                                value={value}
                                onChange={e => setValue(e.target.value as string)}
                                displayEmpty
                                variant="standard"
                                sx={selectMap}
                                MenuProps={selectMapProps}
                                renderValue={(selected: string) => {
                                    if (!selected) return '선택해주세요';

                                    const selectedBus = busData.find(bus => bus.stops.join(' > ') === selected);
                                    if (!selectedBus) return selected; // fallback

                                    return (
                                        <Stack align={'center'}>
                                            <BusBadge color={selectedBus.color}>{selectedBus.type}</BusBadge>
                                            {selected}
                                        </Stack>
                                    );
                                }}
                            >
                                <MenuItem value="" disabled>
                                    선택해주세요
                                </MenuItem>
                                {busData.map((bus, idx) => (
                                    <MenuItem key={idx} value={bus.stops.join(' > ')}>
                                        <BusBadge color={bus.color}>{bus.type}</BusBadge> {bus.stops.join(' > ')}
                                    </MenuItem>
                                ))}
                            </Select>

                            <Stack align={'center'} gap={5}>
                                <IconBox>
                                    <Bus size={'1.3rem'} />
                                </IconBox>
                                <SubText>1대 운영</SubText>
                            </Stack>
                        </Stack>
                    </>
                ) : (
                    // 데스크탑
                    <BusList>
                        {busData.map((bus, idx) => (
                            <BusListItem key={idx} color={bus.color} onClick={() => {}}>
                                <BusBadge>{bus.type}</BusBadge>
                                <BusListUl>
                                    {bus.stops.map((stop, i) => (
                                        <li key={i}>{stop}</li>
                                    ))}
                                </BusListUl>
                            </BusListItem>
                        ))}
                    </BusList>
                )}
            </BusDetailWrap>

            <BusLineTitle>
                <BusListUl>
                    <li>잠실</li>
                    <li>천호</li>
                    <li>강촌</li>
                </BusListUl>
                <strong>셔틀버스</strong>
            </BusLineTitle>
            <BusDetailBox>
                <BusBox color={color.pink}>
                    <BusBoxList>
                        <BusBoxItem>
                            <Clock4 color={color.pink} />
                            <dl>
                                <dt>출발 시간</dt>
                                <dd>07:20</dd>
                            </dl>
                        </BusBoxItem>
                        <BusBoxItem>
                            <Hourglass color={color.pink} />
                            <dl>
                                <dt>평균 소요 시간</dt>
                                <dd>00시간 00분</dd>
                            </dl>
                        </BusBoxItem>
                        <BusBoxItem>
                            <CalendarCheck color={color.pink} />
                            <dl>
                                <dt>예정 도착 시간</dt>
                                <dd>08:20</dd>
                                <dd className={'desc'}>교통 상황에 따라 변동 가능</dd>
                            </dl>
                        </BusBoxItem>
                    </BusBoxList>
                </BusBox>
                <BusDescWrap>
                    <Stack direction={'column'} gap={20} align={'flex-start'}>
                        {!isMobile && (
                            <>
                                <Select
                                    value={value}
                                    onChange={(e: SelectChangeEvent<string>) => setValue(e.target.value)}
                                    displayEmpty
                                    variant={'standard'}
                                    sx={selectMap}
                                    MenuProps={selectMapProps}
                                    renderValue={(selected: string) => (
                                        <Stack align="center" gap={1}>
                                            <IconBox>
                                                <Pin size="1.3rem" />
                                            </IconBox>
                                            <SelectText>{selected === '' ? '선택해주세요' : selected}</SelectText>
                                        </Stack>
                                    )}
                                >
                                    <MenuItem sx={{ backgroundColor: 'transparent' }} value="" disabled>
                                        선택해주세요
                                    </MenuItem>

                                    <MenuItem sx={{ backgroundColor: 'transparent' }} value="잠실">
                                        잠실
                                    </MenuItem>
                                    <MenuItem sx={{ backgroundColor: 'transparent' }} value="천호">
                                        천호
                                    </MenuItem>
                                </Select>

                                <BusIconList>
                                    <IconBox>
                                        <Bus size={'1.3rem'} />
                                    </IconBox>
                                    <TitleText>버스 운행 정보 안내</TitleText>
                                    <SubText>1대 운영</SubText>
                                </BusIconList>
                            </>
                        )}
                        <BusIconList>
                            <IconBox>
                                <MapPinned size={'1.3rem'} />
                            </IconBox>
                            <TitleText>{isMobile ? '정류장 위치 : ' : '정류장 위치 보기'}</TitleText>
                            <SubText>서울시 도봉구 11-2</SubText>
                        </BusIconList>
                    </Stack>
                    <MapArea>
                        <Button variant={'contained'} bgColor={color.pink}>
                            탑승위치
                        </Button>
                        <div>지도 영역</div>
                        <Button variant={'line'} color={color.pink}>
                            카카오맵으로 보기
                        </Button>
                    </MapArea>
                </BusDescWrap>
            </BusDetailBox>
        </>
    );
};

export default BusDetailPage;
