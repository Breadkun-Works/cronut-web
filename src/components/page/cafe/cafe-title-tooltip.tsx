import React, { useEffect, useState, useImperativeHandle, forwardRef, useRef } from 'react';
import { ClickAwayListener, Tooltip } from '@mui/material';
import { ConfirmHeaderTitle } from '@/styles/cart/cart.styles';

type Props = {
    title: string;
    isMobile: boolean;
    parentRef: React.RefObject<HTMLElement>;
};

export const EllipsisTooltip = forwardRef<HTMLDivElement, Props>(({ title, isMobile, parentRef }, ref) => {
    const localRef = useRef<HTMLDivElement>(null);
    const [maxWidth, setMaxWidth] = useState<number | undefined>(undefined);
    const [isOverflowed, setIsOverflowed] = useState(false);
    const [open, setOpen] = useState(false);

    // 외부 ref로 접근 가능하게
    useImperativeHandle(ref, () => localRef.current as HTMLDivElement, []);

    useEffect(() => {
        const update = () => {
            const el = localRef.current;
            const parent = parentRef.current;

            if (!el || !parent) return;

            setMaxWidth(parent.clientWidth);
            setIsOverflowed(el.scrollWidth > el.clientWidth);
        };

        const observer = new ResizeObserver(update);
        if (parentRef.current) observer.observe(parentRef.current);

        window.addEventListener('resize', update);

        update(); // 초기 계산

        return () => {
            observer.disconnect();
            window.removeEventListener('resize', update);
        };
    }, [title, parentRef]);

    const content = (
        <ConfirmHeaderTitle
            ref={localRef}
            isMobile={isMobile}
            maxWidth={maxWidth}
            onClick={() => {
                if (isMobile && isOverflowed) setOpen(prev => !prev);
            }}
        >
            {title}
        </ConfirmHeaderTitle>
    );

    if (!isOverflowed) return content;

    return isMobile ? (
        <ClickAwayListener onClickAway={() => setOpen(false)}>
            <Tooltip
                title={title}
                open={open}
                placement="top"
                arrow
                onClose={() => setOpen(false)}
                disableFocusListener
                disableHoverListener
                disableTouchListener
            >
                {content}
            </Tooltip>
        </ClickAwayListener>
    ) : (
        <Tooltip title={title} placement="top" arrow>
            {content}
        </Tooltip>
    );
});

EllipsisTooltip.displayName = 'EllipsisTooltip';
