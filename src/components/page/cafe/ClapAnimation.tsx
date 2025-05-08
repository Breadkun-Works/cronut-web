import React, { useState, useEffect } from 'react';
import { Box, keyframes } from '@mui/material';

// 애니메이션 키프레임
const floatAnimation = keyframes`
  0% {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
  100% {
    transform: translateY(-100px) scale(0.5);
    opacity: 0;
  }
`;

const randomEmojis = ['🥳', '👏', '🎉', '🙌', '🎊'];

const ClapAnimation = () => {
    const [randomEmoji, setRandomEmoji] = useState('');

    useEffect(() => {
        setRandomEmoji(randomEmojis[Math.floor(Math.random() * randomEmojis.length)]);
    }, []);

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: `${floatAnimation} 2s ease-out forwards`,
                fontSize: '2rem'
            }}
        >
            {randomEmoji}
        </Box>
    );
};

export default ClapAnimation;
