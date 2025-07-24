import styled from '@emotion/styled';
import { StackTypes } from '@/components/ui/Stack/Stack.tyeps';
import { css } from '@emotion/react';

export const StackWrapper = styled.div<StackTypes>`
    display: flex;
    flex-direction: ${({ direction }) => (direction === 'column' ? 'column' : 'row')};
    gap: ${({ gap }) => (gap ? gap + 'px' : 0)};
    align-items: ${({ align }) => (align ? align : 'center')};
    justify-content: ${({ justify }) => (justify ? justify : 'flex-start')};
    margin: ${({ margin }) => (margin ? margin : 0)};
    padding: ${({ padding }) => (padding ? padding : 0)};
`;
