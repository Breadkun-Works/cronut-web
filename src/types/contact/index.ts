export type InquiryType = 'bug-report' | 'join-request' | 'other' | '';

export interface InquiryModalProps {
    isOpen: boolean;
    onClose: () => void;
    inquiryType?: InquiryType;
}

export interface InquiryFormData {
    contact: string;
    email: string;
    content: string;
}

export interface InquirySendForm {
    username: string;
    avatar_url: string;
    embeds: {
        title: string;
        color: number;
        fields: { name: string; value: string; inline: boolean }[];
        footer: { text: string };
    }[];
}

export type InquiryFormMap = Map<InquiryType, InquirySendForm>;
