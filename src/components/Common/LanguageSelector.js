import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useAuth } from '../../context/AuthContext';

const LanguageSelector = () => {
  const { t, i18n } = useTranslation();
  const { currentUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  
  // Available languages
  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
  ];
  
  // Get current language
  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];
  
  // Change language handler
  const changeLanguage = async (languageCode) => {
    try {
      // Change i18n language
      await i18n.changeLanguage(languageCode);
      
      // Close dropdown
      setIsOpen(false);
      
      // Update user preferences if logged in
      if (currentUser) {
        await updateDoc(doc(db, 'users', currentUser.uid), {
          'preferences.language': languageCode
        });
      }
    } catch (error) {
      console.error("Error changing language:", error);
    }
  };
  
  // Toggle dropdown
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  
  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center px-3 py-2 rounded hover:bg-gray-100 focus:outline-none"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <span className="mr-1">{currentLanguage.flag}</span>
        <span className="hidden md:inline">{currentLanguage.name}</span>
        <svg
          className="w-4 h-4 ml-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d={isOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
          ></path>
        </svg>
      </button>
      
      {isOpen && (
        <div
          className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-lg z-20"
          role="menu"
          aria-orientation="vertical"
        >
          {languages.map((language) => (
            <button
              key={language.code}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center ${
                language.code === currentLanguage.code ? 'bg-gray-100' : ''
              }`}
              onClick={() => changeLanguage(language.code)}
              role="menuitem"
            >
              <span className="mr-2">{language.flag}</span>
              <span>{language.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
