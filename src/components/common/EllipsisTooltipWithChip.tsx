'use client';
import { EllipsisTooltipWithChipProps } from '@/types/common';
import React, { useEffect, useRef, useState } from 'react';
import { useResponsive, useResponsiveConfig } from '@/utils/hook';
import { ClickAwayListener, Tooltip, Typography } from '@mui/material';
import { isMobileDevice } from '@/utils/util';

export const EllipsisTooltipWithChip = ({
    title,
    children,
    style,
    customMaxWidthKey,
    forceTooltip = false,
    withIcon
}: EllipsisTooltipWithChipProps) => {
    const textRef = useRef<HTMLElement>(null);
    const [isOverflowed, setIsOverflowed] = useState(false);
    const [open, setOpen] = useState(false);
    const { isSm, isMd, isLg } = useResponsive();

    const { maxWidth } = useResponsiveConfig(customMaxWidthKey);
    const { fontSize } = useResponsiveConfig('cart');

    useEffect(() => {
        const checkOverflow = () => {
            const el = textRef.current;
            if (!el) return;
            setIsOverflowed(el.scrollWidth > el.clientWidth);
        };

        checkOverflow();
        window.addEventListener('resize', checkOverflow);

        return () => {
            window.removeEventListener('resize', checkOverflow);
        };
    }, [children, maxWidth, withIcon]);

    const shouldShowTooltip = forceTooltip || isOverflowed;

    const textStyle = {
        ...style,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        fontSize,
        display: 'inline-block',
        maxWidth: !isLg ? (!withIcon ? `calc(${maxWidth} + 8vw)` : maxWidth) : !withIcon ? 'auto' : '70%'
    };

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

    const handleToggleTooltip = () => {
        if (isMobileDevice()) setOpen(prev => !prev);
    };

    if (shouldShowTooltip) {
        if (isMobileDevice()) {
            return (
                <ClickAwayListener onClickAway={() => setOpen(false)}>
                    <Tooltip
                        title={
                            <Typography
                                // fontSize={'small'}
                                fontSize={fontSize}
                                sx={{ maxWidth: tooltipMaxWidth, whiteSpace: 'normal', wordWrap: 'break-word' }}
                            >
                                {title}
                            </Typography>
                        }
                        open={open}
                        placement="top"
                        arrow
                    >
                        <span
                            ref={textRef}
                            style={{
                                ...textStyle
                            }}
                            onClick={handleToggleTooltip}
                        >
                            {children}
                        </span>
                    </Tooltip>
                </ClickAwayListener>
            );
        }

        return (
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
                <span
                    ref={textRef}
                    style={{
                        ...textStyle
                    }}
                >
                    {children}
                </span>
            </Tooltip>
        );
    }

    // 툴팁이 비활성화된 경우 - 일반 텍스트
    return (
        <span ref={textRef} style={{ ...textStyle }}>
            {children}
        </span>
    );
};
