// Task Service
import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  Timestamp, 
  increment
} from "firebase/firestore";
import { db } from "./firebase";
import { getUserData } from "./auth";

// Constants for task categories
export const TASK_CATEGORIES = {
  WORK: "work",
  STUDY: "study",
  ENTERTAINMENT: "entertainment",
  SOCIAL_FRIENDS: "socialFriends",
  SOCIAL_PARTNER: "socialPartner"
};

// Constants for task timeframes
export const TASK_TIMEFRAMES = {
  TODAY: "today",
  THIS_WEEK: "thisWeek",
  THIS_MONTH: "thisMonth"
};

// Constants for task difficulties
export const TASK_DIFFICULTIES = {
  REGULAR: "regular",
  CHALLENGING: "challenging",
  DIFFICULT: "difficult"
};

// Create a new task
export const createTask = async (userId, taskData) => {
  try {
    // Add tracking data
    const taskWithTracking = {
      ...taskData,
      userId,
      createdAt: Timestamp.now(),
      status: "pending",
      timeTracking: {
        startTime: null,
        endTime: null,
        totalTimeSpent: 0,
        sessions: []
      },
      emotionTracking: {
        before: null,
        during: [],
        after: null
      }
    };
    
    // Add to Firestore
    const docRef = await addDoc(collection(db, "tasks"), taskWithTracking);
    
    // Update user stats
    await updateDoc(doc(db, "users", userId), {
      "stats.tasksCreated": increment(1)
    });
    
    // Get task with ID
    const newTask = await getDoc(docRef);
    return { id: docRef.id, ...newTask.data() };
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
};

// Get tasks for a user with filters
export const getTasks = async (userId, filters = {}) => {
  try {
    const { category, timeframe, status, sortBy = "createdAt", sortOrder = "desc" } = filters;
    
    // Build query
    let q = collection(db, "tasks");
    let conditions = [where("userId", "==", userId)];
    
    // Add filters if specified
    if (category) {
      conditions.push(where("category", "==", category));
    }
    
    if (timeframe) {
      conditions.push(where("timeframe", "==", timeframe));
    }
    
    if (status) {
      conditions.push(where("status", "==", status));
    }
    
    // Create query with conditions
    q = query(q, ...conditions, orderBy(sortBy, sortOrder));
    
    // Execute query
    const querySnapshot = await getDocs(q);
    const tasks = [];
    
    querySnapshot.forEach((doc) => {
      tasks.push({ id: doc.id, ...doc.data() });
    });
    
    return tasks;
  } catch (error) {
    console.error("Error getting tasks:", error);
    throw error;
  }
};

// Get a single task by ID
export const getTaskById = async (taskId) => {
  try {
    const taskDoc = await getDoc(doc(db, "tasks", taskId));
    
    if (taskDoc.exists()) {
      return { id: taskDoc.id, ...taskDoc.data() };
    } else {
      throw new Error("Task not found");
    }
  } catch (error) {
    console.error("Error getting task:", error);
    throw error;
  }
};

// Update a task
export const updateTask = async (taskId, taskData) => {
  try {
    // Ensure createdAt doesn't get overwritten
    const { createdAt, userId, ...updateData } = taskData;
    
    await updateDoc(doc(db, "tasks", taskId), updateData);
    return true;
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
};

// Delete a task
export const deleteTask = async (taskId) => {
  try {
    await deleteDoc(doc(db, "tasks", taskId));
    return true;
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
};

// Start task time tracking
export const startTaskTracking = async (taskId) => {
  try {
    const startTime = Timestamp.now();
    
    await updateDoc(doc(db, "tasks", taskId), {
      "timeTracking.startTime": startTime,
      "status": "in-progress"
    });
    
    return startTime;
  } catch (error) {
    console.error("Error starting task tracking:", error);
    throw error;
  }
};

// Stop task time tracking
export const stopTaskTracking = async (taskId) => {
  try {
    // Get current task data
    const taskDoc = await getDoc(doc(db, "tasks", taskId));
    
    if (!taskDoc.exists()) {
      throw new Error("Task not found");
    }
    
    const taskData = taskDoc.data();
    const startTime = taskData.timeTracking.startTime;
    
    if (!startTime) {
      throw new Error("Task tracking not started");
    }
    
    const endTime = Timestamp.now();
    const sessionDuration = endTime.seconds - startTime.seconds;
    const totalTimeSpent = (taskData.timeTracking.totalTimeSpent || 0) + sessionDuration;
    
    // Create new session
    const session = {
      startTime,
      endTime,
      duration: sessionDuration
    };
    
    // Update task with session data
    await updateDoc(doc(db, "tasks", taskId), {
      "timeTracking.startTime": null,
      "timeTracking.endTime": endTime,
      "timeTracking.totalTimeSpent": totalTimeSpent,
      "timeTracking.sessions": [...(taskData.timeTracking.sessions || []), session]
    });
    
    // Update user stats
    const userId = taskData.userId;
    await updateDoc(doc(db, "users", userId), {
      "stats.totalTimeTracked": increment(sessionDuration)
    });
    
    return { endTime, sessionDuration, totalTimeSpent };
  } catch (error) {
    console.error("Error stopping task tracking:", error);
    throw error;
  }
};

// Complete a task
export const completeTask = async (taskId, finalEmotions) => {
  try {
    // Stop tracking if still in progress
    const taskDoc = await getDoc(doc(db, "tasks", taskId));
    
    if (!taskDoc.exists()) {
      throw new Error("Task not found");
    }
    
    const taskData = taskDoc.data();
    
    if (taskData.timeTracking.startTime) {
      await stopTaskTracking(taskId);
    }
    
    // Update task as completed
    await updateDoc(doc(db, "tasks", taskId), {
      "status": "completed",
      "completedAt": Timestamp.now(),
      "emotionTracking.after": finalEmotions
    });
    
    // Update user stats
    const userId = taskData.userId;
    await updateDoc(doc(db, "users", userId), {
      "stats.tasksCompleted": increment(1)
    });
    
    return true;
  } catch (error) {
    console.error("Error completing task:", error);
    throw error;
  }
};

// Record emotion during task
export const recordTaskEmotion = async (taskId, emotionData) => {
  try {
    const taskDoc = await getDoc(doc(db, "tasks", taskId));
    
    if (!taskDoc.exists()) {
      throw new Error("Task not found");
    }
    
    const taskData = taskDoc.data();
    const currentEmotions = taskData.emotionTracking.during || [];
    
    const emotion = {
      ...emotionData,
      timestamp: Timestamp.now()
    };
    
    await updateDoc(doc(db, "tasks", taskId), {
      "emotionTracking.during": [...currentEmotions, emotion]
    });
    
    return true;
  } catch (error) {
    console.error("Error recording task emotion:", error);
    throw error;
  }
};

// Record initial emotion before task
export const recordInitialEmotion = async (taskId, emotionData) => {
  try {
    await updateDoc(doc(db, "tasks", taskId), {
      "emotionTracking.before": {
        ...emotionData,
        timestamp: Timestamp.now()
      }
    });
    
    return true;
  } catch (error) {
    console.error("Error recording initial emotion:", error);
    throw error;
  }
};

// Get time analysis by category
export const getTimeAnalysisByCategory = async (userId, timeRange) => {
  try {
    // Get all completed tasks for user
    const tasks = await getTasks(userId, { status: "completed" });
    
    // Filter by time range if specified
    let filteredTasks = tasks;
    if (timeRange) {
      const now = Timestamp.now();
      let startTime;
      
      if (timeRange === "day") {
        startTime = new Timestamp(now.seconds - 86400, 0);
      } else if (timeRange === "week") {
        startTime = new Timestamp(now.seconds - 604800, 0);
      } else if (timeRange === "month") {
        startTime = new Timestamp(now.seconds - 2592000, 0);
      }
      
      filteredTasks = tasks.filter(task => 
        task.completedAt && task.completedAt.seconds >= startTime.seconds);
    }
    
    // Group by category
    const analysis = {};
    for (const category of Object.values(TASK_CATEGORIES)) {
      analysis[category] = {
        totalTasks: 0,
        completedTasks: 0,
        totalTime: 0,
        averageTime: 0
      };
    }
    
    // Calculate metrics
    filteredTasks.forEach(task => {
      const category = task.category;
      if (analysis[category]) {
        analysis[category].totalTasks++;
        if (task.status === "completed") {
          analysis[category].completedTasks++;
          analysis[category].totalTime += task.timeTracking.totalTimeSpent || 0;
        }
      }
    });
    
    // Calculate averages
    for (const category in analysis) {
      if (analysis[category].completedTasks > 0) {
        analysis[category].averageTime = analysis[category].totalTime / analysis[category].completedTasks;
      }
    }
    
    return analysis;
  } catch (error) {
    console.error("Error getting time analysis:", error);
    throw error;
  }
};

// Generate tasks with Claude AI
export const generateAITasks = async (userId, category, timeframe, difficulty) => {
  try {
    // Get user data for personalization
    const userData = await getUserData(userId);
    
    // Call Claude API (implementation in claude.js)
    // This function assumes the Claude service is imported and available
    const suggestions = await window.claudeService.generateTaskSuggestions(
      category, 
      timeframe, 
      difficulty, 
      userData
    );
    
    return suggestions;
  } catch (error) {
    console.error("Error generating AI tasks:", error);
    throw error;
  }
};
