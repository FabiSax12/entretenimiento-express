import { type FC, useState, type KeyboardEvent, type ChangeEvent } from 'react'
import { Input } from '@heroui/input'
import { Button } from '@heroui/button'

interface SearchBarProps {
    onSearch: (query: string) => void;
    placeholder?: string;
    live?: boolean;
}

export const SearchBar: FC<SearchBarProps> = ({
    onSearch,
    placeholder = 'Buscar Servicios...',
    live = true
}) => {
    const [query, setQuery] = useState('');

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setQuery(value);

        if (live) {
            onSearch(value);
            //onSearch(value.trim());
        }
    }

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && query.trim() !== '') {
            event.preventDefault();
            onSearch(query.trim());
        }
    };

    return (
        <div className="flex items-center gap-2 w-full">
            <Input
                label="Buscar"
                placeholder={placeholder}
                value={query}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                className="flex-grow"
            />
            <Button
                variant = "solid"
                color = "primary"
                onPress = {() => onSearch(query)}
            >
                Buscar
            </Button>
        </div>
    );
}