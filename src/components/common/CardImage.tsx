import { CardMedia } from '@mui/material';
import { ItemImage } from '@/styles/cart/cart.styles';

type CardImageProps = {
    imageUrl: string;
    alt: string;
    blur?: boolean;
    width?: number | string;
    height?: number | string;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
};

export const CardImage = ({ imageUrl, alt, blur = false, width, height, size }: CardImageProps) => {
    return (
        <ItemImage width={width} height={height} blur={blur} size={size}>
            <CardMedia
                component="img"
                image={imageUrl}
                alt={alt}
                sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                }}
            />
        </ItemImage>
    );
};
