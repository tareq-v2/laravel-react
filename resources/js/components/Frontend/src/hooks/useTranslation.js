import { useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import { translations } from '../translations';

export const useTranslation = () => {
  const { language } = useContext(LanguageContext);
  
  return (key) => {
    return translations[language][key] || key;
  };
};