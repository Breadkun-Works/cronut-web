// menu name 자르는 함수
export const menuNameEdit = (value: string[]): string => {
    if (value[0] === '★특별한 한상★') {
        return value[1];
    } else {
        return value[0].split(/[+(&*\s]/)[0];
    }
};
