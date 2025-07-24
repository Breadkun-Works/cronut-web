'use client';

import { Backdrop } from '@mui/material';
import { ICommonModalTypes } from '@/types/common';
import { useHasVerticalScroll } from '@/utils/hook';
import {
    ModalButtonWrap,
    ModalContent,
    ModalFixedContent,
    ModalTitle,
    ModalWrap,
    ScrollContent
} from '@/styles/components/page/cafe/modal/common-modal.styles';
import { Button } from '@/components/ui/Button/Button';

export const CommonModal = (props: ICommonModalTypes) => {
    const {
        open,
        onClose,
        content,
        title,
        onConfirm,
        confirmText,
        width,
        fixedContentPosition = 'bottom',
        modalType
    } = props;
    const { ref, hasScroll } = useHasVerticalScroll();

    return (
        <Backdrop
            open={open}
            onClick={onClose}
            aria-hidden={false}
            sx={{
                zIndex: 1400,
                backgroundColor: 'rgba(0, 0, 0, 0.75)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 2
            }}
        >
            <ModalWrap onClick={e => e.stopPropagation()} width={width} modalType={modalType}>
                <ModalTitle modalType={modalType}>{title}</ModalTitle>
                <ModalContent fixedContentPosition={fixedContentPosition} modalType={modalType}>
                    {props.fixedContent && (
                        <ModalFixedContent position={fixedContentPosition}>{props.fixedContent}</ModalFixedContent>
                    )}
                    {/* 스크롤 영역 */}
                    <ScrollContent
                        ref={ref}
                        className={hasScroll ? 'isScroll' : ''}
                        fixedContentPosition={fixedContentPosition}
                    >
                        {content}
                    </ScrollContent>
                </ModalContent>

                <ModalButtonWrap onClick={e => e.stopPropagation()}>
                    <Button variant={'line'} color={'#cf7500'} onClick={onClose}>
                        닫기
                    </Button>
                    {onConfirm && (
                        <Button variant={'contained'} onClick={onConfirm}>
                            {confirmText ?? '확인'}
                        </Button>
                    )}
                </ModalButtonWrap>
            </ModalWrap>
        </Backdrop>
    );
};
