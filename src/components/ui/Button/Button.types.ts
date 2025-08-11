import { ReactNode, ButtonHTMLAttributes, MouseEventHandler } from 'react';

export interface ButtonTypes extends ButtonHTMLAttributes<HTMLButtonElement> {
    children?: ReactNode;
    variant?: string;
    color?: string;
    bgColor?: string;
    textColor?: string;
    onClick?: MouseEventHandler<HTMLButtonElement>;
}
