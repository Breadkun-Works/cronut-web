/** @jsxImportSource @emotion/react */
'use client';

import styles from '../styles/Home.module.scss';
import { useEffect, useState } from 'react';
import { WeatherReturn } from '@/types/home';
import axios from 'axios';
import classNames from 'classnames/bind';
import { getWeatherIconPath, imageReturn } from '@/utils/image-return';
import { fetchDustDataTest } from '@/apis/dust/dust-api';
import { fetchWeatherData } from '@/apis/weather/weather-api';
import NotificationBox from '@/components/NotificationBox';
import Image from 'next/image';
import { getCookie, setCookie } from '@/utils/cookie';
import { Company } from '@/types/common';
import { CompanySelect } from '@/components/CompanySelect';
import { Box } from '@mui/material';
import { useResponsive } from '@/utils/hook';
import { companyAtom } from '@/atom/common-atom';
import { useAtom } from 'jotai';
import { removeServiceWorker } from '@/utils/util';
import { blind } from '@/styles/common.styles';
import { CommonModal } from '@/components/page/cafe/modal/common-modal';
import {
    BreadImgWrap,
    BreadText,
    DustLevel,
    DustWrap,
    MainBox,
    MainBoxImg,
    MainBoxList,
    MainBoxTitle,
    MainBread,
    MainWrap,
    WeatherBox,
    WeatherLeft,
    WeatherRefresh,
    WeatherRight,
    WeatherText,
    WeatherTime,
    WeatherWrap
} from '@/styles/main.styles';
import { useRouter } from 'next/navigation';
import { css } from '@emotion/react';

const hs = classNames.bind(styles);

export default function Home() {
    const router = useRouter();

    const [company] = useAtom(companyAtom);
    const { isMobile, isDesktop } = useResponsive();
    const [notification, setNotification] = useState(true);
    const [dustRequestCompleted, setDustRequestCompleted] = useState(false);
    const [weatherRequestCompleted, setWeatherRequestCompleted] = useState(false);
    const [dust, setDust] = useState({
        dataTime: '--',
        stationName: '--',
        pm10Level: '---',
        pm25Level: '---',
        pm10Value: '-',
        pm25Value: '-'
    });
    const [refreshButton, setRefreshButton] = useState(true);
    const [breadPopUp, setBreadPopUp] = useState(false);
    const [bread, setBread] = useState<{ id: string; name: string; img: string } | undefined>();
    const [weather, setWeather] = useState<{ [key in string]: WeatherReturn[] }>({});
    const { SKY, PTY, RAIN, TMP } = weather; //하늘 / 강수형태 / 강수확률 / 기온

    const getWeatherTime = (fcstTime: string): string | undefined => {
        if (fcstTime && +fcstTime < 1200) {
            return `오전${fcstTime.slice(0, 2)}시`;
        } else if (fcstTime && +fcstTime < 2400) {
            return `오후${fcstTime.slice(0, 2)}시`;
        }
        return undefined;
    };

    const reFreshButtonClick = () => {
        setRefreshButton(!refreshButton);
    };
    const handleTouchMove = (e: TouchEvent) => e.preventDefault(); // 스크롤 정지 함수
    // 페이지 최상단으로 스크롤링
    useEffect(() => {
        removeServiceWorker();
        window.scrollTo(0, 0);
        const cookieUserInfo = getCookie('BRK-UUID');
        if (!cookieUserInfo) {
            setCookie('BRK-UUID', crypto.randomUUID());
        }
        return () => {
            window.scrollTo(0, 0);
        };
    }, []);

    useEffect(() => {
        setDust({
            dataTime: '--',
            stationName: '--',
            pm10Level: '---',
            pm25Level: '---',
            pm10Value: '-',
            pm25Value: '-'
        });
        fetchDustDataTest(company)
            .then(dustResponse => {
                if (dustResponse) {
                    setDust({
                        dataTime: dustResponse.dataTime,
                        stationName: dustResponse.stationName,
                        pm10Level: dustResponse.pm10Level,
                        pm25Level: dustResponse.pm25Level,
                        pm10Value: dustResponse.pm10Value,
                        pm25Value: dustResponse.pm25Value
                    });
                    setDustRequestCompleted(true);
                }
            })
            .catch(error => {
                console.log('미세먼지 가져오기 재시도 실패.');
                console.log(error);
            });

        const retryDustData = async (retryCount: number) => {
            try {
                await fetchDustDataTest(company);
            } catch (error) {
                if (retryCount >= 3) {
                    setDust({
                        dataTime: '--',
                        stationName: '--',
                        pm10Level: '통신장애',
                        pm25Level: '통신장애',
                        pm10Value: '-',
                        pm25Value: '-'
                    });
                    setDustRequestCompleted(true);
                    console.log('미세먼지 가져오기 재시도 실패.');
                    console.log(error);
                } else {
                    console.log('미세먼지 가져오기 재시도...');
                    retryDustData(retryCount + 1);
                }
            }
        };

        const retryTimer = setTimeout(() => {
            retryDustData(1);
        }, 500);
        const cancelTokenSource = axios.CancelToken.source(); // 요청 취소 토큰
        return () => {
            cancelTokenSource.cancel('Component unmounted');
            clearTimeout(retryTimer);
        };
    }, [company, refreshButton]);

    useEffect(() => {
        fetchWeatherData(company).then(weatherResponse => {
            if (weatherResponse) {
                setWeather({
                    SKY: weatherResponse.SKY,
                    PTY: weatherResponse.PTY,
                    RAIN: weatherResponse.POP,
                    REH: weatherResponse.REH,
                    TMP: weatherResponse.TMP
                });
                setWeatherRequestCompleted(true);
            }
        });
        const retryWeatherData = async (retryCount: number) => {
            try {
                await fetchWeatherData(company);
            } catch (error) {
                if (retryCount >= 3) {
                    setWeatherRequestCompleted(true);
                    console.log('날씨 데이터 다시 가져오기 재시도 실패.');
                    console.log(error);
                } else {
                    console.log('날씨 데이터 다시 가져오기 재시도...');
                    retryWeatherData(retryCount + 1);
                }
            }
        };
        const retryTimer = setTimeout(() => {
            retryWeatherData(1);
        }, 500);
        const cancelTokenSource = axios.CancelToken.source(); // 요청 취소 토큰
        return () => {
            cancelTokenSource.cancel('Component unmounted');
            clearTimeout(retryTimer);
        };
    }, [company, refreshButton]);

    // 모든 통신이 완료되면 스낵바 언마운트
    useEffect(() => {
        if (dustRequestCompleted && weatherRequestCompleted) {
            setNotification(false);
        }
    }, [dustRequestCompleted, weatherRequestCompleted]);

    useEffect(() => {
        const parentElement = document.body; // DOM의 body 태그 지정
        if (breadPopUp === true) {
            // PopUpMap 마운트시,
            parentElement.style.overflow = 'hidden';
            parentElement.addEventListener('touchmove', handleTouchMove, { passive: false }); // Touch 디바이스 스크롤 정지
        }
        // cleanup
        return () => {
            parentElement.style.overflow = 'unset';
            parentElement.removeEventListener('touchmove', handleTouchMove);
        };
    }, [breadPopUp]);

    // bread api
    useEffect(() => {
        async function fetchData() {
            try {
                const result = await axios.post('https://babkaotalk.herokuapp.com/api/webBread');
                const { resultData } = result.data;
                setBread(resultData);
            } catch (error) {
                console.log('오늘의 빵 정보 가져오기 실패.');
                console.log(error);
            }
        }
        if (company === Company.KANGCHON) {
            fetchData();
        }
    }, [company]);

    // 미세먼지, 초미세먼지 배경색
    const getDustColor = (level: string) => {
        switch (level) {
            case '좋음':
                return '#30475e';
            case '보통':
                return '#2e4f4f';
            case '나쁨':
                return '#cf7500';
            case '최악':
                return '#a80038';
            case '---':
            case '통신장애':
            default:
                return '#343a40';
        }
    };

    return (
        <>
            <h1 css={blind}>BBANGDORI</h1>
            <MainWrap>
                <Box margin={isMobile ? '10px 0' : '20px 0'}>
                    <CompanySelect entry={'home'} />
                </Box>

                <MainBox color={'#343a40'}>
                    <WeatherWrap mobile={isMobile}>
                        {isMobile && (
                            <WeatherRefresh
                                onClick={() => {
                                    reFreshButtonClick();
                                }}
                            >
                                <Image
                                    src={'/icon/bus-refresh-button.webp'}
                                    alt={'refresh-button'}
                                    width={35}
                                    height={35}
                                />
                            </WeatherRefresh>
                        )}
                        <WeatherLeft>
                            <h4>오늘의 날씨</h4>
                            <div>
                                <div>
                                    {PTY?.[0].fcstValue && (
                                        <Image
                                            src={getWeatherIconPath(PTY?.[0].fcstValue, SKY?.[0].fcstValue)}
                                            alt="weather-icon"
                                            width={21}
                                            height={21}
                                        />
                                    )}
                                    <p>{`${TMP?.[0].fcstValue.padStart(2, '0') || '-'}°C`}</p>
                                </div>
                                <div>
                                    <Image
                                        src="/icon/weather/popPercent.webp"
                                        alt="rain-percent"
                                        width={40}
                                        height={40}
                                    />
                                    <p>{`${RAIN?.[0].fcstValue.padStart(2, '0') || '-'}%`}</p>
                                </div>
                            </div>
                        </WeatherLeft>
                        <WeatherRight>
                            {new Array(12).fill('0').map((_, index) => {
                                const time = TMP?.[index + 1]?.fcstTime;
                                const temp = TMP?.[index + 1]?.fcstValue;
                                const pty = PTY?.[index + 1]?.fcstValue;
                                const sky = SKY?.[index + 1]?.fcstValue;
                                const rain = RAIN?.[index + 1]?.fcstValue;

                                if (!time || !temp || !rain) return null;

                                return (
                                    <WeatherBox key={`weather-${index}`}>
                                        <WeatherTime>{getWeatherTime(time)}</WeatherTime>

                                        {pty && (
                                            <Image
                                                src={getWeatherIconPath(pty, sky)}
                                                alt="weather-icon"
                                                width={21}
                                                height={21}
                                            />
                                        )}

                                        <WeatherText>{temp.padStart(2, '0')}°C</WeatherText>

                                        {pty && (
                                            <Image
                                                src="/icon/weather/popPercent.webp"
                                                alt="rain-percent"
                                                width={21}
                                                height={21}
                                            />
                                        )}

                                        <WeatherText>{rain.padStart(2, '0')}%</WeatherText>
                                    </WeatherBox>
                                );
                            })}
                        </WeatherRight>
                    </WeatherWrap>
                </MainBox>

                <MainBoxList company={company === Company.EULJI ? 'EULJI' : 'KANGCHON'}>
                    <MainBox color={'#413543'} mobileOrder={3} mobile onClick={() => router.push('/meal')} button>
                        <MainBoxTitle>식단</MainBoxTitle>
                        <MainBoxImg>
                            <Image
                                src={'/images/main/fried-rice.png'}
                                alt={'fried-rice icon from Flaticon'}
                                width={512}
                                height={512}
                            />
                        </MainBoxImg>
                    </MainBox>

                    {company === Company.KANGCHON && (
                        <MainBox color={'#5c3d2e'} mobileOrder={4} onClick={() => setBreadPopUp(true)} button>
                            <MainBoxTitle>오늘의 빵</MainBoxTitle>
                            {isDesktop ? (
                                <>
                                    <MainBread>
                                        <img
                                            src={
                                                bread?.img
                                                    ? `https://babkaotalk.herokuapp.com${bread?.img}`
                                                    : '/icon/home-bread.webp'
                                            }
                                            alt={'오늘의 빵 이미지'}
                                        />
                                    </MainBread>
                                    <BreadText>{bread?.name ?? '🥨🍞빵정보 배송중🍰🍩'}</BreadText>
                                </>
                            ) : (
                                <MainBoxImg>
                                    <Image
                                        src={'/images/main/bread.png'}
                                        alt={'bread icon from Flaticon'}
                                        width={512}
                                        height={512}
                                    />
                                </MainBoxImg>
                            )}
                        </MainBox>
                    )}

                    <MainBox color={getDustColor(dust.pm10Level)} mobileOrder={1}>
                        <MainBoxTitle>미세먼지</MainBoxTitle>
                        <DustWrap company={company === Company.EULJI ? 'EULJI' : 'KANGCHON'}>
                            {dust.pm10Level !== '통신장애' && (
                                <Image
                                    src={imageReturn(dust.pm10Level)}
                                    alt="dust-level-icon"
                                    width={100}
                                    height={100}
                                />
                            )}
                            <DustLevel>
                                {dust.pm10Level}/{dust.pm10Value}
                            </DustLevel>
                        </DustWrap>
                    </MainBox>

                    <MainBox color={getDustColor(dust.pm25Level)} mobileOrder={2}>
                        <MainBoxTitle>초미세먼지</MainBoxTitle>
                        <DustWrap company={company === Company.EULJI ? 'EULJI' : 'KANGCHON'}>
                            {dust.pm25Level !== '통신장애' && (
                                <Image
                                    src={imageReturn(dust.pm25Level)}
                                    alt="dust-level-icon"
                                    width={100}
                                    height={100}
                                />
                            )}
                            <DustLevel>
                                {dust.pm25Level}/{dust.pm25Value}
                            </DustLevel>
                        </DustWrap>
                    </MainBox>

                    <MainBox color={'#2b4e70'} mobileOrder={5} mobile onClick={() => router.push('/cafe/menu')} button>
                        <MainBoxTitle>카페</MainBoxTitle>
                        <MainBoxImg type={'cafe'}>
                            <Image
                                src={'/images/main/coffee.png'}
                                alt={'coffee icon from Flaticon'}
                                width={512}
                                height={512}
                            />
                        </MainBoxImg>
                    </MainBox>

                    {company === Company.KANGCHON && (
                        <MainBox color={'#3e5151'} mobileOrder={6} mobile onClick={() => router.push('/bus')} button>
                            <MainBoxTitle>버스</MainBoxTitle>
                            <MainBoxImg type={'bus'}>
                                <Image
                                    src={'/images/main/bus.png'}
                                    alt={'bus icon from Flaticon'}
                                    width={512}
                                    height={512}
                                />
                            </MainBoxImg>
                        </MainBox>
                    )}
                </MainBoxList>
            </MainWrap>

            {breadPopUp && (
                <CommonModal
                    open={true}
                    modalType={'alert'}
                    onClose={() => setBreadPopUp(false)}
                    title={'오늘의 빵'}
                    content={
                        <BreadImgWrap>
                            <div>
                                <img
                                    src={
                                        bread?.img
                                            ? `https://babkaotalk.herokuapp.com${bread?.img}`
                                            : '/icon/home-bread.webp'
                                    }
                                    alt={'오늘의 빵 이미지'}
                                />
                            </div>
                        </BreadImgWrap>
                    }
                />
            )}
            {notification && <NotificationBox firstText={'기상상태 분석 중...'} secText={'잠시만 기다려 주세요.'} />}
        </>
    );
}
