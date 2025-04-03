import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { createTask, TASK_CATEGORIES, TASK_TIMEFRAMES, TASK_DIFFICULTIES } from '../../services/taskService';
import { generateTaskSuggestions } from '../../services/claude';
import { toast } from 'react-toastify';

const TaskCreate = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  // Form state
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState('');
  const [timeframe, setTimeframe] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [entryMethod, setEntryMethod] = useState('');
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [estimatedTime, setEstimatedTime] = useState(30);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  
  // Reset form when changing steps
  useEffect(() => {
    if (step === 1) {
      setTimeframe('');
      setDifficulty('');
      setEntryMethod('');
      setTaskName('');
      setTaskDescription('');
      setEstimatedTime(30);
      setAiSuggestions([]);
      setSelectedSuggestion(null);
    } else if (step === 2) {
      setDifficulty('');
      setEntryMethod('');
      setTaskName('');
      setTaskDescription('');
      setEstimatedTime(30);
      setAiSuggestions([]);
      setSelectedSuggestion(null);
    } else if (step === 3) {
      setEntryMethod('');
      setTaskName('');
      setTaskDescription('');
      setEstimatedTime(30);
      setAiSuggestions([]);
      setSelectedSuggestion(null);
    }
  }, [step]);
  
  // Function to fetch AI suggestions
  const fetchAiSuggestions = async () => {
    try {
      setIsLoading(true);
      const userData = {
        displayName: currentUser.displayName,
        email: currentUser.email,
        // Add any additional user info that might help with personalization
      };
      
      const suggestions = await generateTaskSuggestions(
        getCategoryTranslation(category),
        getTimeframeTranslation(timeframe),
        getDifficultyTranslation(difficulty),
        userData
      );
      
      setAiSuggestions(suggestions);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching AI suggestions:", error);
      toast.error(t("task.create.aiError"));
      setIsLoading(false);
    }
  };
  
  // Helper functions to get human-readable translations
  const getCategoryTranslation = (cat) => {
    switch(cat) {
      case TASK_CATEGORIES.WORK: return t("categories.work");
      case TASK_CATEGORIES.STUDY: return t("categories.study");
      case TASK_CATEGORIES.ENTERTAINMENT: return t("categories.entertainment");
      case TASK_CATEGORIES.SOCIAL_FRIENDS: return t("categories.socialFriends");
      case TASK_CATEGORIES.SOCIAL_PARTNER: return t("categories.socialPartner");
      default: return cat;
    }
  };
  
  const getTimeframeTranslation = (tf) => {
    switch(tf) {
      case TASK_TIMEFRAMES.TODAY: return t("timeframes.today");
      case TASK_TIMEFRAMES.THIS_WEEK: return t("timeframes.thisWeek");
      case TASK_TIMEFRAMES.THIS_MONTH: return t("timeframes.thisMonth");
      default: return tf;
    }
  };
  
  const getDifficultyTranslation = (diff) => {
    switch(diff) {
      case TASK_DIFFICULTIES.REGULAR: return t("difficulties.regular");
      case TASK_DIFFICULTIES.CHALLENGING: return t("difficulties.challenging");
      case TASK_DIFFICULTIES.DIFFICULT: return t("difficulties.difficult");
      default: return diff;
    }
  };
  
  // Function to handle task creation
  const handleCreateTask = async () => {
    try {
      setIsLoading(true);
      
      const taskData = {
        category,
        timeframe,
        difficulty,
        name: taskName,
        description: taskDescription,
        estimatedTime: parseInt(estimatedTime),
        isAiGenerated: entryMethod === 'ai',
        emotionTracking: {
          before: null,
          during: [],
          after: null
        },
        createdBy: currentUser.uid
      };
      
      await createTask(currentUser.uid, taskData);
      
      toast.success(t("task.create.success"));
      navigate('/tasks');
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error(t("task.create.error"));
      setIsLoading(false);
    }
  };
  
  // Function to select a suggestion
  const handleSelectSuggestion = (suggestion) => {
    setSelectedSuggestion(suggestion);
    setTaskName(suggestion.title);
    setTaskDescription(suggestion.description);
    setEstimatedTime(suggestion.estimatedTime);
  };
  
  // Render step 1: Category selection
  const renderCategorySelection = () => (
    <div className="task-selection">
      <h2>{t("task.create.selectCategory")}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <button 
          onClick={() => { setCategory(TASK_CATEGORIES.WORK); setStep(2); }}
          className="selection-btn bg-blue-100 hover:bg-blue-200 p-6 rounded-lg flex flex-col items-center">
          <i className="fas fa-briefcase text-3xl mb-2"></i>
          <span>{t("categories.work")}</span>
        </button>
        
        <button 
          onClick={() => { setCategory(TASK_CATEGORIES.STUDY); setStep(2); }}
          className="selection-btn bg-green-100 hover:bg-green-200 p-6 rounded-lg flex flex-col items-center">
          <i className="fas fa-book text-3xl mb-2"></i>
          <span>{t("categories.study")}</span>
        </button>
        
        <button 
          onClick={() => { setCategory(TASK_CATEGORIES.ENTERTAINMENT); setStep(2); }}
          className="selection-btn bg-yellow-100 hover:bg-yellow-200 p-6 rounded-lg flex flex-col items-center">
          <i className="fas fa-gamepad text-3xl mb-2"></i>
          <span>{t("categories.entertainment")}</span>
        </button>
        
        <button 
          onClick={() => { setCategory(TASK_CATEGORIES.SOCIAL_FRIENDS); setStep(2); }}
          className="selection-btn bg-purple-100 hover:bg-purple-200 p-6 rounded-lg flex flex-col items-center">
          <i className="fas fa-users text-3xl mb-2"></i>
          <span>{t("categories.socialFriends")}</span>
        </button>
        
        <button 
          onClick={() => { setCategory(TASK_CATEGORIES.SOCIAL_PARTNER); setStep(2); }}
          className="selection-btn bg-pink-100 hover:bg-pink-200 p-6 rounded-lg flex flex-col items-center">
          <i className="fas fa-heart text-3xl mb-2"></i>
          <span>{t("categories.socialPartner")}</span>
        </button>
      </div>
    </div>
  );
  
  // Render step 2: Timeframe selection
  const renderTimeframeSelection = () => (
    <div className="task-selection">
      <h2>{t("task.create.selectTimeframe")}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button 
          onClick={() => { setTimeframe(TASK_TIMEFRAMES.TODAY); setStep(3); }}
          className="selection-btn bg-blue-100 hover:bg-blue-200 p-6 rounded-lg flex flex-col items-center">
          <i className="fas fa-calendar-day text-3xl mb-2"></i>
          <span>{t("timeframes.today")}</span>
        </button>
        
        <button 
          onClick={() => { setTimeframe(TASK_TIMEFRAMES.THIS_WEEK); setStep(3); }}
          className="selection-btn bg-blue-100 hover:bg-blue-200 p-6 rounded-lg flex flex-col items-center">
          <i className="fas fa-calendar-week text-3xl mb-2"></i>
          <span>{t("timeframes.thisWeek")}</span>
        </button>
        
        <button 
          onClick={() => { setTimeframe(TASK_TIMEFRAMES.THIS_MONTH); setStep(3); }}
          className="selection-btn bg-blue-100 hover:bg-blue-200 p-6 rounded-lg flex flex-col items-center">
          <i className="fas fa-calendar-alt text-3xl mb-2"></i>
          <span>{t("timeframes.thisMonth")}</span>
        </button>
      </div>
      
      <button 
        onClick={() => setStep(1)}
        className="mt-4 text-gray-600 hover:text-gray-800">
        <i className="fas fa-arrow-left mr-2"></i>
        {t("common.back")}
      </button>
    </div>
  );
  
  // Render step 3: Difficulty selection
  const renderDifficultySelection = () => (
    <div className="task-selection">
      <h2>{t("task.create.selectDifficulty")}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button 
          onClick={() => { setDifficulty(TASK_DIFFICULTIES.REGULAR); setStep(4); }}
          className="selection-btn bg-green-100 hover:bg-green-200 p-6 rounded-lg flex flex-col items-center">
          <i className="fas fa-thumbs-up text-3xl mb-2"></i>
          <span>{t("difficulties.regular")}</span>
        </button>
        
        <button 
          onClick={() => { setDifficulty(TASK_DIFFICULTIES.CHALLENGING); setStep(4); }}
          className="selection-btn bg-yellow-100 hover:bg-yellow-200 p-6 rounded-lg flex flex-col items-center">
          <i className="fas fa-bolt text-3xl mb-2"></i>
          <span>{t("difficulties.challenging")}</span>
        </button>
        
        <button 
          onClick={() => { setDifficulty(TASK_DIFFICULTIES.DIFFICULT); setStep(4); }}
          className="selection-btn bg-red-100 hover:bg-red-200 p-6 rounded-lg flex flex-col items-center">
          <i className="fas fa-mountain text-3xl mb-2"></i>
          <span>{t("difficulties.difficult")}</span>
        </button>
      </div>
      
      <button 
        onClick={() => setStep(2)}
        className="mt-4 text-gray-600 hover:text-gray-800">
        <i className="fas fa-arrow-left mr-2"></i>
        {t("common.back")}
      </button>
    </div>
  );
  
  // Render step 4: Entry method selection
  const renderEntryMethodSelection = () => (
    <div className="task-selection">
      <h2>{t("task.create.selectEntryMethod")}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button 
          onClick={() => { setEntryMethod('manual'); setStep(5); }}
          className="selection-btn bg-blue-100 hover:bg-blue-200 p-6 rounded-lg flex flex-col items-center">
          <i className="fas fa-edit text-3xl mb-2"></i>
          <span>{t("task.create.manual")}</span>
        </button>
        
        <button 
          onClick={() => { 
            setEntryMethod('ai'); 
            setStep(5);
            fetchAiSuggestions();
          }}
          className="selection-btn bg-purple-100 hover:bg-purple-200 p-6 rounded-lg flex flex-col items-center">
          <i className="fas fa-robot text-3xl mb-2"></i>
          <span>{t("task.create.aiAssistant")}</span>
        </button>
      </div>
      
      <button 
        onClick={() => setStep(3)}
        className="mt-4 text-gray-600 hover:text-gray-800">
        <i className="fas fa-arrow-left mr-2"></i>
        {t("common.back")}
      </button>
    </div>
  );
  
  // Render step 5: Task details
  const renderTaskDetails = () => (
    <div className="task-details">
      <h2>
        {entryMethod === 'manual' 
          ? t("task.create.enterDetails") 
          : t("task.create.aiSuggestions")}
      </h2>
      
      {entryMethod === 'ai' && (
        <div className="mb-6">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="spinner-border text-primary" role="status">
                <span className="sr-only">{t("common.loading")}</span>
              </div>
              <p className="mt-2">{t("task.create.generatingSuggestions")}</p>
            </div>
          ) : aiSuggestions.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {aiSuggestions.map((suggestion, index) => (
                <div 
                  key={index}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedSuggestion === suggestion 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-300 hover:border-blue-300'
                  }`}
                  onClick={() => handleSelectSuggestion(suggestion)}>
                  <h3 className="text-lg font-semibold">{suggestion.title}</h3>
                  <p className="text-gray-700">{suggestion.description}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      {suggestion.estimatedTime} {t("common.minutes")}
                    </span>
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                      {suggestion.emotionalImpact}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <p>{t("task.create.noSuggestions")}</p>
              <button 
                onClick={fetchAiSuggestions}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                {t("task.create.tryAgain")}
              </button>
            </div>
          )}
        </div>
      )}
      
      <form onSubmit={(e) => { e.preventDefault(); handleCreateTask(); }}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="taskName">
            {t("task.fields.name")}
          </label>
          <input
            id="taskName"
            type="text"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="taskDescription">
            {t("task.fields.description")}
          </label>
          <textarea
            id="taskDescription"
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            rows="4"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="estimatedTime">
            {t("task.fields.estimatedTime")} ({t("common.minutes")})
          </label>
          <input
            id="estimatedTime"
            type="number"
            min="1"
            value={estimatedTime}
            onChange={(e) => setEstimatedTime(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        
        <div className="flex items-center justify-between mt-6">
          <button 
            type="button"
            onClick={() => setStep(4)}
            className="text-gray-600 hover:text-gray-800">
            <i className="fas fa-arrow-left mr-2"></i>
            {t("common.back")}
          </button>
          
          <button 
            type="submit"
            disabled={isLoading || !taskName}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-gray-400">
            {isLoading ? t("common.creating") : t("task.create.createTask")}
          </button>
        </div>
      </form>
    </div>
  );
  
  // Render the appropriate step
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-md rounded-lg p-6">
        {step === 1 && renderCategorySelection()}
        {step === 2 && renderTimeframeSelection()}
        {step === 3 && renderDifficultySelection()}
        {step === 4 && renderEntryMethodSelection()}
        {step === 5 && renderTaskDetails()}
      </div>
    </div>
  );
};

export default TaskCreate;
