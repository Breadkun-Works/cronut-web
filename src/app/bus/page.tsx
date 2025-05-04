'use client';
import React, { useEffect, useState } from 'react';
import styles from '../../styles/Bus.module.scss';
import classNames from 'classnames/bind';
import axios from 'axios';
import KakaoMap from '@/components/page/bus/KakaoMap';
import PopUpMap from '@/components/page/bus/popup/PopUpMap';
import NotificationBox from '@/components/NotificationBox';
import { useMenuContext } from '@/context/MenuContext';
import Image from 'next/image';
import useKakaoLoader from '../../components/UseKakaoLoader';
import { Box, Typography } from '@mui/material';
import { CompanySelect } from '@/components/CompanySelect';
import { useCurrentBreakpoint, useResponsive } from '@/utils/hook';
import { BusFront } from 'lucide-react';
import { responsiveConfig } from '@/data';

interface BusStations {
    arrivalTimeH?: number;
    arrivalTimeM?: number;
    distanceKm?: number;
    durationH?: number;
    durationM?: number;
    notification?: string;
    destinationName: string;
    location: string;
    latitude: number;
    longitude: number;
}

const bs = classNames.bind(styles);

function Bus({ params }: { params: { destination: string } }) {
    useKakaoLoader();
    const { isMobile, isTabletOnly } = useResponsive();
    const { fontSizeSteps } = responsiveConfig;
    const breakpoint = useCurrentBreakpoint();
    const fontSize = fontSizeSteps.companySelect[breakpoint];
    const iconSize = isMobile ? 18 : isTabletOnly ? 22 : 24; // 모바일 18px, 태블릿 22px, 데스크탑 24px

    const [loaded, setLoaded] = useState(false);
    const { setMenuBox } = useMenuContext();

    const destination = decodeURIComponent(params.destination || ''); // 경로에서 "destination" 추출
    const [selectedValue, setSelectedValue] = useState(destination || ''); // URL parameter 노선 or 로컬스토리지 or "강변1"(기본)
    const [latLong, setLatLong] = useState({ latitude: 37.756540912483615, longitude: 127.63819968679633 }); // 현재위치 정보 lat&log, 기본값 더존 강촌캠
    const [address, setAddress] = useState({
        region_1depth_name: '강원',
        region_2depth_name: '춘천시',
        region_3depth_name: '남산면'
    }); // 현재위치 정보 도로명 주소
    const [arrivalTime, setArrivalTime] = useState({
        mainbox: '----',
        time: '',
        ampm: '',
        remainingTime: '',
        remainingText: ''
    }); // 도착시간
    const [notification, setNotification] = useState(false); // 스낵바
    const [popUpMap, setPopUpMap] = useState(false); // 자세히 보기 정류장 지도
    const [stopLatLong, setStopLatLong] = useState({ latitude: 0, longitude: 0 }); // 자세히 보기 정류장 위도경도
    const [stopLocation, setStopLocation] = useState(''); // 자세히 보기 정류장 위치 설명
    const [busStations, setBusStations] = useState<BusStations[]>([]);

    // 현재좌표를 업데이트 하는 함수
    const updateLocation = () => {
        navigator.geolocation.getCurrentPosition(position =>
            setLatLong({ latitude: position.coords.latitude, longitude: position.coords.longitude })
        );
    };

    const getAddr = (lat: number, lng: number) => {
        if (typeof window === 'undefined') return;

        // Check if Kakao Maps API is fully loaded before accessing
        if (window.kakao && window.kakao.maps && window.kakao.maps.services) {
            const geocoder = new window.kakao.maps.services.Geocoder();
            const coord = new window.kakao.maps.LatLng(lat, lng);

            const callback = (result: any, status: any) => {
                if (status === window.kakao.maps.services.Status.OK) {
                    setAddress({
                        region_1depth_name:
                            result[0].address.region_1depth_name.indexOf(' ') >= 0
                                ? result[0].address.region_1depth_name.slice(
                                      0,
                                      result[0].address.region_1depth_name.indexOf(' ')
                                  )
                                : result[0].address.region_1depth_name,
                        region_2depth_name:
                            result[0].address.region_2depth_name.indexOf(' ') >= 0
                                ? result[0].address.region_2depth_name.slice(
                                      0,
                                      result[0].address.region_2depth_name.indexOf(' ')
                                  )
                                : result[0].address.region_2depth_name,
                        region_3depth_name:
                            result[0].address.region_3depth_name.indexOf(' ') >= 0
                                ? result[0].address.region_3depth_name.slice(
                                      0,
                                      result[0].address.region_3depth_name.indexOf(' ')
                                  )
                                : result[0].address.region_3depth_name
                    });
                } else {
                    console.error('Failed to retrieve address');
                }
            };

            geocoder.coord2Address(coord.getLng(), coord.getLat(), callback);
        }
    };

    // 도착지 값을 드롭다운에 따라 업데이트하는 함수
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedValue(e.target.value);
    };

    useEffect(() => {
        setMenuBox(false); // 메뉴 닫기(이전버튼 클릭시)
    }, [setMenuBox]);
    // 페이지 최상단으로 스크롤링
    useEffect(() => {
        if (typeof window === 'undefined') return;
        window.scrollTo(0, 0);
        updateLocation(); // 현재위치 업데이트 최초 1회 업데이트
        setLoaded(true);
        return () => {
            window.scrollTo(0, 0);
        };
    }, []);
    useEffect(() => {
        getAddr(latLong.latitude, latLong.longitude); // 현재 도로명 주소 업데이트
    }, [latLong]);

    useEffect(() => {
        setSelectedValue(destination || localStorage.getItem('recentDestination') || '강변1');
    }, [destination]);

    useEffect(() => {
        localStorage.setItem('recentDestination', selectedValue); // 로컬 스토리지 업데이트
    }, [selectedValue]);

    // 서버에서 남은 시간 받아오기 비동기 처리(async & await)
    useEffect(() => {
        setArrivalTime({ mainbox: '----', time: '', ampm: '', remainingTime: '', remainingText: '' });
        setBusStations([]);
        setNotification(true);
        async function fetchData() {
            try {
                const result = await axios.post('https://babkaotalk.herokuapp.com/webShuttle', {
                    destNm: selectedValue,
                    originGps: `${latLong.longitude},${latLong.latitude} `
                });
                const { resultCode, resultData } = result.data;
                // 출발지와 도착지의 거리가 매우 가까울 때.
                if (resultCode === 104) {
                    setArrivalTime({
                        mainbox: '잠시 후 도착',
                        time: '',
                        ampm: '',
                        remainingTime: '',
                        remainingText: ''
                    });
                } else {
                    const resultVal = resultData;
                    // 소요시간 정보
                    const resultH = resultVal.arrivalTimeH > 12 ? resultVal.arrivalTimeH - 12 : resultVal.arrivalTimeH;
                    setArrivalTime({
                        mainbox: '',
                        time: `${resultH.toString().padStart(2, '0')}:${resultVal.arrivalTimeM.toString().padStart(2, '0')}`,
                        ampm: `${resultVal.arrivalTimeH >= 12 ? 'PM' : 'AM'}`,
                        remainingTime: `${resultVal.durationH * 60 + resultVal.durationM}`,
                        remainingText: '분 소요'
                    });
                    setBusStations([
                        {
                            destinationName: '더존_강촌',
                            notification: '18:15',
                            location: '번호로 노선별 승차 위치를 확인하세요!',
                            latitude: 37.757685934004726,
                            longitude: 127.63763361785992
                        },
                        ...resultVal.sections
                    ]);
                }
                setNotification(false);
            } catch (error) {
                setArrivalTime({ mainbox: '통신장애', time: '', ampm: '', remainingTime: '', remainingText: '' });
                setNotification(false);
                console.log('현재 위치에서 도착지까지 남은 시간 가져오기 실패.');
                console.log(error);
            }
        }
        fetchData();
    }, [selectedValue, latLong]);

    return (
        <>
            <div className={bs('bus')}>
                <Box margin={isMobile ? '10px 16px' : '20px 30px'} display={'flex'} alignItems="center" gap={1}>
                    <BusFront size={iconSize} />
                    <Typography fontSize={fontSize}>강촌 퇴근 버스</Typography>
                    {/*<CompanySelect entry={'bus'} />*/}
                </Box>
                {/*<div className={bs('title')}>*/}
                {/*    <div className={bs('title__icon')}>*/}
                {/*        <Image*/}
                {/*            src="/icon/bus-title-icon.webp"*/}
                {/*            alt="before-button"*/}
                {/*            width={22}*/}
                {/*            height={22}*/}
                {/*            style={{ height: '5.64vw', maxHeight: '22px' }}*/}
                {/*        />*/}
                {/*    </div>*/}
                {/*    <div className={bs('title__letter')}>강촌 퇴근 버스</div>*/}
                {/*</div>*/}
                <div className={bs('bus__body')}>
                    <KakaoMap
                        mapHeight={'64.1vw'}
                        mapWidth={'100%'}
                        mapBorderRadius={'10.26vw'}
                        latLong={latLong}
                        levelNum={5}
                        draggableType={true}
                        trafficInfo={true}
                    />
                    <KakaoMap
                        mapHeight={'450px'}
                        // mapWidth={'100%'}
                        mapBorderRadius={'35px'}
                        latLong={latLong}
                        levelNum={5}
                        draggableType={true}
                        trafficInfo={true}
                    />

                    <div className={bs('bus__block1')}>
                        <div className={bs('bus__block1--left')}>
                            <div className={bs('bus__block1--left-title')}>
                                <Image src="/icon/bus-arrival-icon.webp" alt="arrival icon" width={50} height={50} />
                            </div>
                            <div className={bs('bus__block1--left-mainBox')}>{arrivalTime.mainbox}</div>
                            <div className={bs('bus__block1--left-firstLine')}>
                                <div className={bs('bus__block1--left-firstLine-contents')}>
                                    <div>{arrivalTime.time}</div>
                                    <div>{arrivalTime.ampm}</div>
                                </div>
                            </div>
                            <div className={bs('bus__block1--left-secLine')}>
                                <div className={bs('bus__block1--left-secLine-contents')}>
                                    <div>{arrivalTime.remainingTime}</div>
                                    <div>{arrivalTime.remainingText}</div>
                                </div>
                            </div>
                        </div>
                        <div className={bs('bus__block1--right')}>
                            <div>
                                <div className={bs('bus__block1--right--recentAdr')}>
                                    <div>{address.region_2depth_name}</div>
                                    <div>{address.region_3depth_name}</div>
                                </div>
                                <div className={bs('bus__block1--right--refresh-button')}>
                                    <button onClick={() => updateLocation()}>
                                        <Image
                                            width={22}
                                            height={22}
                                            className={bs('refresh-button')}
                                            src="/icon/bus-refresh-button.webp"
                                            alt="refresh-button"
                                        />
                                    </button>
                                </div>
                            </div>
                            <div className={bs('bus__block1--right--arrow')}>
                                <Image
                                    className={bs('arrow-img')}
                                    src="/icon/arrow-down.webp"
                                    alt="아래화살표"
                                    width={14}
                                    height={18}
                                />
                            </div>
                            <div className={bs('bus__block1--right--selectbox')}>
                                <select
                                    value={selectedValue}
                                    onChange={handleChange}
                                    aria-label="목적지를 선택해 주세요."
                                >
                                    <optgroup label="서울방면">
                                        <option value="강변1">① 강변</option>
                                        <option value="강변2">② 강변</option>
                                        <option value="천호">③ 천호</option>
                                        <option value="잠실">④ 잠실</option>
                                        <option value="태릉">⑤ 태릉</option>
                                        <option value="평내호평">⑥ 평내호평</option>
                                        <option value="상봉">⑦ 상봉</option>
                                        <option value="구리">⑧ 구리</option>
                                    </optgroup>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className={bs('bus__block2')}>
                        <div className={bs('bus__block2--stops')}>
                            {busStations.map((v, i) => (
                                <div className={bs('bus__block2--stop')} key={i}>
                                    <div className={bs('bus__block2--stop-texts')} key={i}>
                                        <div className={bs('bus__block2--stop-title-wrapper')}>
                                            <div className={bs('bus__block2--stop-title')} key={`title${i}`}>
                                                {i === 0 || i === busStations.length - 1
                                                    ? i === 0
                                                        ? '기점'
                                                        : '종점'
                                                    : `경유${i}`}
                                            </div>
                                            <div className={bs('bus__block2--stop-name')} key={i}>
                                                {v?.notification
                                                    ? `${v.destinationName}(${v.notification})`
                                                    : `${v.destinationName}`}
                                            </div>
                                        </div>
                                        <div
                                            className={bs('bus__block2--stop-more')}
                                            onClick={() => {
                                                setStopLatLong({ latitude: v.latitude, longitude: v.longitude });
                                                setStopLocation(v.location);
                                                setPopUpMap(true);
                                            }}
                                        >
                                            자세히 보기
                                        </div>
                                    </div>
                                    <Image
                                        className={bs('bus__block2--stop-arrow')}
                                        src="/icon/bus-stops-arrow.webp"
                                        alt="down arrow"
                                        width={50}
                                        height={50}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            {popUpMap && (
                <PopUpMap
                    onOffButton={setPopUpMap}
                    stopLatLong={stopLatLong}
                    stopLocation={stopLocation}
                    selectedValue={selectedValue}
                />
            )}
            {notification && <NotificationBox firstText={'시간 계산 중.'} secText={'위치 정보를 허용해 주세요.'} />}
        </>
    );
}

export default Bus;
