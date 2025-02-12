import axios, { AxiosError } from 'axios';
import { useMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import { ICreateCartResponse, INewCartType } from '@/types/cart';

const createCart = async (newCart: INewCartType): Promise<ICreateCartResponse> => {
    const { data } = await axios.post<ICreateCartResponse>(
        `http://api.breadkun.com:${process.env.NEXT_PUBLIC_PORT}/api/cafe/carts`,
        newCart
    );
    return data; // 응답 데이터만 반환
};

export const useCreateCart = (
    options?: UseMutationOptions<ICreateCartResponse, AxiosError, INewCartType>
): UseMutationResult<ICreateCartResponse, AxiosError, INewCartType> =>
    useMutation({ mutationFn: createCart, ...options });
