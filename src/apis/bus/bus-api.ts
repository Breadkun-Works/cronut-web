import axios from 'axios';
import { Dispatch, SetStateAction } from 'react';
import { BusStations } from '../../types/bus';

export const fetchBusData = async (
    selectedValue: string,
    lat: number,
    lng: number,
    setArrivalTime: Dispatch<
        SetStateAction<{
            mainbox: string;
            time: string;
            ampm: string;
            remainingTime: string;
            remainingText: string;
        }>
    >,
    setBusStations: Dispatch<SetStateAction<BusStations[]>>,
    setNotification: Dispatch<SetStateAction<boolean>>
) => {
    try {
        const result = await axios.post('https://babkaotalk.herokuapp.com/webShuttle', {
            destNm: selectedValue,
            originGps: `${lng},${lat} `
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
        setArrivalTime({
            mainbox: '통신장애',
            time: '',
            ampm: '',
            remainingTime: '',
            remainingText: ''
        });
        setNotification(false);
        console.log('현재 위치에서 도착지까지 남은 시간 가져오기 실패.');
        console.log(error);
    }
};

// 현재좌표 => 도로명 주소 변환 함수
// 매개변수로 함수를 전달하는 방식은 주로 콜백 함수나 이벤트 핸들러 등의 상황에서 사용
export const getAddr = (
    lat: number,
    lng: number,
    setAddress: Dispatch<
        SetStateAction<{
            region_1depth_name: string;
            region_2depth_name: string;
            region_3depth_name: string;
        }>
    >
) => {
    const geocoder = new window.kakao.maps.services.Geocoder();
    const coord = new window.kakao.maps.LatLng(lat, lng);
    const callback = (result: any, status: any) => {
        if (status === window.kakao.maps.services.Status.OK) {
            // 글자 자르기
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
        }
    };
    geocoder.coord2Address(coord.getLng(), coord.getLat(), callback);
};
