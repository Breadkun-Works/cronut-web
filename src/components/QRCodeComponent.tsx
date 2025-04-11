import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface QRProps {
    url: string;
}

const QRCodeComponent = ({ url }: QRProps) => {
    return <QRCodeSVG value={url} size={256} />;
};

export default QRCodeComponent;
