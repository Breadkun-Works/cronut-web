import axios from 'axios';
import { Company } from '@/types/common';

export const fetchMealData = async (location: string, weekNumber: number) => {
    try {
        const result = await axios.post('https://babkaotalk.herokuapp.com/api/webDiet', {
            location: location === Company.KANGCHON ? '강촌' : '을지'
        });
        if (result.data) {
            if (result.data.resultData.updated === weekNumber) {
                return result.data.resultData;
            } else {
                alert(
                    '죄송합니다.\n현재 식단 정보를 가져올 수 없습니다.\n문제가 지속되면 관리자에게 문의해 주시기 바랍니다.'
                );
                console.log('주차 불일치');
            }
        }
    } catch (error) {
        alert('죄송합니다.\n현재 식단 정보를 가져올 수 없습니다.\n문제가 지속되면 관리자에게 문의해 주시기 바랍니다.');
        console.log(error);
    }
};
