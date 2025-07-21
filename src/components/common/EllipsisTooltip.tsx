import React, { useEffect, useState, useRef, ReactNode, cloneElement, isValidElement } from 'react';
import { ClickAwayListener, Tooltip, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useResponsiveConfig } from '@/utils/hook';
import { isMobileDevice } from '@/utils/util';

type EllipsisTooltipProps = {
    title: string;
    children: ReactNode;
    entry?: string;
};

export const EllipsisTooltip = ({ title, children, entry }: EllipsisTooltipProps) => {
    const localRef = useRef<HTMLElement>(null);
    const [isOverflowed, setIsOverflowed] = useState(false);
    const [open, setOpen] = useState(false);

    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.between('xs', 'sm')); // 360px ~ 480px
    const isMd = useMediaQuery(theme.breakpoints.between('sm', 'md')); // 480px ~ 768px
    const isLg = useMediaQuery(theme.breakpoints.between('md', 'lg')); // 768px ~ 1024px
    const { ellipsisMaxWidth } = useResponsiveConfig('cart');

    const maxWidthMap = {
        sm: { tooltip: '180px' },
        md: { tooltip: '200px' },
        lg: { tooltip: '350px' },
        xl: { tooltip: '400px' }
    };

    const getMaxWidth = () => {
        if (isSm) return maxWidthMap.sm;
        if (isMd) return maxWidthMap.md;
        if (isLg) return maxWidthMap.lg;
        return maxWidthMap.xl;
    };

    const { tooltip: tooltipMaxWidth } = getMaxWidth();

    useEffect(() => {
        const update = () => {
            const el = localRef.current;
            if (!el) return;
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
    }, [children]);

    useEffect(() => {
        if (!isMobileDevice() || !open || !localRef.current) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) {
                    setOpen(false);
                }
            },
            { root: null, threshold: 0 }
        );

        observer.observe(localRef.current);

        return () => {
            observer.disconnect();
        };
    }, [open]);

    const handleToggleTooltip = () => {
        if (isMobileDevice()) setOpen(prev => !prev);
    };

    const wrappedChildren = isValidElement(children) ? (
        cloneElement(children as React.ReactElement, {
            ref: localRef,
            onClick: isMobileDevice() ? handleToggleTooltip : undefined,
            style: {
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: ['cartHeader', 'meal'].includes(entry ?? '') ? '100%' : ellipsisMaxWidth
            }
        })
    ) : (
        <span
            ref={localRef}
            style={{
                display: 'inline-block',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                verticalAlign: 'middle',
                maxWidth: entry === 'cartHeader' ? '100%' : ellipsisMaxWidth
            }}
            onClick={isMobileDevice() ? handleToggleTooltip : undefined}
        >
            {children}
        </span>
    );

    if (!isOverflowed) return wrappedChildren;

    return isMobileDevice() ? (
        <ClickAwayListener onClickAway={() => setOpen(false)}>
            <Tooltip
                title={
                    <Typography
                        fontSize={'small'}
                        sx={{ maxWidth: tooltipMaxWidth, whiteSpace: 'normal', wordWrap: 'break-word' }}
                    >
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
                <Typography
                    fontSize={'small'}
                    sx={{ maxWidth: tooltipMaxWidth, whiteSpace: 'normal', wordWrap: 'break-word' }}
                >
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
