import axios, { AxiosError } from 'axios';
import { useInfiniteQuery, useMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import { ICafeMenuBoardResponse, ICreateCartResponse, INewCartType } from '@/types/cart';
import { getCookie } from '@/utils/cookie';
import { Company, DrinkCategory } from '@/types/common';

const createCart = async (newCart: INewCartType): Promise<ICreateCartResponse> => {
    const cookieUUID = getCookie('BRK-UUID');
    const { data } = await axios.post<ICreateCartResponse>(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cafe/carts`,
        newCart,
        {
            headers: {
                Accept: 'application/vnd.breadkun.v1+json',
                'X-User-UUID': cookieUUID
            }
        }
    );
    return data; // 응답 데이터만 반환
};

export const useCreateCart = (
    options?: UseMutationOptions<ICreateCartResponse, AxiosError, INewCartType>
): UseMutationResult<ICreateCartResponse, AxiosError, INewCartType> =>
    useMutation({ mutationFn: createCart, ...options });

const getCafeMenu = async (
    pageParam: number,
    query: { size: number; category?: DrinkCategory; name?: string; cafeLocation?: Company }
): Promise<{
    records: Array<ICafeMenuBoardResponse>;
    pageInfo: { first: boolean; last: boolean; currentPage: number; nextPage: number | null };
}> => {
    const data = await axios
        .get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cafe/menus/board`, {
            params: { page: pageParam, ...query },
            headers: { Accept: 'application/vnd.breadkun.v1+json' }
        })
        .then(({ data }) => data);

    const { currentPage, totalPages } = data.meta;

    console.log(totalPages, currentPage);

    return {
        records: data.data.cafeMenuBoard,
        pageInfo: {
            first: currentPage === 0,
            last: currentPage === totalPages - 1,
            currentPage,
            nextPage: currentPage < totalPages - 1 ? currentPage + 1 : null
        }
    };
};

export const useGetCafeMenuInfinite = (query: {
    size: number;
    category?: DrinkCategory;
    name?: string;
    cafeLocation?: Company;
}) => {
    return useInfiniteQuery({
        queryKey: ['cafeMenuInfinite', query],
        queryFn: ({ pageParam }) => getCafeMenu(pageParam, query),
        initialPageParam: 0,
        getNextPageParam: lastPage => lastPage.pageInfo.nextPage
    });
};
