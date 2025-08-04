import { CommonModal } from '@/components/page/cafe/modal/common-modal';
import { Stack } from '@/components/ui/Stack/Stack';
import Image from 'next/image';
import {
    BreakTimeWrap,
    CafeModalTitle,
    OpeningWrap,
    TimeWrap
} from '@/styles/components/page/cafe/modal/cafe-opening-modal.styles';
import { Company } from '@/types/common';
import { useAtom } from 'jotai/index';
import { companyAtom } from '@/atom/common-atom';

type CafeOpeningModalProps = {
    open: boolean;
    onClose: () => void;
};

export const CafeOpeningModal = ({ open, onClose }: CafeOpeningModalProps) => {
    const [company] = useAtom(companyAtom);

    return (
        <>
            <CommonModal
                open={open}
                onClose={onClose}
                title={
                    <>
                        {company === Company.KANGCHON && (
                            <CafeModalTitle>
                                <Image src={'/images/cafe/clock.svg'} alt={'시계 아이콘'} width={25} height={25} />
                                운영시간
                            </CafeModalTitle>
                        )}
                        {company === Company.EULJI && (
                            <>
                                <CafeModalTitle>
                                    <Stack align={'center'} gap={5}>
                                        <Image
                                            src={'/images/cafe/clock.svg'}
                                            alt={'시계 아이콘'}
                                            width={25}
                                            height={25}
                                        />
                                        운영시간 :
                                    </Stack>
                                    08:20 ~ 17:00
                                </CafeModalTitle>
                            </>
                        )}
                    </>
                }
                content={
                    <>
                        <OpeningWrap EULJI={company === Company.EULJI}>
                            {company === Company.KANGCHON && (
                                <>
                                    <TimeWrap>
                                        <div>
                                            <h4>오전</h4>
                                            <ul>
                                                <li>08:20 ~ 08:35</li>
                                                <li>10:10 ~ 11:20</li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h4>오후</h4>
                                            <ul>
                                                <li>12:00 ~ 12:40</li>
                                                <li>14:00 ~ 17:30</li>
                                            </ul>
                                        </div>
                                    </TimeWrap>
                                </>
                            )}
                            {company === Company.EULJI && (
                                <Stack direction={'column'} align={'center'} justify={'center'}>
                                    <BreakTimeWrap>
                                        <h4>Break Time</h4>
                                        <ul>
                                            <li>08:50 ~ 09:30</li>
                                            <li>12:50 ~ 13:30</li>
                                        </ul>
                                        <p>커피 16:30까지 주문 가능</p>
                                        <p>커피 외 음료 운영시간 내 주문 가능</p>
                                    </BreakTimeWrap>
                                </Stack>
                            )}
                        </OpeningWrap>
                    </>
                }
                width={company === Company.EULJI ? 500 : 700}
            />
        </>
    );
};

export default CafeOpeningModal;
