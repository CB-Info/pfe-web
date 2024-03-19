import React, { useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';

const SearchBar: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        // Implémentez la logique de recherche ici
        console.log(searchTerm);
    };

    return (
        <form onSubmit={handleSearch} className="form-control">
            <div className="relative h-8">
                <input
                    type="text"
                    placeholder="Recherche..."
                    className="w-full pr-40 h-8 bg-gray-200 input input-lg text-black"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button
                    type="submit"
                    className="absolute top-0 right-0 rounded-l-none btn btn-sm"
                >
                    <SearchIcon className="h-5 w-5 text-gray-500" />
                </button>
            </div>
        </form>
    );
};

export default SearchBar;
