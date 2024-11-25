import React, { useEffect, useRef } from 'react';

function KakaoMap({
    mapHeight,
    mapWidth,
    mapBorderRadius,
    latLong,
    levelNum,
    draggableType,
    trafficInfo
}: {
    mapHeight: string;
    mapWidth: string;
    mapBorderRadius: string;
    latLong: { latitude: number; longitude: number };
    levelNum: number;
    draggableType: boolean;
    trafficInfo: boolean;
}) {
    const mapRef = useRef(null);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.KAKAO_KEY}`;
        script.async = true;
        document.head.appendChild(script);

        script.onload = () => {
            if (window.kakao && window.kakao.maps) {
                console.log(window.kakao, window.kakao.maps);
                const container = document.getElementById('map');
                const options = {
                    center: new window.kakao.maps.LatLng(33.450701, 126.570667),
                    level: 3
                };
                new window.kakao.maps.Map(container, options);
            }
        };

        return () => {
            if (script.parentNode) {
                script.parentNode.removeChild(script);
            }
        };
    }, []);

    // 지도 생성(초기화)
    useEffect(() => {
        if (typeof window === 'undefined') return;
        else {
            const container = mapRef.current; // return 값 DOM
            const options = {
                center: new window.kakao.maps.LatLng(latLong.latitude, latLong.longitude), // 지도 중심좌표
                draggable: draggableType, // 이동, 확대, 축소 금지
                disableDoubleClick: true, // 더블클릭 방지 옵션
                level: levelNum // 지도 확대 레벨
            };
            const map = new window.kakao.maps.Map(container, options); // 지도생성
            trafficInfo && map.addOverlayMapTypeId(window.kakao.maps.MapTypeId.TRAFFIC); // 교통정보
            const imageSrc = '/logo/breadkun-marker.webp'; // 마커이미지의 주소입니다
            const imageSize = new window.kakao.maps.Size(37, 41); // 마커이미지 크기
            const imageOption = { offset: new window.kakao.maps.Point(15, 35) }; // 마커이미지 옵션. 마커의 좌표와 일치시킬 이미지 안에서의 좌표 설정.
            const markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize, imageOption); // 마커의 이미지정보를 가지고 있는 마커이미지를 생성합니다
            const markerPosition = new window.kakao.maps.LatLng(latLong.latitude, latLong.longitude); // 마커 표시될 위치
            // 마커를 생성합니다
            const marker = new window.kakao.maps.Marker({
                position: markerPosition,
                image: markerImage // 마커이미지 설정
            });
            marker.setMap(map); // 마커가 지도 위에 표시되도록 설정합니다
        }
    }, [levelNum, draggableType, trafficInfo, latLong]);
    // webkit borderRadius와 overflow-hidden 적용시 버그 해결을 위한 isolation.
    return (
        <div id={'map'}>
            <div
                ref={mapRef}
                style={{ height: mapHeight, width: mapWidth, borderRadius: mapBorderRadius, isolation: 'isolate' }}
            />
        </div>
    );
}

KakaoMap.defaultProps = {
    levelNum: 5,
    draggableType: false,
    trafficInfo: false
};

export default KakaoMap;
