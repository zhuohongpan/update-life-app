import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white border-t mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link to="/" className="text-lg font-bold text-blue-600">
              Update Life
            </Link>
            <p className="text-sm text-gray-600 mt-1">
              {t('footer.copyright', { year: currentYear })}
            </p>
          </div>
          
          <div className="flex space-x-4">
            <Link to="/terms" className="text-sm text-gray-600 hover:text-gray-900">
              {t('footer.terms')}
            </Link>
            <Link to="/privacy" className="text-sm text-gray-600 hover:text-gray-900">
              {t('footer.privacy')}
            </Link>
            <Link to="/contact" className="text-sm text-gray-600 hover:text-gray-900">
              {t('footer.contact')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
