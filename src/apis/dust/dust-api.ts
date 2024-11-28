import axios from 'axios';

const cancelTokenSource = axios.CancelToken.source(); // 요청 취소 토큰

export const fetchDustDataTest = async (company: string) => {
    const getPM10Level = (pm10Value: string): string => {
        if (pm10Value === '-') {
            return '통신장애';
        } else {
            const pm10 = +pm10Value;
            if (pm10 <= 30) {
                return '좋음';
            } else if (pm10 <= 50) {
                return '보통';
            } else if (pm10 <= 100) {
                return '나쁨';
            } else {
                return '최악';
            }
        }
    };
    // 초미세먼지 Level 리턴 함수
    const getPM25Level = (pm25Value: string): string => {
        if (pm25Value === '-') {
            return '통신장애';
        } else {
            const pm25 = +pm25Value;
            if (pm25 <= 15) {
                return '좋음';
            } else if (pm25 <= 25) {
                return '보통';
            } else if (pm25 <= 50) {
                return '나쁨';
            } else {
                return '최악';
            }
        }
    };
    try {
        const dustResponse = await axios.get(
            `https://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty?stationName=${
                company === '강촌' ? '가평' : '중구'
            }&ver=1.4&dataTerm=daily&pageNo=1&numOfRows=1&returnType=json&serviceKey=${process.env.NEXT_PUBLIC_OPEN_API_ENCODING_KEY}`,
            { cancelToken: cancelTokenSource.token, timeout: 5000 } // 캔슬토큰, setTimeOut 5s
        );
        const { dataTime, stationName, pm10Value, pm25Value } = dustResponse.data.response.body.items[0];
        const pm10Level = getPM10Level(pm10Value);
        const pm25Level = getPM25Level(pm25Value);

        return {
            dataTime,
            stationName,
            pm10Level,
            pm25Level,
            pm10Value,
            pm25Value
        };
    } catch (error) {
        console.log('미세먼지 가져오기 실패.');
        console.log(error);
    }
};
