import { forwardRef } from 'react';
import { ButtonTypes } from '@/components/ui/Button/Button.types';
import { ButtonWrap } from '@/components/ui/Button/Button.styles';

export const Button = forwardRef<HTMLButtonElement, ButtonTypes>((props, ref) => {
    const { children, variant, color, bgColor, textColor, onClick } = props;
    return (
        <ButtonWrap ref={ref} variant={variant} color={color} bgColor={bgColor} textColor={textColor} onClick={onClick}>
            {children}
        </ButtonWrap>
    );
});

Button.displayName = 'Button';
