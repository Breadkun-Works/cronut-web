import { Cookies } from 'react-cookie';

export const getCookie = (name: string) => {
    const cookies = new Cookies();
    return cookies.get(name);
};

export const setCookie = (cookieName: string, key: string, value: string) => {
    const cookies = new Cookies();
    cookies.set(
        cookieName,
        { [key]: value },
        {
            path: '/',
            secure: true
        }
    );
};

export const updateCookie = (cookieName: string, key: string, value: string) => {
    const cookies = new Cookies();
    cookies.set(
        cookieName,
        {
            ...getCookie(cookieName),
            [key]: value
        },
        {
            path: '/',
            secure: true
        }
    );
};
