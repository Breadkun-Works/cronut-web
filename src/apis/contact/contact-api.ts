import axios, { AxiosResponse } from 'axios';
import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { InquirySendForm, InquiryType } from '@/types/contact';

const inquiryUrlMap = new Map([
    [
        'bug-report',
        'https://discord.com/api/webhooks/1368900763555987508/pba6soAPjnrfY1gzJFWRrndxZhXTKoaNSORtgWPod_EhPjSEXo5lZCVqYMaZ2aIqfC-b'
    ],
    [
        'join-request',
        'https://discord.com/api/webhooks/1368884249188499567/RUd5dPHpSm1q1WBwClM_hJWxNeQwptCbK87HX8aSCo70iv04eEfw0XF_I-OeB3hKGSgT'
    ],
    [
        'other',
        'https://discord.com/api/webhooks/1368884249188499567/RUd5dPHpSm1q1WBwClM_hJWxNeQwptCbK87HX8aSCo70iv04eEfw0XF_I-OeB3hKGSgT'
    ]
]);

export const submit = async (type: InquiryType, formData: InquirySendForm) => {
    const response = await axios.post(inquiryUrlMap.get(type) ?? '', formData, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response;
};

export const useInquiryMutation = (
    options?: Omit<
        UseMutationOptions<AxiosResponse, Error, { type: InquiryType; formData: InquirySendForm }>,
        'mutationFn'
    >
) => {
    return useMutation({
        mutationFn: ({ type, formData }: { type: InquiryType; formData: InquirySendForm }) => submit(type, formData),
        ...options
    });
};
