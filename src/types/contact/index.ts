export type ContactType = 'bug-report' | 'join-request' | 'other' | '';

export interface ContactModalProps {
    isOpen: boolean;
    onClose: () => void;
    contactType?: ContactType;
}

export interface ContactFormData {
    contact: string;
    email: string;
    content: string;
}

export interface ContactSendForm {
    username: string;
    avatar_url: string;
    embeds: {
        title: string;
        color: number;
        fields: { name: string; value: string; inline: boolean }[];
        footer: { text: string };
    }[];
}

export type ContactFormMap = Map<ContactType, ContactSendForm>;
