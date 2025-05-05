'use client';

import { InputBase, Box, Theme } from '@mui/material';
import { Search } from 'lucide-react';
import { SearchButtonStyled, SearchContainer } from '@/styles/cart/menu/cart-menu.styles';
import { ChangeEvent } from 'react';

interface Props {
    value: string;
    onChange(e: ChangeEvent<HTMLInputElement>): void;
    show: boolean;
    onSubmit(): void;
}

export const SearchBar = ({ value, onChange, show, onSubmit }: Props) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') onSubmit();
    };

    return (
        <Box
            sx={{
                display: show ? 'flex' : 'none',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
                minHeight: 68,
                justifyContent: 'center'
            }}
        >
            <SearchContainer
                sx={{
                    visibility: show ? 'visible' : 'hidden',
                    height: show ? 'auto' : 0,
                    transition: 'visibility 0.2s ease'
                }}
            >
                <InputBase
                    value={value}
                    onChange={onChange}
                    placeholder="메뉴명을 입력해주세요😋"
                    inputProps={{ 'aria-label': '메뉴 검색' }}
                    onKeyDown={handleKeyDown}
                    sx={(theme: Theme) => ({
                        color: 'inherit',
                        width: '100%',
                        '& .MuiInputBase-input': {
                            padding: '10px 8px 10px 16px',
                            paddingRight: 'calc(1em + 32px)',
                            fontSize: '0.9rem',
                            [theme.breakpoints.up('md')]: {
                                padding: '12px 8px 12px 16px',
                                fontSize: '1rem'
                            }
                        }
                    })}
                />
                <SearchButtonStyled aria-label="검색" onClick={onSubmit}>
                    <Search />
                </SearchButtonStyled>
            </SearchContainer>
        </Box>
    );
};
