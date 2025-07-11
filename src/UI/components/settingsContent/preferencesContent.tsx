import React from 'react';
import { useTheme } from '../../../hooks/useTheme';
import { Moon, Sun } from 'lucide-react';

export const PreferencesContent: React.FC = () => {
    const { isDarkMode, toggleTheme } = useTheme();

    return (
        <div className="flex flex-col gap-6">
            <h2 className="text-xl font-semibold">Préférences</h2>
            
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h3 className="font-medium">Mode sombre</h3>
                        <p className="text-sm text-gray-500">
                            Ajustez l'apparence de l'application pour réduire la luminosité
                        </p>
                    </div>
                    <button
                        onClick={toggleTheme}
                        className={`
                            p-2 rounded-lg transition-colors duration-200
                            ${isDarkMode 
                                ? 'bg-gray-800 text-white hover:bg-gray-700' 
                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}
                        `}
                    >
                        {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>
                </div>
            </div>
        </div>
    );
};
