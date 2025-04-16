import { Cookies } from 'react-cookie';

export const getCookie = (name: string) => {
    const cookies = new Cookies();
    return cookies.get(name);
};

export const setCookie = (cookieName: string, value: string) => {
    const cookies = new Cookies();
    cookies.set(cookieName, value, {
        path: '/',
        secure: true
    });
};
