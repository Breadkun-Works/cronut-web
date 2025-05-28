'use client';
import React, { useRef, useState, useEffect, useLayoutEffect, ChangeEvent, useCallback } from 'react';
import Image from 'next/image';
import { RefreshCw, Copy } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { getCookie, setCookie } from '@/utils/cookie';
import styled from '@emotion/styled';
import { COLORS_DARK } from '@/data';
import { Box } from '@mui/material';

const PLACEHOLDER = '이름을 입력해주세요.';

const InputWrapper = styled.div`
    position: relative;
    width: 100%;
`;

const Input = styled.input`
    width: 100%;
    height: 40px;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 0 10px;
    box-sizing: border-box;
    font-size: 16px;
`;

const UserNameCount = styled.div`
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
    font-size: 14px;
    color: #555;
`;

const ReadOnlyInput = styled.input`
    width: 100%;
    border: none;
    border-radius: 5px;
    box-sizing: border-box;
    background-color: #2c2f31;
    text-decoration: underline;
    color: #ccc;
`;

const copyLink = (url: string) => {
    if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent) && navigator.share) {
        navigator
            .share({
                title: document.title,
                url: url
            })
            .then(() => alert('링크가 공유되었습니다!'))
            .catch(err => console.error('링크 공유 실패', err));
    } else {
        if (typeof navigator.clipboard === 'undefined') {
            const textArea = document.createElement('textarea');
            textArea.value = url;
            textArea.style.position = 'fixed';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();

            try {
                const successful = document.execCommand('copy');
                if (successful) {
                    alert('링크가 복사되었습니다.');
                }
            } catch (err) {
                console.error('링크 복사 실패', err);
            }

            document.body.removeChild(textArea);
        } else {
            navigator.clipboard
                .writeText(url)
                .then(() => alert('링크가 복사되었습니다.'))
                .catch(err => console.error('링크 복사 실패', err));
        }
    }
};

const ProfileCard = ({ image, style }: { image: string; style?: React.CSSProperties }) => {
    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#f0f0f0',
                borderRadius: '50%',
                width: '300px',
                height: '300px',
                objectFit: 'cover',
                ...style
            }}
        >
            <Image width={250} height={250} alt="profile" src={image} style={{ width: '80%', height: '80%' }} />
        </div>
    );
};

const BKRInput = ({
    value,
    width,
    height,
    style,
    endDecoration
}: {
    value: string;
    width?: string;
    height?: string;
    style?: React.CSSProperties;
    endDecoration?: React.ReactNode;
}) => {
    const decorationRef = useRef<HTMLDivElement>(null);
    const [decorationWidth, setDecorationWidth] = useState<number>(40);
    const [decorationHeight, setDecorationHeight] = useState<number>(0);

    useLayoutEffect(() => {
        if (decorationRef.current) {
            setDecorationWidth(decorationRef.current.offsetWidth);
            setDecorationHeight(decorationRef.current.offsetHeight);
        }
    }, [decorationRef]);

    useEffect(() => {
        const handleResize = () => {
            if (decorationRef.current) {
                setDecorationWidth(decorationRef.current.offsetWidth);
                setDecorationHeight(decorationRef.current.offsetHeight);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const paddingValue = style?.padding ? parseInt(style.padding.toString(), 10) : 0;
    const calculatedHeight = Math.max(parseInt(height || '20', 10), decorationHeight) + paddingValue;

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                maxWidth: style?.maxWidth,
                position: 'relative'
            }}
        >
            <div style={{ position: 'relative', width: '100%' }}>
                <ReadOnlyInput
                    type="text"
                    readOnly
                    value={value}
                    onClick={(e: React.MouseEvent<HTMLInputElement>) => e.currentTarget.select()}
                    style={{
                        ...style,
                        paddingRight: decorationWidth ? decorationWidth + 20 : '10px',
                        width: width,
                        height: calculatedHeight
                    }}
                />
                <div
                    ref={decorationRef}
                    style={{
                        position: 'absolute',
                        right: '10px',
                        top: calculatedHeight / 2,
                        transform: 'translateY(-50%)',
                        display: 'flex',
                        alignItems: 'center'
                    }}
                >
                    {endDecoration}
                </div>
            </div>
        </div>
    );
};
const StyledButton = styled.button`
    background-color: ${COLORS_DARK.accent.main};
    border: none;
    cursor: pointer;
    border-radius: 50%;
    padding: 7px;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;

    &:active {
        transform: scale(1.3);
    }
`;

const BRKButton = styled.button`
    width: 100%;
    height: 40px;
    font-size: 16px;
    font-weight: bold;
    border-radius: 5px;
    border: 1px solid ${COLORS_DARK.accent.main};
    box-sizing: border-box;
    background-color: ${COLORS_DARK.accent.main};
    color: #fff;
    padding: 0 10px;
    text-align: center;
    margin: 20px 0;
`;

const OrderPage = ({ params }: { params: { id: string } }) => {
    const baseUrl = window.location.origin;
    const currentUrl = baseUrl + usePathname();
    const images = [
        `${process.env.NEXT_PUBLIC_STORAGE_BASE_URL}images/cafe/cart/character/m1.webp`,
        `${process.env.NEXT_PUBLIC_STORAGE_BASE_URL}images/cafe/cart/character/m2.webp`,
        `${process.env.NEXT_PUBLIC_STORAGE_BASE_URL}images/cafe/cart/character/m3.webp`,
        `${process.env.NEXT_PUBLIC_STORAGE_BASE_URL}images/cafe/cart/character/w1.webp`
    ];
    const router = useRouter();

    const getRandomProfileImage = () => {
        const randomImage = images[Math.floor(Math.random() * images.length)];
        return randomImage;
    };
    const setRandomProfileImage = () => {
        setRandomImage(getRandomProfileImage());
    };
    const [randomImage, setRandomImage] = useState<string>(getRandomProfileImage());
    const [userName, setUserName] = useState<string>('');
    const [userNamePlaceholder, setUserNamePlaceholder] = useState<string>(PLACEHOLDER);

    const handleOrder = useCallback(() => {
        let cookieUserInfo = getCookie('BRK-UUID');

        if (!cookieUserInfo) {
            cookieUserInfo = crypto.randomUUID();
            setCookie('BRK-UUID', cookieUserInfo);
        }

        const nameToUse = userName || userNamePlaceholder;

        if (nameToUse !== PLACEHOLDER) {
            setCookie('BRK-UserName', nameToUse);
            setCookie('BRK-UserProfile', randomImage);
            router.push(`/cafe/cart/menu/${params.id}`);
        }
    }, [params.id, router, userName, userNamePlaceholder, randomImage]);

    useEffect(() => {
        const cookieUserInfo = getCookie('BRK-UserName');
        if (cookieUserInfo) {
            setUserNamePlaceholder(cookieUserInfo.key);
        }
        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.key === 'Enter') {
                handleOrder();
            }
        };
        window.addEventListener('keyup', handleKeyUp);
        return () => window.removeEventListener('keyup', handleKeyUp);
    }, [handleOrder]);
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        if (value.length <= 30) {
            setUserName(value); // 최대 길이를 넘지 않도록 값 업데이트
        }
    };

    return (
        <Box display={'flex'} justifyContent={'center'} alignItems={'center'}>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    padding: '20px',
                    boxSizing: 'border-box',
                    maxWidth: '680px'
                }}
            >
                <BKRInput
                    value={currentUrl}
                    width="100%"
                    style={{ marginBottom: '50px', padding: '10px' }}
                    endDecoration={
                        <button
                            style={{
                                border: 'none',
                                cursor: 'pointer',
                                boxSizing: 'border-box',
                                height: '20px'
                            }}
                            onClick={() => {
                                copyLink(currentUrl);
                            }}
                        >
                            <Copy size={20} />
                        </button>
                    }
                />
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        marginBottom: '20px'
                    }}
                >
                    <ProfileCard image={randomImage} />
                    <div style={{ position: 'absolute', bottom: '0', right: '0' }}>
                        <StyledButton onClick={setRandomProfileImage}>
                            <RefreshCw size={40} style={{ color: '#fff' }} />
                        </StyledButton>
                    </div>
                </div>
                <div style={{ fontSize: '20px', margin: '20px 0' }}>주문자 이름을 입력해주세요.</div>

                {/*<Input*/}
                {/*    type="text"*/}
                {/*    placeholder={userNamePlaceholder}*/}
                {/*    value={userName}*/}
                {/*    maxLength={30}*/}
                {/*    onChange={e => setUserName(e.target.value)}*/}
                {/*/>*/}

                <InputWrapper>
                    <Input type="text" value={userName} onChange={e => handleChange(e)} maxLength={30} />
                    <UserNameCount>{`${userName.length}/${30}`}</UserNameCount>
                </InputWrapper>

                <BRKButton onClick={handleOrder}>주문하기</BRKButton>
            </div>
        </Box>
    );
};

export default OrderPage;
