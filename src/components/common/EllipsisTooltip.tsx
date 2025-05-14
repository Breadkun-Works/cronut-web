import React, { useEffect, useState, useRef, ReactNode, cloneElement, isValidElement } from 'react';
import { ClickAwayListener, Tooltip, Typography } from '@mui/material';
import { useResponsive } from '@/utils/hook';

type EllipsisTooltipProps = {
    title: string;
    parentRef?: React.RefObject<HTMLElement>;
    children: ReactNode;
    maxWidth?: number;
    tooltipMaxWidth?: number | string;
};

export const EllipsisTooltip = ({ title, parentRef, children, tooltipMaxWidth = 250 }: EllipsisTooltipProps) => {
    const localRef = useRef<HTMLElement>(null);
    const [isOverflowed, setIsOverflowed] = useState(false);
    const [open, setOpen] = useState(false);
    const { isMobile } = useResponsive();

    useEffect(() => {
        const update = () => {
            const el = localRef.current;
            const parent = parentRef?.current || el?.offsetParent;
            if (!el || !parent) return;

            setIsOverflowed(el.scrollWidth > el.clientWidth);
        };

        const observer = new ResizeObserver(update);
        if (localRef.current) observer.observe(localRef.current);

        window.addEventListener('resize', update);
        update(); // 초기 계산

        return () => {
            observer.disconnect();
            window.removeEventListener('resize', update);
        };
    }, [children, parentRef]);

    const handleToggleTooltip = () => {
        if (isMobile) setOpen(prev => !prev);
    };

    // const wrappedChildren = isValidElement(children) ? (
    //     cloneElement(children as React.ReactElement, {
    //         ref: localRef,
    //         onClick: isMobile ? handleToggleTooltip : undefined
    //     })
    // ) : (
    //     <span
    //         ref={localRef}
    //         style={{
    //             display: 'inline-block',
    //             whiteSpace: 'nowrap',
    //             overflow: 'hidden',
    //             textOverflow: 'ellipsis',
    //             maxWidth: '100%',
    //             verticalAlign: 'middle'
    //         }}
    //         onClick={isMobile ? handleToggleTooltip : undefined}
    //     >
    //         {children}
    //     </span>
    // );

    const wrappedChildren = isValidElement(children) ? (
        cloneElement(children as React.ReactElement, {
            ref: localRef,
            onClick: isMobile ? handleToggleTooltip : undefined,
            style: { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }
        })
    ) : (
        <span
            ref={localRef}
            style={{
                display: 'inline-block',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '100%',
                verticalAlign: 'middle'
            }}
            onClick={isMobile ? handleToggleTooltip : undefined}
        >
            {children}
        </span>
    );

    if (!isOverflowed) return wrappedChildren;

    return isMobile ? (
        <ClickAwayListener onClickAway={() => setOpen(false)}>
            <Tooltip
                title={
                    <Typography sx={{ maxWidth: tooltipMaxWidth, whiteSpace: 'normal', wordWrap: 'break-word' }}>
                        {title}
                    </Typography>
                }
                open={open}
                placement="top"
                arrow
                disableHoverListener
                disableFocusListener
                disableTouchListener
            >
                {wrappedChildren}
            </Tooltip>
        </ClickAwayListener>
    ) : (
        <Tooltip
            title={
                <Typography sx={{ maxWidth: tooltipMaxWidth, whiteSpace: 'normal', wordWrap: 'break-word' }}>
                    {title}
                </Typography>
            }
            placement="top"
            arrow
        >
            {wrappedChildren}
        </Tooltip>
    );
};
