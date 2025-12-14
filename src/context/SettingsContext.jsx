import { createContext, useContext, useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }) => {
    const [settings, setSettings] = useState({
        logoUrl: '',
        address: '',
        hours: ''
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Listen to real-time updates for settings
        const unsubscribe = onSnapshot(doc(db, "settings", "general"), (doc) => {
            if (doc.exists()) {
                setSettings(doc.data());
            }
            setLoading(false);
        }, (error) => {
            console.error("Error fetching settings:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <SettingsContext.Provider value={{ settings, loading }}>
            {children}
        </SettingsContext.Provider>
    );
};
