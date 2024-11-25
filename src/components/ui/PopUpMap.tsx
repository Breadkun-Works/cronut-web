import React, { useEffect, useRef } from 'react';
import styles from '../style/PopUpMap.module.scss';
import classNames from 'classnames/bind';

declare global {
    interface Window {
        kakao: any;
    }
}
const ps = classNames.bind(styles);

function PopUpMap({
    onOffButton,
    stopLatLong,
    stopLocation,
    selectedValue
}: {
    onOffButton: React.Dispatch<React.SetStateAction<boolean>>;
    stopLatLong: { latitude: number; longitude: number };
    stopLocation: string;
    selectedValue: string;
}) {
    const handleTouchMove = (e: TouchEvent) => e.preventDefault();
    const mapRef = useRef(null);

    useEffect(() => {
        const parentElement = document.body; // DOM의 body 태그 지정
        // PopUpMap 마운트시,
        parentElement.style.overflow = 'hidden';
        parentElement.addEventListener('touchmove', handleTouchMove, { passive: false }); // Touch 디바이스 스크롤 정지
        // PopUpMap 언마운트시,
        return () => {
            parentElement.style.overflow = 'unset';
            parentElement.removeEventListener('touchmove', handleTouchMove); // Touch 디바이스 스크롤 정지 해제
        };
    }, []);
    // 지도 생성(초기화)
    useEffect(() => {
        const container = mapRef.current; // return 값 DOM
        const options = {
            center: new window.kakao.maps.LatLng(stopLatLong.latitude, stopLatLong.longitude), // 지도 중심좌표
            // mapTypeId: window.kakao.maps.MapTypeId.HYBRID, // 위성사진(하이브리드)으로 변경하기
            draggable: true, // 이동, 확대, 축소 금지
            disableDoubleClick: true, // 더블클릭 방지 옵션
            level: 2 // 지도 확대 레벨
        };
        const map = new window.kakao.maps.Map(container, options); // 지도생성
        // 더존_강촌의 위도 경도가 들어올 때,
        if (stopLatLong.latitude === 37.757685934004726 && stopLatLong.longitude === 127.63763361785992) {
            map.setLevel(1);
            // 퇴근 버스 서울(수도권) 출발 정류장 위치
            const positions = [
                {
                    title: '강변1',
                    latlng: new window.kakao.maps.LatLng(37.75731929962502, 127.63795672132375)
                },
                {
                    title: '강변2',
                    latlng: new window.kakao.maps.LatLng(37.757385137727994, 127.63786082999069)
                },
                {
                    title: '천호',
                    latlng: new window.kakao.maps.LatLng(37.757462283192936, 127.63775652466634)
                },
                {
                    title: '잠실',
                    latlng: new window.kakao.maps.LatLng(37.75753925972322, 127.63768342433004)
                },
                {
                    title: '태릉',
                    latlng: new window.kakao.maps.LatLng(37.757636460655995, 127.63761900834801)
                },
                {
                    title: '평내호평',
                    latlng: new window.kakao.maps.LatLng(37.75779658718164, 127.6375806650569)
                },
                {
                    title: '상봉',
                    latlng: new window.kakao.maps.LatLng(37.757882173700416, 127.63758139962634)
                },
                {
                    title: '구리',
                    latlng: new window.kakao.maps.LatLng(37.757976738629864, 127.63758788522958)
                }
            ];
            for (let i = 0; i < positions.length; i++) {
                const imageSrc =
                    positions[i].title === selectedValue
                        ? `/icon/stops/${i + 1}-selected.webp`
                        : `/icon/stops/${i + 1}.webp`; // 마커이미지의 주소입니다
                const imageSize = new window.kakao.maps.Size(37, 37); // 마커 이미지의 이미지 크기 입니다
                const markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize); // 마커 이미지를 생성합니다
                // 마커를 생성합니다
                const marker = new window.kakao.maps.Marker({
                    position: positions[i].latlng, // 마커를 표시할 위치
                    title: positions[i].title, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
                    image: markerImage // 마커 이미지
                });
                marker.setMap(map); // 마커가 지도 위에 표시되도록 설정합니다
            }
        } else {
            const imageSrc = '/icon/busStop-marker.webp'; // 마커이미지의 주소입니다
            const imageSize = new window.kakao.maps.Size(37, 41); // 마커이미지 크기
            const imageOption = { offset: new window.kakao.maps.Point(15, 35) }; // 마커이미지 옵션. 마커의 좌표와 일치시킬 이미지 안에서의 좌표 설정.
            const markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize, imageOption); // 마커의 이미지정보를 가지고 있는 마커이미지를 생성합니다
            const markerPosition = new window.kakao.maps.LatLng(stopLatLong.latitude, stopLatLong.longitude); // 마커 표시될 위치
            // 마커를 생성합니다
            const marker = new window.kakao.maps.Marker({
                position: markerPosition,
                image: markerImage // 마커이미지 설정
            });
            marker.setMap(map); // 마커가 지도 위에 표시되도록 설정합니다
        }
    }, [stopLatLong, selectedValue]);

    return (
        <>
            <div className={ps('pop-up-map')}>
                <div className={ps('pop-up-map__mask')} />
                <div className={ps('pop-up-map__kakao-map--wrapper')}>
                    <div ref={mapRef} style={{ width: '94%' }} />
                    <div className={ps('pop-up-map__location')}>{stopLocation}</div>
                    <div className={ps('pop-up-map__close')} onClick={() => onOffButton(false)}>
                        닫기
                    </div>
                </div>
            </div>
        </>
    );
}

export default PopUpMap;
