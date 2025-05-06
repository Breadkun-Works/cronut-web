import { Box, keyframes } from '@mui/material';

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

const ClapAnimation = () => {
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
            👏
        </Box>
    );
};

export default ClapAnimation;
