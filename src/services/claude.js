// Claude API Integration
const CLAUDE_API_KEY = "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";
const CLAUDE_API_URL = "https://api.anthropic.com/v1/messages";

// Function to generate task suggestions based on parameters
export const generateTaskSuggestions = async (category, timeframe, difficulty, userData) => {
  try {
    const response = await fetch(CLAUDE_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "anthropic-version": "2024-03-01",
        "x-api-key": CLAUDE_API_KEY,
      },
      body: JSON.stringify({
        model: "claude-3-7-sonnet-20250219",
        max_tokens: 1000,
        temperature: 0.7,
        messages: [
          {
            role: "user",
            content: `请作为生活助理，根据以下信息为我推荐一些任务：
            
            类别: ${category} (工作，学习，娱乐，与知己好友社交，与伴侣情人社交)
            时间范围: ${timeframe} (今天，这星期，这个月)
            难度: ${difficulty} (常规，挑战，艰难)
            
            用户信息: ${JSON.stringify(userData)}
            
            请提供3-5个具体的任务建议，每个任务包括:
            1. 任务名称
            2. 预计完成时间
            3. 预期情绪影响
            4. 为什么这个任务对该类别有益
            
            请使用用户的首选语言回答。`
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`Claude API返回错误: ${response.status}`);
    }

    const data = await response.json();
    return data.content;
  } catch (error) {
    console.error("调用Claude API时出错:", error);
    throw error;
  }
};

// Function to analyze user's emotional state and provide guidance
export const analyzeEmotionalState = async (emotionalData, taskCompletion) => {
  try {
    const response = await fetch(CLAUDE_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "anthropic-version": "2024-03-01",
        "x-api-key": CLAUDE_API_KEY,
      },
      body: JSON.stringify({
        model: "claude-3-7-sonnet-20250219",
        max_tokens: 1000,
        temperature: 0.7,
        messages: [
          {
            role: "user",
            content: `请根据以下情绪数据和任务完成情况，分析用户当前的情绪状态并提供适当的建议：
            
            情绪数据: ${JSON.stringify(emotionalData)}
            任务完成情况: ${JSON.stringify(taskCompletion)}
            
            请考虑以下因素：
            1. 用户是否在某一领域花费了过多或过少的时间
            2. 用户情绪是否出现过度悲伤或过分快乐
            3. 用户是否有未完成的重要任务
            
            请提供温和且有帮助的建议，帮助用户在工作、学习、娱乐、社交和亲密关系中保持平衡。请使用用户的首选语言。`
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`Claude API返回错误: ${response.status}`);
    }

    const data = await response.json();
    return data.content;
  } catch (error) {
    console.error("调用Claude API分析情绪状态时出错:", error);
    throw error;
  }
};

// Function to suggest daily schedule based on five key elements
export const generateDailySchedule = async (userData, preferences) => {
  try {
    const response = await fetch(CLAUDE_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "anthropic-version": "2024-03-01",
        "x-api-key": CLAUDE_API_KEY,
      },
      body: JSON.stringify({
        model: "claude-3-7-sonnet-20250219",
        max_tokens: 1500,
        temperature: 0.7,
        messages: [
          {
            role: "user",
            content: `请根据用户的信息和偏好，生成一个平衡的日程安排，确保涵盖五个主要生活元素：
            
            用户信息: ${JSON.stringify(userData)}
            偏好设置: ${JSON.stringify(preferences)}
            
            请遵循以下默认时间分配：
            - 工作和学习总共: 2-8小时
            - 与知己良朋交际: 1-2小时
            - 与情人伴侣交际: 1-10小时
            - 娱乐和休息: 8-10小时
            
            请提供具体的时间安排，并为每个活动提供简短的建议。结果应当是平衡的，并适合用户的个人情况。请使用用户的首选语言回答。`
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`Claude API返回错误: ${response.status}`);
    }

    const data = await response.json();
    return data.content;
  } catch (error) {
    console.error("调用Claude API生成日程时出错:", error);
    throw error;
  }
};
