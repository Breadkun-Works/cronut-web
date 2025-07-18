export const imageReturn = (pmText: string): string => {
    const baseImageUrl = '/icon/home/dust';
    switch (pmText) {
        case '좋음':
            return `${baseImageUrl}/good.webp`;
        case '보통':
            return `${baseImageUrl}/normal.webp`;
        case '나쁨':
            return `${baseImageUrl}/bad.webp`;
        case '최악':
            return `${baseImageUrl}/fuckingbad.webp`;
        default:
            return `${baseImageUrl}/normal.webp`;
    }
};

export const getWeatherIconPath = (ptyCode: string | undefined, skyCode: string | undefined): string => {
    const sunnyIcon = '/icon/weather/Sunny.webp';
    const cloudyIcon = '/icon/weather/cloudy.webp';
    const overcastIcon = '/icon/weather/overcast.webp';
    const rainIcon = '/icon/weather/rain.webp';
    const snowAndRainIcon = '/icon/weather/snowAndRain.webp';
    const snowIcon = '/icon/weather/snow.webp';
    // 강수형태가 0(없음) 일때,
    switch (ptyCode) {
        case '0':
            switch (skyCode) {
                case '1':
                    return sunnyIcon;
                case '3':
                    return cloudyIcon;
                case '4':
                    return overcastIcon;
            }
            break;
        case '2':
            return snowAndRainIcon;
        case '3':
            return snowIcon;
    }
    return rainIcon;
};

export const getMealImagePath = (meal: string) => {
    const baseUrl = '/images/meal';
    switch (meal) {
        case 'SPECIAL':
            return `${baseUrl}/special.svg`;
        case 'KOREAN1':
            return `${baseUrl}/korean.svg`;
        case 'KOREAN2':
        case 'NOODLE':
            return `${baseUrl}/ramen.svg`;
        case 'CONVENIENCE1':
        case 'CONVENIENCE2':
            return `${baseUrl}/convenience.svg`;
        case 'CONVENIENCE3':
            return `${baseUrl}/protein.svg`;
        default:
            return '';
    }
};
