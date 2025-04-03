import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { getTasks, getTimeAnalysisByCategory, TASK_CATEGORIES } from '../../services/taskService';
import { generateDailySchedule } from '../../services/claude';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import TimeTracker from './TimeTracker';
import EmotionTracker from './EmotionTracker';

const Dashboard = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [timeAnalysis, setTimeAnalysis] = useState({});
  const [tasks, setTasks] = useState([]);
  const [pendingTasks, setPendingTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [timeRange, setTimeRange] = useState('week');
  const [suggestedSchedule, setSuggestedSchedule] = useState(null);
  const [showSchedule, setShowSchedule] = useState(false);
  const [scheduleBtnLoading, setScheduleBtnLoading] = useState(false);
  
  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch tasks
        const allTasks = await getTasks(currentUser.uid);
        setTasks(allTasks);
        
        // Filter pending and completed tasks
        setPendingTasks(allTasks.filter(task => task.status === 'pending' || task.status === 'in-progress'));
        setCompletedTasks(allTasks.filter(task => task.status === 'completed'));
        
        // Get time analysis
        const analysis = await getTimeAnalysisByCategory(currentUser.uid, timeRange);
        setTimeAnalysis(analysis);
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [currentUser, timeRange]);
  
  // Function to generate chart data from time analysis
  const generateTimeChartData = () => {
    return Object.entries(timeAnalysis).map(([category, data]) => ({
      name: getCategoryName(category),
      value: data.totalTime / 60, // Convert seconds to minutes
      count: data.completedTasks
    }));
  };
  
  // Function to get human-readable category name
  const getCategoryName = (category) => {
    switch(category) {
      case TASK_CATEGORIES.WORK: return t("categories.work");
      case TASK_CATEGORIES.STUDY: return t("categories.study");
      case TASK_CATEGORIES.ENTERTAINMENT: return t("categories.entertainment");
      case TASK_CATEGORIES.SOCIAL_FRIENDS: return t("categories.socialFriends");
      case TASK_CATEGORIES.SOCIAL_PARTNER: return t("categories.socialPartner");
      default: return category;
    }
  };
  
  // Function to generate suggested daily schedule
  const handleGenerateSchedule = async () => {
    try {
      setScheduleBtnLoading(true);
      
      // Get user preferences and stats
      const userData = {
        displayName: currentUser.displayName,
        tasks: {
          pending: pendingTasks.length,
          completed: completedTasks.length
        },
        timeAnalysis
      };
      
      const preferences = {
        timeRange
      };
      
      // Call Claude API
      const schedule = await generateDailySchedule(userData, preferences);
      setSuggestedSchedule(schedule);
      setShowSchedule(true);
      
      setScheduleBtnLoading(false);
    } catch (error) {
      console.error("Error generating schedule:", error);
      setScheduleBtnLoading(false);
    }
  };
  
  // Calculate the percentage of life elements balance
  const calculateElementBalance = () => {
    const totalTime = Object.values(timeAnalysis).reduce((sum, category) => sum + category.totalTime, 0);
    
    if (totalTime === 0) return {};
    
    return {
      work: ((timeAnalysis[TASK_CATEGORIES.WORK]?.totalTime || 0) / totalTime) * 100,
      study: ((timeAnalysis[TASK_CATEGORIES.STUDY]?.totalTime || 0) / totalTime) * 100,
      entertainment: ((timeAnalysis[TASK_CATEGORIES.ENTERTAINMENT]?.totalTime || 0) / totalTime) * 100,
      socialFriends: ((timeAnalysis[TASK_CATEGORIES.SOCIAL_FRIENDS]?.totalTime || 0) / totalTime) * 100,
      socialPartner: ((timeAnalysis[TASK_CATEGORIES.SOCIAL_PARTNER]?.totalTime || 0) / totalTime) * 100
    };
  };
  
  // Get task distribution data for bar chart
  const getTaskDistribution = () => {
    return [
      {
        name: t("categories.work"),
        pending: pendingTasks.filter(task => task.category === TASK_CATEGORIES.WORK).length,
        completed: completedTasks.filter(task => task.category === TASK_CATEGORIES.WORK).length
      },
      {
        name: t("categories.study"),
        pending: pendingTasks.filter(task => task.category === TASK_CATEGORIES.STUDY).length,
        completed: completedTasks.filter(task => task.category === TASK_CATEGORIES.STUDY).length
      },
      {
        name: t("categories.entertainment"),
        pending: pendingTasks.filter(task => task.category === TASK_CATEGORIES.ENTERTAINMENT).length,
        completed: completedTasks.filter(task => task.category === TASK_CATEGORIES.ENTERTAINMENT).length
      },
      {
        name: t("categories.socialFriends"),
        pending: pendingTasks.filter(task => task.category === TASK_CATEGORIES.SOCIAL_FRIENDS).length,
        completed: completedTasks.filter(task => task.category === TASK_CATEGORIES.SOCIAL_FRIENDS).length
      },
      {
        name: t("categories.socialPartner"),
        pending: pendingTasks.filter(task => task.category === TASK_CATEGORIES.SOCIAL_PARTNER).length,
        completed: completedTasks.filter(task => task.category === TASK_CATEGORIES.SOCIAL_PARTNER).length
      }
    ];
  };
  
  // Balance data for visual representation
  const balanceData = calculateElementBalance();
  
  // Simple custom tooltip for the charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-300 rounded shadow-sm">
          <p className="font-semibold">{`${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value.toFixed(2)}${entry.unit || ''}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">{t("dashboard.title")}</h1>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">{t("common.loading")}</span>
          </div>
        </div>
      ) : (
        <>
          {/* Time Range Selector */}
          <div className="mb-6 flex justify-between items-center">
            <div className="flex space-x-2">
              <button 
                onClick={() => setTimeRange('day')}
                className={`px-4 py-2 rounded-lg ${timeRange === 'day' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                {t("dashboard.today")}
              </button>
              <button 
                onClick={() => setTimeRange('week')}
                className={`px-4 py-2 rounded-lg ${timeRange === 'week' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                {t("dashboard.thisWeek")}
              </button>
              <button 
                onClick={() => setTimeRange('month')}
                className={`px-4 py-2 rounded-lg ${timeRange === 'month' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                {t("dashboard.thisMonth")}
              </button>
            </div>
            
            <button 
              onClick={handleGenerateSchedule}
              disabled={scheduleBtnLoading}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-400">
              {scheduleBtnLoading ? t("common.loading") : t("dashboard.generateSchedule")}
            </button>
          </div>
          
          {/* Task Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">{t("dashboard.totalTasks")}</h3>
              <p className="text-3xl">{tasks.length}</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">{t("dashboard.pendingTasks")}</h3>
              <p className="text-3xl">{pendingTasks.length}</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">{t("dashboard.completedTasks")}</h3>
              <p className="text-3xl">{completedTasks.length}</p>
            </div>
          </div>
          
          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Time Distribution Pie Chart */}
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">{t("dashboard.timeDistribution")}</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={generateTimeChartData()}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {generateTimeChartData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* Task Distribution Bar Chart */}
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">{t("dashboard.taskDistribution")}</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={getTaskDistribution()}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="pending" name={t("task.status.pending")} fill="#FFC107" />
                    <Bar dataKey="completed" name={t("task.status.completed")} fill="#4CAF50" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          
          {/* Balance Meter */}
          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <h3 className="text-lg font-semibold mb-4">{t("dashboard.lifeBalance")}</h3>
            <div className="grid grid-cols-5 gap-2">
              <div className="flex flex-col items-center">
                <div className="w-full bg-gray-200 h-4 rounded-full overflow-hidden">
                  <div 
                    className="bg-blue-500 h-full" 
                    style={{ width: `${balanceData.work || 0}%` }}
                  ></div>
                </div>
                <span className="text-sm mt-1">{t("categories.work")}</span>
                <span className="text-xs text-gray-500">{balanceData.work ? balanceData.work.toFixed(1) : 0}%</span>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="w-full bg-gray-200 h-4 rounded-full overflow-hidden">
                  <div 
                    className="bg-green-500 h-full" 
                    style={{ width: `${balanceData.study || 0}%` }}
                  ></div>
                </div>
                <span className="text-sm mt-1">{t("categories.study")}</span>
                <span className="text-xs text-gray-500">{balanceData.study ? balanceData.study.toFixed(1) : 0}%</span>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="w-full bg-gray-200 h-4 rounded-full overflow-hidden">
                  <div 
                    className="bg-yellow-500 h-full" 
                    style={{ width: `${balanceData.entertainment || 0}%` }}
                  ></div>
                </div>
                <span className="text-sm mt-1">{t("categories.entertainment")}</span>
                <span className="text-xs text-gray-500">{balanceData.entertainment ? balanceData.entertainment.toFixed(1) : 0}%</span>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="w-full bg-gray-200 h-4 rounded-full overflow-hidden">
                  <div 
                    className="bg-purple-500 h-full" 
                    style={{ width: `${balanceData.socialFriends || 0}%` }}
                  ></div>
                </div>
                <span className="text-sm mt-1">{t("categories.socialFriends")}</span>
                <span className="text-xs text-gray-500">{balanceData.socialFriends ? balanceData.socialFriends.toFixed(1) : 0}%</span>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="w-full bg-gray-200 h-4 rounded-full overflow-hidden">
                  <div 
                    className="bg-pink-500 h-full" 
                    style={{ width: `${balanceData.socialPartner || 0}%` }}
                  ></div>
                </div>
                <span className="text-sm mt-1">{t("categories.socialPartner")
