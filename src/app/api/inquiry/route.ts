import { NextRequest, NextResponse } from 'next/server';
import { InquiryFormData, InquiryType } from '@/types/contact';

const WEBHOOK_URLS = {
    'bug-report':
        'https://discord.com/api/webhooks/1368900763555987508/pba6soAPjnrfY1gzJFWRrndxZhXTKoaNSORtgWPod_EhPjSEXo5lZCVqYMaZ2aIqfC-b',
    'join-request':
        'https://discord.com/api/webhooks/1368884249188499567/RUd5dPHpSm1q1WBwClM_hJWxNeQwptCbK87HX8aSCo70iv04eEfw0XF_I-OeB3hKGSgT',
    other: 'https://discord.com/api/webhooks/1368884249188499567/RUd5dPHpSm1q1WBwClM_hJWxNeQwptCbK87HX8aSCo70iv04eEfw0XF_I-OeB3hKGSgT'
};

const createDiscordPayload = (type: InquiryType, formData: InquiryFormData, pathname: string) => {
    const commonConfig = {
        avatar_url:
            'https://ax40oxk5pwva.objectstorage.ap-chuncheon-1.oci.customer-oci.com/p/ggBWzbdG5d85FYMMw0ox2fgAuITiYbFVcSJRa2f4is_rp69RHi1H3-HSMMUpU1el/n/ax40oxk5pwva/b/BreadFiles/o/images/logo/pullmanPadding.png'
    };

    switch (type) {
        case 'bug-report':
            return {
                ...commonConfig,
                username: '🚨 장애 신고',
                embeds: [
                    {
                        title: '🚨 장애 신고 도착!',
                        color: 16733525,
                        fields: [
                            {
                                name: '📝 내용',
                                value: formData.content,
                                inline: false
                            }
                        ],
                        footer: {
                            text: `더존빵돌이(Web) > ${pathname}`
                        }
                    }
                ]
            };

        case 'join-request':
            return {
                ...commonConfig,
                username: '💕 프로젝트 합류 문의',
                embeds: [
                    {
                        title: '📨 프로젝트 합류 문의 도착!',
                        color: 3447003,
                        fields: [
                            {
                                name: '📞 연락처',
                                value: formData.contact,
                                inline: true
                            },
                            {
                                name: '✉️ 이메일',
                                value: formData.email,
                                inline: true
                            },
                            {
                                name: '📝 내용',
                                value: formData.content,
                                inline: false
                            }
                        ],
                        footer: {
                            text: `더존빵돌이(Web) > ${pathname}`
                        }
                    }
                ]
            };

        case 'other':
            return {
                ...commonConfig,
                username: '💬 기타 문의',
                embeds: [
                    {
                        title: '💬 기타 문의 도착!',
                        color: 9807270,
                        fields: [
                            {
                                name: '📝 내용',
                                value: formData.content,
                                inline: false
                            }
                        ],
                        footer: {
                            text: `더존빵돌이(Web) > ${pathname}`
                        }
                    }
                ]
            };

        default:
            throw new Error(`지원하지 않는 문의 타입: ${type}`);
    }
};

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { type, formData, pathname } = body;

        if (!type || !formData) {
            return NextResponse.json({ error: '필수 데이터가 누락되었습니다.' }, { status: 400 });
        }

        if (!WEBHOOK_URLS[type as keyof typeof WEBHOOK_URLS]) {
            return NextResponse.json({ error: '지원하지 않는 문의 타입입니다.' }, { status: 400 });
        }

        if (type === 'join-request' && !formData.email) {
            return NextResponse.json({ error: '이메일이 누락되었습니다.' }, { status: 400 });
        }

        if (!formData.content) {
            return NextResponse.json({ error: '내용이 누락되었습니다.' }, { status: 400 });
        }
        const discordPayload = createDiscordPayload(type, formData, pathname || '/');
        const response = await fetch(WEBHOOK_URLS[type as keyof typeof WEBHOOK_URLS], {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(discordPayload)
        });

        if (!response.ok) {
            throw new Error(`Discord API 에러: ${response.status}`);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('문의 전송 실패:', error);
        return NextResponse.json({ error: '문의 전송에 실패했습니다.' }, { status: 500 });
    }
}
