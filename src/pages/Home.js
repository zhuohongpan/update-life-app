import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  
  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('home.title')}</h1>
              <p className="text-xl mb-8">{t('home.subtitle')}</p>
              
              {currentUser ? (
                <Link 
                  to="/dashboard" 
                  className="bg-white text-blue-600 hover:bg-blue-100 px-6 py-3 rounded-lg font-bold text-lg"
                >
                  {t('nav.dashboard')}
                </Link>
              ) : (
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <Link 
                    to="/register" 
                    className="bg-white text-blue-600 hover:bg-blue-100 px-6 py-3 rounded-lg font-bold text-lg text-center"
                  >
                    {t('home.getStarted')}
                  </Link>
                  <Link 
                    to="/features" 
                    className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-6 py-3 rounded-lg font-bold text-lg text-center"
                  >
                    {t('home.learnMore')}
                  </Link>
                </div>
              )}
            </div>
            
            <div className="md:w-1/2">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <img 
                  src="https://via.placeholder.com/500x300" 
                  alt="Balance visualization" 
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">{t('home.keyFeatures')}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4 mx-auto">
                <i className="fas fa-balance-scale text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-center mb-3">{t('home.featureBalance')}</h3>
              <p className="text-gray-600 text-center">{t('home.featureBalanceDesc')}</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4 mx-auto">
                <i className="fas fa-chart-line text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-center mb-3">{t('home.featureTracking')}</h3>
              <p className="text-gray-600 text-center">{t('home.featureTrackingDesc')}</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-4 mx-auto">
                <i className="fas fa-robot text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-center mb-3">{t('home.featureAI')}</h3>
              <p className="text-gray-600 text-center">{t('home.featureAIDesc')}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* How It Works Section */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">{t('home.howItWorks')}</h2>
          
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center mb-12">
              <div className="md:w-1/3 mb-6 md:mb-0 flex justify-center">
                <div className="w-24 h-24 bg-blue-500 text-white rounded-full flex items-center justify-center text-3xl font-bold">
                  1
                </div>
              </div>
              <div className="md:w-2/3">
                <h3 className="text-2xl font-bold mb-2">{t('home.step1')}</h3>
                <p className="text-gray-600">
                  Identify tasks across work, study, entertainment, and social relationships to create a balanced portfolio of activities.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-center mb-12">
              <div className="md:w-1/3 mb-6 md:mb-0 flex justify-center">
                <div className="w-24 h-24 bg-green-500 text-white rounded-full flex items-center justify-center text-3xl font-bold">
                  2
                </div>
              </div>
              <div className="md:w-2/3">
                <h3 className="text-2xl font-bold mb-2">{t('home.step2')}</h3>
                <p className="text-gray-600">
                  Use our tracking tools to monitor time spent on different life elements and record your emotional state.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-center mb-12">
              <div className="md:w-1/3 mb-6 md:mb-0 flex justify-center">
                <div className="w-24 h-24 bg-purple-500 text-white rounded-full flex items-center justify-center text-3xl font-bold">
                  3
                </div>
              </div>
              <div className="md:w-2/3">
                <h3 className="text-2xl font-bold mb-2">{t('home.step3')}</h3>
                <p className="text-gray-600">
                  Receive personalized insights and suggestions from our Claude AI to optimize your activities and emotional wellbeing.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/3 mb-6 md:mb-0 flex justify-center">
                <div className="w-24 h-24 bg-yellow-500 text-white rounded-full flex items-center justify-center text-3xl font-bold">
                  4
                </div>
              </div>
              <div className="md:w-2/3">
                <h3 className="text-2xl font-bold mb-2">{t('home.step4')}</h3>
                <p className="text-gray-600">
                  Experience a more balanced life with improved satisfaction across all five key life elements.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to start balancing your life?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of users who have improved their life satisfaction through better balance of the five key life elements.
          </p>
          
          {currentUser ? (
            <Link 
              to="/tasks/create" 
              className="bg-white text-blue-600 hover:bg-blue-100 px-8 py-4 rounded-lg font-bold text-lg inline-block"
            >
              Create Your First Task
            </Link>
          ) : (
            <Link 
              to="/register" 
              className="bg-white text-blue-600 hover:bg-blue-100 px-8 py-4 rounded-lg font-bold text-lg inline-block"
            >
              {t('auth.signUp')} - {t('home.getStarted')}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
