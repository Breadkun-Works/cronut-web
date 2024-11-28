import axios from 'axios';
import { addOrSubDays, formatDate, formatTime } from '@/utils/dates';
import { WeatherReturn } from '@/types/home';

const cancelTokenSource = axios.CancelToken.source(); // 요청 취소 토큰

export const fetchWeatherData = async (company: string) => {
    const now: Date = new Date(); // 현재 날짜
    const hour = now.getHours();
    const yesterday: Date = new Date(now); // 어제 날짜

    // 달과 연도 넘어갈때 버그 방지 처리
    if (yesterday.getDate() > now.getDate()) {
        yesterday.setMonth(yesterday.getMonth() - 1); // 현재 날짜와 어제 날짜의 일(day)이 다른 경우 이전 달로 설정
    }

    // 현재 날짜 및 시간 포맷
    const currentDate = formatDate(now, 1);
    const currentTime = formatTime(now);

    // 어제 날짜 포맷
    const yesterdayDate = formatDate(addOrSubDays('sub', now, 1), 1);

    let baseDate = currentDate; // 조회날짜
    let baseTime = ''; // 조회시간
    // '0200', '0500', '0800', '1100', '1400', '1700', '2000', '2300' 기상청 API 일 8회 업데이트 시간 1시간 후에 조회.
    if (currentTime < 180) {
        baseDate = yesterdayDate;
        baseTime = '2300';
    } else if (currentTime < 360) {
        baseTime = '0200';
    } else if (currentTime < 540) {
        baseTime = '0500';
    } else if (currentTime < 720) {
        baseTime = '0800';
    } else if (currentTime < 900) {
        baseTime = '1100';
    } else if (currentTime < 1080) {
        baseTime = '1400';
    } else if (currentTime < 1260) {
        baseTime = '1700';
    } else {
        baseTime = '2000';
    }

    try {
        const weatherResponse = await axios.get(
            `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=${
                process.env.NEXT_PUBLIC_OPEN_API_ENCODING_KEY
            }&numOfRows=200&pageNo=1&dataType=json&base_date=${baseDate}&base_time=${baseTime}&nx=${company === '강촌' ? '71' : '60'}&ny=${company === '강촌' ? '132' : '127'}`,
            {
                cancelToken: cancelTokenSource.token,
                timeout: 50000
            }
        );
        const weather = weatherResponse.data.response.body.items.item;
        const weatherData = weather.reduce(
            (acc: { [key in string]: WeatherReturn[] }, curr: WeatherReturn) => {
                const { category, fcstDate, fcstTime } = curr;
                //카테고리가 같은 날씨 데이터끼리 묶기
                const isCurrentTime =
                    +fcstDate > +currentDate ||
                    (+fcstDate === +currentDate && +fcstTime >= +hour.toString().padStart(2, '0').padEnd(4, '0'));
                if (isCurrentTime) {
                    if (!acc[category]) {
                        acc[category] = [];
                    }
                    acc[category].push(curr);
                }
                return acc;
            },
            { SKY: [], POP: [], REH: [], TMP: [] }
        );
        return weatherData;
    } catch (error) {
        console.log('날씨 가져오기 실패.');
        console.log(error);
    }
};
