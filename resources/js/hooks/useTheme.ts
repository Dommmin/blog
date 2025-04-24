import { useEffect, useState } from 'react';

export function useTheme() {
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        // Sprawdź początkowy tryb z localStorage lub ustawień systemowych
        const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const savedPreference = localStorage.getItem('darkMode');

        if (savedPreference !== null) {
            setIsDarkMode(savedPreference === 'true');
        } else {
            setIsDarkMode(darkModeMediaQuery.matches);
        }

        // Nasłuchuj na zmiany preferencji systemowych
        const handleChange = (e: MediaQueryListEvent) => {
            if (localStorage.getItem('darkMode') === null) {
                setIsDarkMode(e.matches);
            }
        };

        darkModeMediaQuery.addEventListener('change', handleChange);

        return () => {
            darkModeMediaQuery.removeEventListener('change', handleChange);
        };
    }, []);

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
        localStorage.setItem('darkMode', (!isDarkMode).toString());
    };

    return { isDarkMode, toggleDarkMode };
}
