import React from 'react';
import { useTheme } from '../../../context/ThemeContext'; // Assurez-vous d'importer useTheme correctement

export const PreferencesContent: React.FC = () => {
    const { isDarkMode, toggleTheme } = useTheme();
    return (
        <div className="flex flex-col gap-4">
            <div className="space-y-4">
                <label htmlFor="theme-toggle">Mode Sombre :</label>
                <input
                    id="theme-toggle"
                    type="checkbox"
                    checked={isDarkMode}
                    onChange={toggleTheme}
                    className="border rounded px-4 py-2"
                />
            </div>
            {/* Vous pouvez ajouter d'autres préférences ici */}
        </div>
    );
};
