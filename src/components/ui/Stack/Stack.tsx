import { forwardRef } from 'react';
import { StackTypes } from '@/components/ui/Stack/Stack.tyeps';
import { StackWrapper } from '@/components/ui/Stack/Stack.styles';

export const Stack = forwardRef<HTMLButtonElement, StackTypes>((props, ref) => {
    const { children, direction, gap, align, justify, css, margin, padding } = props;
    return (
        <StackWrapper
            direction={direction}
            gap={gap}
            align={align}
            justify={justify}
            css={css}
            margin={margin}
            padding={padding}
        >
            {children}
        </StackWrapper>
    );
});

Stack.displayName = 'Stack';
