import { ReactNode, HTMLAttributes } from 'react';
import { SerializedStyles } from '@emotion/react';

export interface StackTypes extends HTMLAttributes<HTMLDivElement> {
    children?: ReactNode;
    direction?: 'row' | 'column';
    gap?: number;
    align?: string;
    justify?: string;
    css?: SerializedStyles;
    margin?: string;
    padding?: string;
}
