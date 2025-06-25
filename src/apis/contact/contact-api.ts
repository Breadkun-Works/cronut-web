import axios, { AxiosResponse } from 'axios';
import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { ContactSendForm, ContactType } from '@/types/contact';

const contactUrlMap = new Map([
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

export const submit = async (type: ContactType, formData: ContactSendForm) => {
    const response = await axios.post(contactUrlMap.get(type) ?? '', formData, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response;
};

export const useContactMutation = (
    options?: Omit<
        UseMutationOptions<AxiosResponse, Error, { type: ContactType; formData: ContactSendForm }>,
        'mutationFn'
    >
) => {
    return useMutation({
        mutationFn: ({ type, formData }: { type: ContactType; formData: ContactSendForm }) => submit(type, formData),
        ...options
    });
};
