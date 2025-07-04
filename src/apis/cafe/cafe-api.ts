import axios, { AxiosError } from 'axios';
import {
    useInfiniteQuery,
    useMutation,
    UseMutationOptions,
    UseMutationResult,
    useQuery,
    UseQueryOptions
} from '@tanstack/react-query';
import {
    IAddCartMenuResponse,
    IAddMenuCartParams,
    ICafeMenuBoardResponse,
    ICartInfo,
    ICreateCartResponse,
    IDeleteCartItem,
    INewCartType
} from '@/types/cart';
import { getCookie } from '@/utils/cookie';
import { Company, DrinkCategory } from '@/types/common';
import { utf8ToBase64 } from '@/utils/util';
import { notFound } from 'next/navigation';

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
    query: { size: number; category?: DrinkCategory | string; name?: string; cafeLocation?: Company | string }
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

    return {
        records: data.data ? data.data.cafeMenuBoard : [],
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
    category?: DrinkCategory | string;
    name?: string;
    cafeLocation?: Company | string;
}) => {
    return useInfiniteQuery({
        queryKey: ['cafeMenuInfinite', { ...query }],
        refetchOnWindowFocus: false,
        enabled: !!query.cafeLocation,
        queryFn: ({ pageParam = 0 }) => getCafeMenu(pageParam, query),
        initialPageParam: 0,
        getNextPageParam: lastPage => lastPage.pageInfo.nextPage
    });
};

const getCartById = async (cartId: string): Promise<ICartInfo> => {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cafe/carts/${cartId}`);
    return response.data.data.cafeCart; // Adjusted based on the response structure
};

export const useGetCartById = (cartId: string, options?: UseQueryOptions<ICartInfo>) => {
    return useQuery<ICartInfo>({
        queryKey: ['cart', cartId],
        queryFn: () => getCartById(cartId),
        enabled: !!cartId,
        refetchOnWindowFocus: false,
        retry: 2,
        ...options
    });
};

const addMenuCart = async ({ cafeCartId, cartData, user }: IAddMenuCartParams): Promise<IAddCartMenuResponse> => {
    const { data } = await axios.post<IAddCartMenuResponse>(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cafe/carts/${cafeCartId}/items`,
        [cartData],
        {
            headers: {
                Accept: 'application/vnd.breadkun.v1+json',
                'X-User-UUID': user.uuid,
                'X-User-Name': utf8ToBase64(user.userName)
            }
        }
    );
    return data;
};

export const useAddMenuCart = (
    options?: Omit<UseMutationOptions<IAddCartMenuResponse, Error, IAddMenuCartParams, unknown>, 'mutationFn'>
) => {
    return useMutation<IAddCartMenuResponse, Error, IAddMenuCartParams, unknown>({
        mutationFn: addMenuCart,
        ...options
    });
};

export const deleteCartItem = async ({ cafeCartId, user }: IDeleteCartItem) => {
    try {
        const res = await axios.post(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cafe/carts/items/delete`,
            { ids: [cafeCartId] },
            {
                headers: {
                    Accept: 'application/vnd.breadkun.v1+json',
                    'X-User-UUID': user.uuid,
                    'X-User-Name': utf8ToBase64(user.userName)
                }
            }
        );
        return res.status === 204;
    } catch (e) {
        console.error(e);
    }
};

export const expireCart = async ({ cafeCartId, user }: IDeleteCartItem) => {
    try {
        const res = await axios.patch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cafe/carts/${cafeCartId}/expire`,
            {},
            {
                headers: {
                    Accept: 'application/vnd.breadkun.v1+json',
                    'X-User-UUID': user.uuid
                }
            }
        );
        return res.status === 204;
    } catch (e) {
        console.error(e);
    }
};

export const getInitialCartItems = async (cartId: string) => {
    const response = await fetch(`https://api.breadkun.com/api/cafe/carts/${cartId}/items?include=DETAILS`);
    if (!response.ok) throw new Error('네트워크 응답 실패');
    const json = await response.json();
    return json.data?.cafeCartItem || [];
};

export const fetchCart = async (cafeCartId: string) => {
    const secretKey: string = process.env.SECRET_ENCRYPT_KEY!;
    const res = await fetch(`https://api.breadkun.com/api/cafe/carts/${cafeCartId}`, {
        headers: {
            Accept: 'application/vnd.breadkun.v1+json',
            Origin: `https://breadkun-dev.vercel.app`,
            'X-SSR-Token': secretKey
        },
        cache: 'no-store',
        next: { revalidate: 0 }
    });

    if (res.status === 404) {
        notFound();
    }

    const data = await res.json();
    return data;
};
