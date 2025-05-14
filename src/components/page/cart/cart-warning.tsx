import { CartWarningText, CartWarningWrapper } from '@/styles/cart/cart.styles';
import { useEffect, useRef, useState } from 'react';

interface ICartWarningProps {
    isCartInactive: boolean;
    isMobile: boolean;
}
export const CartWaring = ({ isCartInactive, isMobile }: ICartWarningProps) => {
    const textRef = useRef<HTMLDivElement>(null);
    const [isOverflowed, setIsOverflowed] = useState(false);

    const checkOverflow = () => {
        setIsOverflowed(window.innerWidth < 769); // 769px 이하일 때 슬라이딩 활성화
    };

    useEffect(() => {
        checkOverflow();
        window.addEventListener('resize', checkOverflow);
        return () => window.removeEventListener('resize', checkOverflow);
    }, []);

    if (!isCartInactive) return;

    return (
        <CartWarningWrapper ref={textRef}>
            <CartWarningText isOverflowed={isOverflowed}>
                ⚠️ 장바구니의 주문 가능 시간이 만료되었습니다. 메뉴 담기 및 송금이 불가합니다. ⚠️
                {isOverflowed && (
                    <>
                        {Array.from({ length: 5 }).map((_, index) => (
                            <>
                                &nbsp;&nbsp;&nbsp; ⚠️ 장바구니의 주문 가능 시간이 만료되었습니다. 메뉴 담기 및 송금이
                                불가합니다. ⚠️
                            </>
                        ))}
                    </>
                )}
            </CartWarningText>
        </CartWarningWrapper>
    );
};
