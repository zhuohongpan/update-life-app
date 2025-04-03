import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { getTasks, deleteTask, completeTask, TASK_CATEGORIES, TASK_TIMEFRAMES } from '../../services/taskService';
import { toast } from 'react-toastify';

const TaskList = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    timeframe: '',
    status: ''
  });
  const [selectedTask, setSelectedTask] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const tasksData = await getTasks(currentUser.uid, filters);
        setTasks(tasksData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setLoading(false);
        toast.error(t("errors.generic"));
      }
    };
    
    fetchTasks();
  }, [currentUser, filters, t]);
  
  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Reset filters
  const resetFilters = () => {
    setFilters({
      category: '',
      timeframe: '',
      status: ''
    });
  };
  
  // Handle delete task
  const handleDeleteTask = async (task) => {
    setSelectedTask(task);
    setShowDeleteConfirm(true);
  };
  
  // Confirm delete task
  const confirmDeleteTask = async () => {
    try {
      await deleteTask(selectedTask.id);
      setTasks(tasks.filter(task => task.id !== selectedTask.id));
      setShowDeleteConfirm(false);
      setSelectedTask(null);
      toast.success(t("task.deleteSuccess"));
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error(t("task.deleteError"));
    }
  };
  
  // Handle complete task
  const handleCompleteTask = async (taskId) => {
    try {
      // In a real app, you might want to ask for final emotion data
      const finalEmotions = {
        level: 7, // Happy level
        note: "Task completed successfully",
        timestamp: new Date()
      };
      
      await completeTask(taskId, finalEmotions);
      
      // Update tasks list
      setTasks(tasks.map(task => 
        task.id === taskId 
          ? { ...task, status: 'completed', completedAt: new Date() } 
          : task
      ));
      
      toast.success(t("task.completeSuccess"));
    } catch (error) {
      console.error("Error completing task:", error);
      toast.error(t("task.completeError"));
    }
  };
  
  // Get category label
  const getCategoryLabel = (category) => {
    switch(category) {
      case TASK_CATEGORIES.WORK: return t("categories.work");
      case TASK_CATEGORIES.STUDY: return t("categories.study");
      case TASK_CATEGORIES.ENTERTAINMENT: return t("categories.entertainment");
      case TASK_CATEGORIES.SOCIAL_FRIENDS: return t("categories.socialFriends");
      case TASK_CATEGORIES.SOCIAL_PARTNER: return t("categories.socialPartner");
      default: return category;
    }
  };
  
  // Get timeframe label
  const getTimeframeLabel = (timeframe) => {
    switch(timeframe) {
      case TASK_TIMEFRAMES.TODAY: return t("timeframes.today");
      case TASK_TIMEFRAMES.THIS_WEEK: return t("timeframes.thisWeek");
      case TASK_TIMEFRAMES.THIS_MONTH: return t("timeframes.thisMonth");
      default: return timeframe;
    }
  };
  
  // Get status label
  const getStatusLabel = (status) => {
    switch(status) {
      case 'pending': return t("task.status.pending");
      case 'in-progress': return t("task.status.inProgress");
      case 'completed': return t("task.status.completed");
      default: return status;
    }
  };
  
  // Get status color
  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Get category color
  const getCategoryColor = (category) => {
    switch(category) {
      case TASK_CATEGORIES.WORK: return 'bg-blue-100 text-blue-800';
      case TASK_CATEGORIES.STUDY: return 'bg-green-100 text-green-800';
      case TASK_CATEGORIES.ENTERTAINMENT: return 'bg-yellow-100 text-yellow-800';
      case TASK_CATEGORIES.SOCIAL_FRIENDS: return 'bg-purple-100 text-purple-800';
      case TASK_CATEGORIES.SOCIAL_PARTNER: return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t("nav.tasks")}</h1>
        <Link
          to="/tasks/create"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          <i className="fas fa-plus mr-2"></i>
          {t("task.create.title")}
        </Link>
      </div>
      
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
              {t("task.fields.category")}
            </label>
            <select
              id="category"
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="">{t("common.selectOption")}</option>
              {Object.values(TASK_CATEGORIES).map(category => (
                <option key={category} value={category}>
                  {getCategoryLabel(category)}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex-1">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="timeframe">
              {t("task.fields.timeframe")}
            </label>
            <select
              id="timeframe"
              name="timeframe"
              value={filters.timeframe}
              onChange={handleFilterChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="">{t("common.selectOption")}</option>
              {Object.values(TASK_TIMEFRAMES).map(timeframe => (
                <option key={timeframe} value={timeframe}>
                  {getTimeframeLabel(timeframe)}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex-1">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
              {t("admin.status")}
            </label>
            <select
              id="status"
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="">{t("common.selectOption")}</option>
              <option value="pending">{t("task.status.pending")}</option>
              <option value="in-progress">{t("task.status.inProgress")}</option>
              <option value="completed">{t("task.status.completed")}</option>
            </select>
          </div>
          
          <div className="flex-1 flex items-end">
            <button
              onClick={resetFilters}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
            >
              {t("common.filter")}
            </button>
          </div>
        </div>
      </div>
      
      {/* Tasks list */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">{t("common.loading")}</span>
          </div>
        </div>
      ) : tasks.length > 0 ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t("task.fields.name")}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t("task.fields.category")}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t("task.fields.timeframe")}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t("admin.status")}
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t("admin.actions")}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tasks.map(task => (
                <tr key={task.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{task.name}</div>
                    {task.description && (
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {task.description}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getCategoryColor(task.category)}`}>
                      {getCategoryLabel(task.category)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">
                      {getTimeframeLabel(task.timeframe)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(task.status)}`}>
                      {getStatusLabel(task.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {task.status !== 'completed' && (
                      <>
                        <Link
                          to={`/tasks/edit/${task.id}`}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          {t("task.actions.edit")}
                        </Link>
                        <button
                          onClick={() => handleCompleteTask(task.id)}
                          className="text-green-600 hover:text-green-900 mr-4"
                        >
                          {t("task.actions.complete")}
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleDeleteTask(task)}
                      className="text-red-600 hover:text-red-900"
                    >
                      {t("task.actions.delete")}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <p className="text-gray-600 mb-4">{t("timeTracker.noTasks")}</p>
          <Link
            to="/tasks/create"
            className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            {t("timeTracker.createTask")}
          </Link>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">{t("task.confirmDelete")}</h3>
            <p className="mb-4 text-gray-600">
              {selectedTask?.name}
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
              >
                {t("common.cancel")}
              </button>
              <button
                onClick={confirmDeleteTask}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                {t("common.delete")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;
