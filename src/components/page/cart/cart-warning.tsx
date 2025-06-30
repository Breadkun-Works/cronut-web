import { CartWarningText, CartWarningWrapper } from '@/styles/cart/cart.styles';
import { useEffect, useRef, useState } from 'react';
import { useResponsiveConfig } from '@/utils/hook';

interface ICartWarningProps {
    isCartInactive: boolean;
}

export const CartWaring = ({ isCartInactive }: ICartWarningProps) => {
    const textRef = useRef<HTMLDivElement>(null);
    const [isOverflowed, setIsOverflowed] = useState(false);
    const { fontSize } = useResponsiveConfig('cart');

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
        <CartWarningWrapper ref={textRef} isOverflowed={isOverflowed}>
            <CartWarningText isOverflowed={isOverflowed} style={{ fontSize }}>
                {isOverflowed ? (
                    <div className="marquee">
                        <div className="marquee-content">
                            ⚠️ 장바구니의 주문 가능 시간이 만료되었습니다. 메뉴 담기 및 송금이 불가합니다.
                            ⚠️&nbsp;&nbsp;&nbsp; ⚠️ 장바구니의 주문 가능 시간이 만료되었습니다. 메뉴 담기 및 송금이
                            불가합니다. ⚠️&nbsp;&nbsp;&nbsp; ⚠️ 장바구니의 주문 가능 시간이 만료되었습니다. 메뉴 담기 및
                            송금이 불가합니다. ⚠️&nbsp;&nbsp;&nbsp;
                        </div>
                        {/* 슬라이드 자연스럽게 연결 */}
                        <div className="marquee-content">
                            ⚠️ 장바구니의 주문 가능 시간이 만료되었습니다. 메뉴 담기 및 송금이 불가합니다.
                            ⚠️&nbsp;&nbsp;&nbsp; ⚠️ 장바구니의 주문 가능 시간이 만료되었습니다. 메뉴 담기 및 송금이
                            불가합니다. ⚠️&nbsp;&nbsp;&nbsp; ⚠️ 장바구니의 주문 가능 시간이 만료되었습니다. 메뉴 담기 및
                            송금이 불가합니다. ⚠️&nbsp;&nbsp;&nbsp;
                        </div>
                    </div>
                ) : (
                    <>⚠️ 장바구니의 주문 가능 시간이 만료되었습니다. 메뉴 담기 및 송금이 불가합니다. ⚠️</>
                )}
            </CartWarningText>
        </CartWarningWrapper>
    );
};
