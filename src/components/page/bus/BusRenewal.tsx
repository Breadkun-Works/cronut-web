'use client';

import { BusImgBox, BusList, BusMenuItem, BusWrap } from '@/styles/components/page/bus/BusRenewal.styles';
import Image from 'next/image';

const BusRenewal = () => {
    return (
        <BusWrap>
            <BusMenuItem>
                <BusImgBox>
                    <Image src={'/images/bus/leave.png'} alt={'출근 이미지'} width={350} height={350} />
                </BusImgBox>
                <p>출근</p>
                <BusList>
                    <li>
                        <a href={'#'}>서울</a>
                    </li>
                    <li>
                        <a href={'#'}>춘천</a>
                    </li>
                </BusList>
            </BusMenuItem>

            <BusMenuItem>
                <BusImgBox>
                    <Image src={'/images/bus/go.png'} alt={'퇴근 이미지'} width={350} height={350} />
                </BusImgBox>
                <p>퇴근</p>
                <BusList>
                    <li>
                        <a href={'#'}>서울</a>
                    </li>
                    <li>
                        <a href={'#'}>춘천</a>
                    </li>
                </BusList>
            </BusMenuItem>

            <BusMenuItem>
                <BusImgBox>
                    <Image src={'/images/bus/leave.png'} alt={'야근 이미지'} width={350} height={350} />
                </BusImgBox>
                <p>야근</p>
            </BusMenuItem>
        </BusWrap>
    );
};

export default BusRenewal;
