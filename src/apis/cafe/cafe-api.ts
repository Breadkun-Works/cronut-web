import axios, { AxiosError } from 'axios';
import { useMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import { ICreateCartResponse, INewCartType } from '@/types/cart';
import { getCookie } from '@/utils/cookie';

const createCart = async (newCart: INewCartType): Promise<ICreateCartResponse> => {
    const cookieUserInfo = getCookie('BRK-UUID');
    console.log(cookieUserInfo, 'cookieUserInfo');
    const { data } = await axios.post<ICreateCartResponse>(
        // `http://146.56.119.222:65477/api/cafe/carts`,
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/cafe/carts`,
        newCart,
        {
            headers: {
                Accept: 'application/vnd.breadkun.v1+json',
                'X-User-UUID': cookieUserInfo.key
            }
        }
    );
    return data; // 응답 데이터만 반환
};

export const useCreateCart = (
    options?: UseMutationOptions<ICreateCartResponse, AxiosError, INewCartType>
): UseMutationResult<ICreateCartResponse, AxiosError, INewCartType> =>
    useMutation({ mutationFn: createCart, ...options });
