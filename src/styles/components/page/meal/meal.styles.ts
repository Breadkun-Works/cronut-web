import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { COLORS_DARK } from '@/data';
import { innerContent, ScrollBarTransparent } from '@/styles/common.styles';

const rowLayout = css`
    display: flex;
    flex-direction: row;
    align-items: stretch;
    gap: 10px;
    flex: 1;
`;

const rowThumbnail = css`
    width: 200px;
`;

export const MealSelectWrap = styled.div`
    margin: 20px 0;

    ${({ theme }) => theme.breakpoints.down('xl')} {
        margin: 15px;
    }
`;

export const DaysTab = styled.div`
    ${ScrollBarTransparent};

    overflow-x: auto;
    display: flex;
    align-items: center;
    gap: 9px;
    margin-bottom: 10px;

    ${({ theme }) => theme.breakpoints.down('xl')} {
        ${innerContent}
    }
`;

export const MealCategoryTab = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 15px;
    margin: 25px 0 40px 0;
    padding-bottom: 15px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);

    ${({ theme }) => theme.breakpoints.down('xl')} {
        ${innerContent};

        margin-bottom: 20px;
        border-bottom: 0;
    }
`;

export const MealCategoryItem = styled.div`
    display: flex;
    align-content: center;
    justify-content: center;
    gap: 15px;
    width: 90px;
    font-size: 18px;

    ${({ theme }) => theme.breakpoints.down('md')} {
        width: calc(100% / 3);
    }
`;

export const MealCategoryText = styled.div<{ active?: boolean }>`
    display: flex;
    align-items: center;
    gap: 15px;
    opacity: 0.5;
    cursor: pointer;

    ${({ active }) =>
        active &&
        css`
            opacity: 1;
        `}
`;

export const DaysButtonText = styled.div<{ active?: boolean }>`
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 109px;
    height: 50px;
    padding: 0 20px;
    border-radius: 30px;
    white-space: nowrap;
    background-color: #343a40;
    box-sizing: border-box;
    text-align: center;
    font-size: 18px;
    cursor: pointer;

    ${({ active }) =>
        active &&
        css`
            background-color: ${COLORS_DARK.accent.main};
        `}

    ${({ theme }) => theme.breakpoints.down('xl')} {
        min-width: auto;
    }

    ${({ theme }) => theme.breakpoints.down('md')} {
        height: 40px;
        padding: 0 15px;
        font-size: 15px;
    }
`;

export const MealMenuList = styled.div`
    display: flex;
    flex-wrap: wrap;
    align-items: stretch;
    gap: 20px;
    box-sizing: border-box;

    ${({ theme }) => theme.breakpoints.down('xl')} {
        ${innerContent};
    }
`;

export const MealMenuBox = styled.div<{ dinner?: boolean }>`
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 303px;
    padding: 20px;
    background-color: #343a40;
    border-radius: 10px;
    box-sizing: border-box;

    &:nth-of-type(4),
    &:nth-of-type(5) {
        .dinner {
            ${rowLayout};
        }

        .dinner-img {
            ${rowThumbnail};
        }
    }
`;

export const MealTitle = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 15px;
    font-size: 18px;
`;

export const MealLabel = styled.strong<{ category?: string }>`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 5px 10px;
    font-size: 16px;
    white-space: nowrap;
    border-radius: 10px;
    background-color: ${({ category }) =>
        category === 'korean'
            ? '#4e9f3d'
            : category === 'special'
              ? '#c07f00'
              : category === 'noodle'
                ? '#711a75'
                : category === 'ramen'
                  ? '#a80038'
                  : category === 'convenience'
                    ? '#055e68'
                    : category === 'protein'
                      ? '#270082'
                      : '#055e68'};
`;

export const MealMenu = styled.div`
    overflow: hidden;
    text-overflow: ellipsis;
    margin: 0 0 0 5px;
    white-space: nowrap;
`;

export const MealItem = styled.div<{ eulji?: boolean }>`
    display: flex;
    flex-direction: column;

    ${({ theme }) => theme.breakpoints.down('xl')} {
        ${rowLayout}
    }

    ${({ eulji }) =>
        eulji &&
        css`
            flex-direction: row;
            gap: 10px;

            &.lunch {
                flex-direction: column;

                @media (max-width: 768px) {
                    flex-direction: row;
                }
            }
        `}
`;

export const MealThumbnail = styled.div`
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    padding: 10px 20px;
    border-radius: 10px;
    background-color: rgba(255, 255, 255, 0.25);
    box-sizing: border-box;

    &.dinner-img {
        height: 160px;

        ${({ theme }) => theme.breakpoints.down('md')} {
            width: 100px !important;
        }

        img {
            height: 100%;
        }
    }

    img {
        height: 80%;
        object-fit: cover;
    }

    ${({ theme }) => theme.breakpoints.down('xl')} {
        width: 150px !important;
        height: auto !important;
        padding: 10px;
    }

    ${({ theme }) => theme.breakpoints.down('md')} {
        width: 100px !important;

        img {
            height: auto;
        }
    }
`;

export const MealDetail = styled.div<{ eulji?: boolean }>`
    margin-top: 10px;
    word-break: keep-all;
    overflow-wrap: break-word;

    ${({ theme }) => theme.breakpoints.down('xl')} {
        margin-top: 0;
        word-break: break-all;
    }

    ${({ theme }) => theme.breakpoints.down('md')} {
        word-break: keep-all;
    }

    ${({ eulji }) =>
        eulji &&
        css`
            margin-top: 0;
        `}
`;

export const MealEmpty = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    min-height: 300px;
    text-align: center;

    p {
        margin: 0;
        line-height: 2;
    }
`;
