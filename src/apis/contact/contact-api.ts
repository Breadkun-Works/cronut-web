import axios, { AxiosResponse } from 'axios';
import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { InquiryFormData, InquiryType } from '@/types/contact';

export const submit = async (type: InquiryType, formData: InquiryFormData) => {
    const response = await axios.post(
        '/api/inquiry',
        {
            type,
            formData,
            pathname: window.location.pathname
        },
        {
            headers: {
                'Content-Type': 'application/json'
            }
        }
    );
    return response;
};

export const useInquiryMutation = (
    options?: Omit<
        UseMutationOptions<AxiosResponse, Error, { type: InquiryType; formData: InquiryFormData }>,
        'mutationFn'
    >
) => {
    return useMutation({
        mutationFn: ({ type, formData }: { type: InquiryType; formData: InquiryFormData }) => submit(type, formData),
        ...options
    });
};
