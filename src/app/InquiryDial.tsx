import React from 'react';
import { SpeedDial, SpeedDialAction, SpeedDialIcon, Box } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useModal } from '@/atom/common-atom';
import { InquiryModal } from '@/components/InquiryModal';
import { Headset, EyeOff } from 'lucide-react';
import { useResponsive } from '@/utils/hook';
const InquiryDial = () => {
    const { overTablet } = useResponsive();
    const { modal, openModal, closeModal } = useModal('inquiryModal');

    return (
        <Box>
            <SpeedDial
                direction="up"
                ariaLabel={'문의하기'}
                icon={<Headset color="#ecc68a" />}
                FabProps={{
                    sx: {
                        backgroundColor: '#db661b',
                        '&:hover': {
                            backgroundColor: '#f97316'
                        }
                    }
                }}
                hidden={modal.isOpen || !overTablet}
                sx={{
                    color: 'white',
                    position: 'fixed',
                    bottom: 20,
                    right: 30
                }}
                onClick={openModal}
            >
                {/* <SpeedDialAction
                    icon={<Headset color="#ecc68a" />}
                    tooltipTitle="문의하기"
                    tooltipOpen
                    onClick={() => {
                        openModal();
                    }}
                />
                <SpeedDialAction
                    icon={<EyeOff color="#ecc68a" />}
                    tooltipTitle="숨기기"
                    tooltipOpen
                    onClick={() => {
                        closeModal();
                    }}
                /> */}
            </SpeedDial>
            <InquiryModal isOpen={modal.isOpen} onClose={closeModal} />
        </Box>
    );
};

export default InquiryDial;
