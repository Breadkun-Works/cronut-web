import styled from '@emotion/styled';
import { ScrollBar } from '@/styles/common.styles';
import { css } from '@emotion/react';

export const ModalWrap = styled.div<{ width?: string | number; modalType?: string }>`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: ${({ width }) => (width ? (typeof width === 'number' ? `${width}px` : width) : '500px')};
    padding: ${({ modalType }) => (modalType === 'alert' ? '25px 20px' : '16px')};
    border-radius: 12px;
    background-color: #212529;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);

    ${({ theme }) => theme.breakpoints.down('lg')} {
        width: 100%;
    }
`;

export const ModalTitle = styled.div<{ modalType?: string }>`
    font-size: 24px;
    font-weight: bold;

    ${({ modalType }) =>
        modalType === 'alert' &&
        css`
            margin-bottom: 15px;
        `}
`;

export const ModalContent = styled.div<{ fixedContentPosition?: string; modalType?: string }>`
    width: 100%;

    ${({ fixedContentPosition }) =>
        fixedContentPosition &&
        css`
            display: flex;
            flex-direction: column;
        `}

    ${({ modalType }) =>
        modalType &&
        css`
            text-align: center;
        `}
`;

export const ModalFixedContent = styled.div<{ position?: string }>`
    order: ${({ position }) => (position === 'bottom' ? 3 : 1)};
    width: 100%;
    padding: 16px 0;
`;

export const ScrollContent = styled.div<{ fixedContentPosition?: string }>`
    ${ScrollBar};

    overflow-y: auto;
    max-height: 500px;

    &.isScroll {
        padding-right: 5px;
    }

    ${({ theme }) => theme.breakpoints.down('lg')} {
        max-height: calc(100vh - 300px);
    }

    ${({ fixedContentPosition }) =>
        fixedContentPosition &&
        css`
            order: 2;
        `}
`;

export const ModalButtonWrap = styled.div`
    display: flex;
    gap: 10px;
    margin-top: 20px;
`;
