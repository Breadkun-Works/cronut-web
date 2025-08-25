'use client';
import React, { useEffect, useRef, useState } from 'react';
import { dayNumToSpell, getWeekDates } from '@/utils/dates';
import { fetchMealData } from '@/apis/meal/meal-api';
import { Company, mealMenu } from '@/types/common';
import { getMealImagePath } from '@/utils/image-return';
import { CompanySelect } from '@/components/CompanySelect';
import { useDynamicTitle } from '@/utils/hook';
import { useAtom } from 'jotai';
import { companyAtom, useModal } from '@/atom/common-atom';
import {
    DaysButtonText,
    DaysTab,
    MealCategoryItem,
    MealCategoryTab,
    MealCategoryText,
    MealDetail,
    MealEmpty,
    MealItem,
    MealLabel,
    MealMenu,
    MealMenuBox,
    MealMenuList,
    MealSelectWrap,
    MealThumbnail,
    MealTitle
} from '@/styles/components/page/meal/meal.styles';
import { EllipsisTooltip } from '@/components/common/EllipsisTooltip';
import { menuNameEdit } from '@/utils/page/meal/util';
import { categoryMap } from '@/types/meal';
import { CommonModal } from '@/components/page/cafe/modal/common-modal';
import { Typography } from '@mui/material';

const Meal = () => {
    useDynamicTitle('식단');
    const mealErrorOpen = useModal('meal-error');
    const getWeekNumber = (date: Date): number => {
        // 월요일이 0이 되도록 요일을 조정합니다.
        const dayOfWeek = (date.getDay() + 6) % 7;
        // 현재 주의 월요일을 계산합니다.
        const monday = new Date(date);
        monday.setDate(date.getDate() - dayOfWeek);

        // 해당 주의 일요일을 계산합니다.
        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);
        // 현재 날짜가 속한 주차를 계산합니다.
        const oneJan = new Date(date.getFullYear(), 0, 1);
        const daysUntilMonday = (monday.getTime() - oneJan.getTime()) / (24 * 60 * 60 * 1000);
        return Math.ceil((daysUntilMonday + oneJan.getDay() + 1) / 7);
    };

    const [company] = useAtom(companyAtom);

    const [days, setDays] = useState<string[]>();
    const today = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1; // 오늘 요일 표시 => 월:0 ~ 일:6
    const [selectedDay, setSelectedDay] = useState(0); // 기본값 월(0)
    const [weekNumber] = useState(getWeekNumber(new Date())); // 현재 주차 설정.
    const selectedDayRef = useRef<HTMLButtonElement>(null);
    const [selectedMealCategories, setSelectedMealCategories] = useState('조식'); // 기본값 조식
    const nowHours = new Date().getHours(); // 현재시간
    const [mealData, setMealData] = useState<Record<string, any>>({});

    // meal categories api binding을 위해 변환하는 함수
    const mealCategoriesEdit = (value: string): string => {
        switch (value) {
            case '조식':
                return '아침';
            case '중식':
                return '점심';
            case '석식':
                return '저녁';
            default:
                return '아침';
        }
    };

    // 페이지 최상단으로 스크롤링
    useEffect(() => {
        window.scrollTo(0, 0);
        return () => {
            window.scrollTo(0, 0);
        };
    }, []);

    // 오늘을 선택하는 effect
    useEffect(() => {
        if (company === Company.KANGCHON) {
            setSelectedDay(today);
        } else {
            // 을지 주말 => 월요일 디폴트
            today < 5 ? setSelectedDay(today) : setSelectedDay(0);
        }
    }, [company, today]);

    // 시간에 따라 조,중,석식 선택하는 effect
    useEffect(() => {
        if (company === Company.KANGCHON) {
            if (nowHours < 9) {
                setSelectedMealCategories('조식');
            } else if (nowHours < 13) {
                setSelectedMealCategories('중식');
            } else {
                setSelectedMealCategories('석식');
            }
        } else {
            if (today < 5) {
                if (nowHours < 9) {
                    setSelectedMealCategories('조식');
                } else if (nowHours < 13) {
                    setSelectedMealCategories('중식');
                } else {
                    setSelectedMealCategories('석식');
                }
            } else {
                // 을지 주말 기본값 조식
                setSelectedMealCategories('조식');
            }
        }
    }, [company, today, nowHours]);

    useEffect(() => {
        // 오늘을 포함한 주차의 월요일~일요일까지의 날짜 데이터 배열리턴 함수
        const dates = getWeekDates(); // 강촌 주7일, 을지 주5일(주말X)
        setDays(dates);
    }, []);

    // selectedDay 자동 중앙 스크롤
    useEffect(() => {
        if (selectedDayRef.current) {
            const container = selectedDayRef.current.parentElement; // days
            if (container) {
                const { offsetLeft, clientWidth } = selectedDayRef.current;
                const containerWidth = container.clientWidth;
                const scrollOffset = offsetLeft - (containerWidth - clientWidth) / 2;
                const adjustedScrollOffset = scrollOffset;
                container.scrollTo({
                    left: adjustedScrollOffset,
                    behavior: 'smooth'
                });
            }
        }
    }, [company, selectedDay]);

    // 식단 api
    useEffect(() => {
        fetchMealData(company, weekNumber, () => mealErrorOpen.openModal()).then(res => {
            const { updated, ...rest } = res;
            setMealData(rest);
        });
    }, [company, weekNumber]);

    const currentMenus = mealMenu(company).menu;

    const isEmpty = currentMenus.every(menu => {
        const menuList =
            mealData?.[dayNumToSpell(selectedDay)]?.[mealCategoriesEdit(selectedMealCategories)]?.[menu.value]?.[
                '메뉴'
            ];
        return !menuList || menuList.length === 0;
    });

    return (
        <>
            <MealSelectWrap>
                <CompanySelect entry={'meal'} />
            </MealSelectWrap>

            <DaysTab className="meal-days">
                {company === Company.KANGCHON &&
                    days?.map((day, index) => (
                        <button
                            key={index}
                            ref={index === selectedDay ? selectedDayRef : undefined}
                            onClick={() => {
                                setSelectedMealCategories('조식');
                                setSelectedDay(index);
                            }}
                        >
                            <DaysButtonText active={index === selectedDay}>
                                {index === today ? '오늘의 메뉴' : day}
                            </DaysButtonText>
                        </button>
                    ))}

                {company === Company.EULJI &&
                    days?.map((day, index) =>
                        index < 5 ? (
                            <button
                                key={index}
                                ref={index === selectedDay ? selectedDayRef : undefined}
                                onClick={() => {
                                    setSelectedMealCategories('조식');
                                    setSelectedDay(index);
                                }}
                            >
                                <DaysButtonText active={index === selectedDay}>
                                    {index === today ? '오늘의 메뉴' : day}
                                </DaysButtonText>
                            </button>
                        ) : undefined
                    )}
            </DaysTab>

            {!isEmpty && (
                <MealCategoryTab>
                    {mealMenu(company).mealTime.map((v, index) => (
                        <MealCategoryItem onClick={() => setSelectedMealCategories(v)} key={index}>
                            <MealCategoryText active={selectedMealCategories === v}>{v}</MealCategoryText>
                        </MealCategoryItem>
                    ))}
                </MealCategoryTab>
            )}

            <MealMenuList>
                {isEmpty ? (
                    <MealEmpty>
                        <div>
                            <img src={'/images/meal/empty.png'} alt={'Nutrition plan icon'} />
                        </div>
                        <p>
                            오늘은 메뉴가 비어있네요!
                            <br /> 잠시만 기다려 주세요🍽️
                        </p>
                    </MealEmpty>
                ) : (
                    <>
                        {mealMenu(company).menu.map((menu, index) => {
                            return (
                                mealData?.[dayNumToSpell(selectedDay)]?.[mealCategoriesEdit(selectedMealCategories)]?.[
                                    menu.value
                                ]?.메뉴 && (
                                    <MealMenuBox key={index} dinner={selectedMealCategories === '석식'}>
                                        <MealTitle>
                                            <MealLabel category={categoryMap[menu.label] || ''}>{menu.label}</MealLabel>
                                            <EllipsisTooltip
                                                entry={'meal'}
                                                title={menuNameEdit(
                                                    mealData[dayNumToSpell(selectedDay)][
                                                        mealCategoriesEdit(selectedMealCategories)
                                                    ][menu.value]['메뉴']
                                                )}
                                            >
                                                <MealMenu className="meal-menu__name">
                                                    {menuNameEdit(
                                                        mealData[dayNumToSpell(selectedDay)][
                                                            mealCategoriesEdit(selectedMealCategories)
                                                        ][menu.value]['메뉴']
                                                    )}
                                                </MealMenu>
                                            </EllipsisTooltip>
                                        </MealTitle>
                                        <MealItem
                                            className={
                                                selectedMealCategories === '중식'
                                                    ? 'lunch'
                                                    : selectedMealCategories === '석식'
                                                      ? 'dinner'
                                                      : ''
                                            }
                                            eulji={company === Company.EULJI}
                                        >
                                            <MealThumbnail className={menu.label === '한식' ? 'korean-img' : ''}>
                                                <img
                                                    src={getMealImagePath(menu.value)}
                                                    alt={`${menu.license} icon from Flaticon`}
                                                />
                                            </MealThumbnail>
                                            <MealDetail eulji={company === Company.EULJI}>
                                                {mealData[dayNumToSpell(selectedDay)][
                                                    mealCategoriesEdit(selectedMealCategories)
                                                ][menu.value]['메뉴'].join(', ')}
                                            </MealDetail>
                                        </MealItem>
                                    </MealMenuBox>
                                )
                            );
                        })}
                    </>
                )}
            </MealMenuList>
            <CommonModal
                open={mealErrorOpen.modal.isOpen}
                onClose={() => mealErrorOpen.closeModal()}
                content={
                    <Typography
                        sx={{
                            whiteSpace: 'pre-line',
                            wordBreak: 'keep-all',
                            overflowWrap: 'break-word'
                        }}
                    >
                        {`죄송합니다.\n현재 식단 정보를 가져올 수 없습니다.\n문제가 지속되면 관리자에게 문의해 주시기 바랍니다.`}
                    </Typography>
                }
            />
        </>
    );
};

export default Meal;
