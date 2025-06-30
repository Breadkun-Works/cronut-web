import localFont from 'next/font/local';

export const nanumFonts = localFont({
    src: [{ path: './NanumSquareRoundOTFEB.otf', weight: '800', style: 'normal' }],
    variable: '--font-nanum'
});
