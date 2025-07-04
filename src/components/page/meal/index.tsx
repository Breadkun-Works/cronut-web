'use client';
import React, { useEffect, useRef, useState } from 'react';
import styles from '../../../styles/Meal.module.scss';
import classNames from 'classnames/bind';
import { dayNumToSpell, getWeekDates } from '@/utils/dates';
import { fetchMealData } from '@/apis/meal/meal-api';
import { Company, mealMenu } from '@/types/common';
import { getMealImagePath } from '@/utils/image-return';
import { CompanySelect } from '@/components/CompanySelect';
import { Box } from '@mui/material';
import { useDynamicTitle, useResponsive } from '@/utils/hook';
import { useAtom } from 'jotai';
import { companyAtom } from '@/atom/common-atom';

const ms = classNames.bind(styles);

const Meal = () => {
    useDynamicTitle('식단');
    const { isMobile } = useResponsive();
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
        const weekNumber = Math.ceil((daysUntilMonday + oneJan.getDay() + 1) / 7);
        return weekNumber;
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

    // menu name 자르는 함수
    const menuNameEdit = (value: string[]): string => {
        if (value[0] === '★특별한 한상★') {
            return value[1];
        } else {
            // "+", "(", " ", "&", "*" 5개로 자르는 정규식
            return value[0].split(/[+ (&*]/)[0];
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
        fetchMealData(company, weekNumber).then(res => {
            const { updated, ...rest } = res;
            setMealData(rest);
        });
    }, [company, weekNumber]);

    return (
        <div className={ms('meal')}>
            <Box margin={isMobile ? '10px 20px' : '20px 30px'}>
                <CompanySelect entry={'meal'} />
            </Box>

            <div className={ms('days')}>
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
                            <div className={index === selectedDay ? ms('day', 'selected-day') : ms('day')}>
                                {index === today ? '오늘의 메뉴' : day}
                            </div>
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
                                <div className={index === selectedDay ? ms('day', 'selected-day') : ms('day')}>
                                    {index === today ? '오늘의 메뉴' : day}
                                </div>
                            </button>
                        ) : undefined
                    )}
            </div>
            <div className={ms('meal__body')}>
                <div className={ms('meal-categories')}>
                    {mealMenu(company).mealTime.map((v, index) => (
                        <div
                            className={
                                selectedMealCategories === v
                                    ? ms('meal-category', 'selected-meal-category')
                                    : ms('meal-category')
                            }
                            onClick={() => setSelectedMealCategories(v)}
                            key={index}
                        >
                            {v}
                        </div>
                    ))}
                </div>
                <div className={ms('meal-menus')}>
                    {mealMenu(company).menu.map((menu, index) => {
                        return (
                            mealData?.[dayNumToSpell(selectedDay)]?.[mealCategoriesEdit(selectedMealCategories)]?.[
                                menu.value
                            ]?.메뉴 && (
                                <div className={ms('meal-menu')} key={index}>
                                    <div className={ms('meal-menu__title--wrapper')}>
                                        <div className={ms('meal-menu__title', `${menu.value}`)}>{menu.label}</div>
                                        <div className={ms('meal-menu__name')}>
                                            {menuNameEdit(
                                                mealData[dayNumToSpell(selectedDay)][
                                                    mealCategoriesEdit(selectedMealCategories)
                                                ][menu.value]['메뉴']
                                            )}
                                        </div>
                                    </div>
                                    <div className={ms('meal-menu__body')}>
                                        <img
                                            className={ms('meal-menu__image')}
                                            src={getMealImagePath(menu.value)}
                                            alt={'menu-img'}
                                        />
                                        <div className={ms('meal-menu__detaile')}>
                                            {mealData[dayNumToSpell(selectedDay)][
                                                mealCategoriesEdit(selectedMealCategories)
                                            ][menu.value]['메뉴'].join(',')}
                                        </div>
                                    </div>
                                </div>
                            )
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Meal;
