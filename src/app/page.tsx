'use client';

import styles from '../styles/Home.module.scss';
import '../styles/App.scss';
import { useEffect, useState } from 'react';
import { WeatherReturn } from '@/types/home';
import axios from 'axios';
import { useMenuContext } from '@/context/MenuContext';
import classNames from 'classnames/bind';
import { getWeatherIconPath, imageReturn } from '@/utils/image-return';
import { fetchDustDataTest } from '@/apis/dust/dust-api';
import { fetchWeatherData } from '@/apis/weather/weather-api';
import Link from 'next/link';
import NotificationBox from '@/components/ui/NotificationBox';

const hs = classNames.bind(styles);

export default function Home() {
    const { setMenuBox } = useMenuContext();
    const [company, setCompany] = useState(localStorage.getItem('recentCompany') || '강촌'); // 강촌, 을지
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

    const cancelTokenSource = axios.CancelToken.source(); // 요청 취소 토큰

    const { SKY, PTY, RAIN, TMP } = weather; //하늘 / 강수형태 / 강수확률 / 기온

    // 회사를 드롭다운에 따라 업데이트하는 함수
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setCompany(e.target.value);
    };

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

    // 메뉴 닫기(이전버튼 클릭시)
    useEffect(() => {
        setMenuBox(false);
    }, [setMenuBox]);

    // 페이지 최상단으로 스크롤링
    useEffect(() => {
        window.scrollTo(0, 0);
        return () => {
            window.scrollTo(0, 0);
        };
    }, []);

    // 로컬 스토리지 업데이트
    useEffect(() => {
        localStorage.setItem('recentCompany', company);
    }, [company]);

    useEffect(() => {
        setDust({
            dataTime: '--',
            stationName: '--',
            pm10Level: '---',
            pm25Level: '---',
            pm10Value: '-',
            pm25Value: '-'
        });
        fetchDustDataTest(company).then(dustResponse => {
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
        if (company === '강촌') {
            fetchData();
        }
    }, [company]);

    return (
        <>
            <div className={hs('home')}>
                <div className={hs('title')}>
                    <div className={hs('title__icon')}>
                        <img src="/icon/home-title-icon.webp" alt="title" />
                    </div>
                    <div className={hs('title__select')}>
                        <div className={hs('title__letter')}>
                            {company === '강촌' ? '더존 강촌캠퍼스' : '더존 을지타워'}
                        </div>
                        <select value={company} onChange={handleChange} aria-label="회사를 선택해 주세요.">
                            <option value="강촌">더존 강촌캠퍼스</option>
                            <option value="을지">더존 을지타워</option>
                        </select>
                        <img
                            className={hs('title__select-button')}
                            src="/icon/home-select-arrow.webp"
                            alt="dropdown-button"
                        />
                    </div>
                </div>
                <div className={hs('home__body')}>
                    <div className={hs('home__weather')}>
                        <div className={hs('home__weather--now')}>
                            <div className={hs('home__weather--now-temperature')}>
                                {PTY?.[0].fcstValue && (
                                    <img
                                        className={hs('home__weather--now-temperature-img')}
                                        src={getWeatherIconPath(PTY?.[0].fcstValue, SKY?.[0].fcstValue)}
                                        alt="weather-icon"
                                    />
                                )}
                                <div
                                    className={hs('home__weather--now-temperature-text')}
                                >{`${TMP?.[0].fcstValue.padStart(2, '0') || '-'}°C`}</div>
                            </div>
                            <div className={hs('home__weather--now-rain')}>
                                <img
                                    className={hs('home__weather--now-rain-img')}
                                    src="/icon/weather/popPercent.webp"
                                    alt="rain-percent"
                                />
                                <div className={hs('home__weather--now-rain-text')}>
                                    {' '}
                                    {`${RAIN?.[0].fcstValue.padStart(2, '0') || '-'}%`}
                                </div>
                            </div>
                        </div>
                        <div className={hs('home__weather--forecasts-wrapper')}>
                            <div className={hs('home__weather--forecasts')}>
                                {new Array(12).fill('0').map((currentVal, index) => (
                                    <div className={hs('home__weather--forecast')} key={currentVal + index}>
                                        <div className={hs('home__weather--forecast-time')} key={index}>
                                            {getWeatherTime(TMP?.[index + 1].fcstTime || '')}
                                        </div>
                                        {PTY?.[index + 1].fcstValue && (
                                            <img
                                                className={hs('home__weather--forecast-sky-icon')}
                                                src={getWeatherIconPath(
                                                    PTY?.[index + 1].fcstValue,
                                                    SKY?.[index + 1].fcstValue
                                                )}
                                                alt="weather-icon"
                                                key={`a${index}`}
                                            />
                                        )}
                                        <div className={hs('home__weather--forecast-temperature')} key={`d${index}`}>
                                            {TMP?.[index + 1].fcstValue
                                                ? `${TMP?.[index + 1].fcstValue.padStart(2, '0')}°C`
                                                : ''}
                                        </div>

                                        {PTY?.[index + 1].fcstValue && (
                                            <img
                                                className={hs('home__weather--forecast-rain-img')}
                                                src="/icon/weather/popPercent.webp"
                                                alt="rain-percent"
                                                key={`c${index}`}
                                            />
                                        )}
                                        <div className={hs('home__weather--forecast-rain-text')} key={`t${index}`}>
                                            {RAIN?.[index + 1].fcstValue
                                                ? `${RAIN?.[index + 1].fcstValue.padStart(2, '0')}%`
                                                : ''}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <button
                            onClick={() => {
                                reFreshButtonClick();
                            }}
                        >
                            <img
                                className={hs('refresh-button')}
                                src="/icon/bus-refresh-button.webp"
                                alt="refresh-button"
                            />
                        </button>
                    </div>
                    <div className={hs('home__dusts')}>
                        <div className={hs('home__dust', dust.pm10Level === '---' ? '조회중' : dust.pm10Level)}>
                            <div className={hs('home__dust--title')}>
                                <span>미세먼지</span>
                            </div>
                            <div className={hs('home__dust--img-letter-wrapper')}>
                                {dust.pm10Level !== '통신장애' && (
                                    <img
                                        className={hs('home__dust--img')}
                                        src={imageReturn(dust.pm10Level)}
                                        alt="dust-level-icon"
                                    />
                                )}
                                <div className={hs('home__dust--level')}>
                                    {dust.pm10Level}/{dust.pm10Value}
                                </div>
                            </div>
                        </div>
                        <div className={hs('home__ultra-dust', dust.pm25Level === '---' ? '조회중' : dust.pm25Level)}>
                            <div className={hs('home__ultra-dust--title')}>
                                <span>초미세먼지</span>
                            </div>
                            <div className={hs('home__ultra-dust--img-letter-wrapper')}>
                                {dust.pm25Level !== '통신장애' && (
                                    <img
                                        className={hs('home__ultra-dust--img')}
                                        src={imageReturn(dust.pm25Level)}
                                        alt="dust-level-icon"
                                    />
                                )}
                                <div className={hs('home__ultra-dust--level')}>
                                    {dust.pm25Level}/{dust.pm25Value}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={hs('home__links')}>
                        <Link href={'/meal'}>
                            <div>
                                <div className={hs('home__link--title')}>식단</div>
                                <div className={hs('home__link--text')}>구내식당 메뉴</div>
                            </div>
                            <img
                                className={hs('home__link--image', '식단')}
                                src="/icon/home-meal-button.webp"
                                alt="today meal"
                            />
                        </Link>
                        {company === '강촌' && (
                            <>
                                <button className={hs('home__link--bread')} onClick={() => setBreadPopUp(true)}>
                                    <div>
                                        <div className={hs('home__link--title')}>ORIGINAL</div>
                                        <div className={hs('home__link--text')}>오늘의 빵</div>
                                    </div>
                                    <img
                                        className={hs('home__link--image', '빵')}
                                        src="/icon/home-bread-button.webp"
                                        alt="today bread"
                                    />
                                </button>
                                <Link href={'/bus'}>
                                    <div>
                                        <div className={hs('home__link--title')}>버스</div>
                                        <div className={hs('home__link--text')}>퇴근 버스 정보</div>
                                    </div>
                                    <img
                                        className={hs('home__link--image', '버스')}
                                        src="/icon/home-bus-button.webp"
                                        alt="today bus"
                                    />
                                </Link>
                            </>
                        )}
                        <Link href={'/cafe'}>
                            <div>
                                <div className={hs('home__link--title')}>카페</div>
                                <div className={hs('home__link--text')}>-서비스 준비중-</div>
                            </div>
                            <img
                                className={hs('home__link--image', '카페')}
                                src="/icon/home-caffe-button.webp"
                                alt="today cafe"
                            />
                        </Link>
                        <Link href={'/omakase'}>
                            <div>
                                <div className={hs('home__link--title')}>빵돌이오마카세</div>
                                <div className={hs('home__link--text')}>-서비스 준비중-</div>
                            </div>
                            <img
                                className={hs('home__link--image', '빵돌이오마카세')}
                                src="/icon/home-omakase-button.webp"
                                alt="today omakase"
                            />
                        </Link>
                    </div>
                </div>
                {company === '강촌' && (
                    <div className={hs('home__body-sec')}>
                        <div className={hs('home__body-sec--bread')}>
                            <div className={hs('body-sec__bread--title')}>오늘의 빵</div>
                            <img
                                className={hs('body-sec__bread--img')}
                                src={
                                    bread?.img
                                        ? `https://babkaotalk.herokuapp.com${bread?.img}`
                                        : '/icon/home-bread.webp'
                                }
                                alt="todays bread"
                            />
                            <div className={hs('body-sec__bread--text')}>{bread?.name || '정보가 없습니다.'}</div>
                        </div>
                    </div>
                )}
            </div>
            {breadPopUp && (
                <div className={hs('home__pop-up-bread')}>
                    <div className={hs('home__pop-up-bread--mask')} onClick={() => setBreadPopUp(false)} />
                    <div className={hs('home__pop-up-bread--wrapper')}>
                        <img
                            className={hs('home__pop-up-bread--img')}
                            src={bread?.img ? `https://babkaotalk.herokuapp.com${bread?.img}` : '/icon/home-bread.webp'}
                            alt="todays bread"
                        />
                        <div className={hs('home__pop-up-bread--text')}>
                            {bread?.name || '오늘의 빵 정보가 없습니다.'}
                        </div>
                        <span className={hs('home__pop-up-bread--close')} onClick={() => setBreadPopUp(false)}>
                            닫기
                        </span>
                    </div>
                </div>
            )}
            {notification && <NotificationBox firstText={'기상상태 분석 중.'} secText={'잠시만 기다려 주세요.'} />}
        </>
    );
}
