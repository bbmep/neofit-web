// 成就與統計頁面 JavaScript
document.addEventListener('DOMContentLoaded', () => {
    // 初始化數據
    const userData = loadUserData();
    
    // 更新統計數據
    updateStatistics(userData);
    
    // 初始化圖表
    initializeCharts(userData);
    
    // 更新成就徽章
    updateAchievements(userData);
    
    // 事件監聽器
    setupEventListeners();
});

// 加載用戶數據
function loadUserData() {
    // 從本地存儲加載數據
    const appState = JSON.parse(localStorage.getItem('neofit_app_state') || '{}');
    const workoutData = JSON.parse(localStorage.getItem('neofit_workouts') || '[]');
    const mealData = JSON.parse(localStorage.getItem('neofit_meals') || '[]');
    const challengeData = JSON.parse(localStorage.getItem('neofit_challenge') || '{}');
    
    // 計算統計數據
    const streak = challengeData.streak || 0;
    const workoutCount = workoutData.length || 0;
    const mealCount = mealData.length || 0;
    
    // 計算成就數量
    const achievements = calculateAchievements(streak, workoutCount, mealCount, challengeData);
    
    // 生成活動數據
    const activityData = generateActivityData(workoutData, mealData);
    
    // 生成健身數據
    const fitnessData = generateFitnessData(workoutData);
    
    // 生成營養數據
    const nutritionData = generateNutritionData(mealData);
    
    return {
        streak,
        workoutCount,
        mealCount,
        achievementCount: achievements.length,
        achievements,
        activityData,
        fitnessData,
        nutritionData
    };
}

// 更新統計數據
function updateStatistics(userData) {
    document.getElementById('streak-count').textContent = userData.streak;
    document.getElementById('workout-count').textContent = userData.workoutCount;
    document.getElementById('meal-count').textContent = userData.mealCount;
    document.getElementById('achievement-count').textContent = userData.achievementCount;
}

// 計算成就
function calculateAchievements(streak, workoutCount, mealCount, challengeData) {
    const achievements = [];
    const completedDays = challengeData.completedDays || [];
    
    // 連續登入成就
    if (streak >= 3) achievements.push('streak_3');
    if (streak >= 7) achievements.push('streak_7');
    if (streak >= 30) achievements.push('streak_30');
    
    // 健身成就
    if (workoutCount >= 5) achievements.push('workout_5');
    if (workoutCount >= 20) achievements.push('workout_20');
    if (workoutCount >= 50) achievements.push('workout_50');
    
    // 餐食記錄成就
    if (mealCount >= 10) achievements.push('meal_10');
    if (mealCount >= 30) achievements.push('meal_30');
    if (mealCount >= 100) achievements.push('meal_100');
    
    // 挑戰成就
    if (completedDays.length >= 7) achievements.push('challenge_7');
    if (completedDays.length >= 14) achievements.push('challenge_14');
    if (completedDays.length >= 21) achievements.push('challenge_21');
    
    return achievements;
}

// 更新成就徽章
function updateAchievements(userData) {
    const badgeItems = document.querySelectorAll('.badge-item');
    
    badgeItems.forEach(badge => {
        const badgeId = badge.dataset.badgeId;
        if (userData.achievements.includes(badgeId)) {
            badge.classList.remove('locked');
        } else {
            badge.classList.add('locked');
        }
    });
}

// 生成活動數據
function generateActivityData(workoutData, mealData) {
    // 獲取過去30天的日期
    const dates = [];
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        dates.push(formatDate(date));
    }
    
    // 計算每天的活動數據
    const workoutsByDate = {};
    const mealsByDate = {};
    
    workoutData.forEach(workout => {
        const date = workout.date ? workout.date.split('T')[0] : '';
        if (date) {
            workoutsByDate[date] = (workoutsByDate[date] || 0) + 1;
        }
    });
    
    mealData.forEach(meal => {
        const date = meal.date ? meal.date.split('T')[0] : '';
        if (date) {
            mealsByDate[date] = (mealsByDate[date] || 0) + 1;
        }
    });
    
    // 生成數據集
    const workouts = dates.map(date => workoutsByDate[date] || 0);
    const meals = dates.map(date => mealsByDate[date] || 0);
    
    return {
        labels: dates.map(formatDateForDisplay),
        datasets: {
            week: {
                labels: dates.slice(-7).map(formatDateForDisplay),
                workouts: workouts.slice(-7),
                meals: meals.slice(-7)
            },
            month: {
                labels: dates.map(formatDateForDisplay),
                workouts: workouts,
                meals: meals
            },
            year: {
                // 模擬年度數據
                labels: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
                workouts: [5, 8, 12, 10, 15, 20, 18, 22, 25, 30, 28, workouts.reduce((a, b) => a + b, 0)],
                meals: [10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, meals.reduce((a, b) => a + b, 0)]
            }
        }
    };
}

// 生成健身數據
function generateFitnessData(workoutData) {
    // 計算卡路里消耗
    const caloriesByDate = {};
    const timeByDate = {};
    const workoutTypes = {};
    
    workoutData.forEach(workout => {
        if (!workout.date) return;
        
        const date = workout.date.split('T')[0];
        
        // 卡路里
        caloriesByDate[date] = (caloriesByDate[date] || 0) + (workout.calories || Math.floor(Math.random() * 300) + 100);
        
        // 時間
        timeByDate[date] = (timeByDate[date] || 0) + (workout.duration || Math.floor(Math.random() * 60) + 15);
        
        // 類型
        const type = workout.category || '其他';
        workoutTypes[type] = (workoutTypes[type] || 0) + 1;
    });
    
    // 獲取過去7天的日期
    const dates = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        dates.push(formatDate(date));
    }
    
    // 生成卡路里數據
    const caloriesData = {
        labels: dates.map(formatDateForDisplay),
        values: dates.map(date => caloriesByDate[date] || 0)
    };
    
    // 生成時間數據
    const timeData = {
        labels: dates.map(formatDateForDisplay),
        values: dates.map(date => timeByDate[date] || 0)
    };
    
    // 生成類型數據
    const workoutTypesData = {
        labels: Object.keys(workoutTypes).length > 0 ? Object.keys(workoutTypes) : ['有氧', '力量', '柔韌', '其他'],
        values: Object.keys(workoutTypes).length > 0 ? Object.values(workoutTypes) : [5, 3, 2, 1]
    };
    
    return {
        calories: caloriesData,
        time: timeData,
        types: workoutTypesData
    };
}

// 生成營養數據
function generateNutritionData(mealData) {
    // 計算宏量營養素
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;
    
    const caloriesByDate = {};
    
    mealData.forEach(meal => {
        if (!meal.date) return;
        
        const date = meal.date.split('T')[0];
        
        // 卡路里
        caloriesByDate[date] = (caloriesByDate[date] || 0) + (meal.calories || Math.floor(Math.random() * 500) + 200);
        
        // 宏量營養素
        totalProtein += meal.protein || Math.floor(Math.random() * 30) + 10;
        totalCarbs += meal.carbs || Math.floor(Math.random() * 50) + 20;
        totalFat += meal.fat || Math.floor(Math.random() * 20) + 5;
    });
    
    // 如果沒有數據，添加一些模擬數據
    if (mealData.length === 0) {
        totalProtein = 50;
        totalCarbs = 100;
        totalFat = 30;
    }
    
    // 獲取過去7天的日期
    const dates = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        dates.push(formatDate(date));
    }
    
    // 生成卡路里數據
    const caloriesData = {
        labels: dates.map(formatDateForDisplay),
        values: dates.map(date => caloriesByDate[date] || Math.floor(Math.random() * 500) + 1000)
    };
    
    // 生成宏量營養素數據
    const macrosData = {
        labels: ['蛋白質', '碳水化合物', '脂肪'],
        values: [totalProtein, totalCarbs, totalFat]
    };
    
    return {
        calories: caloriesData,
        macros: macrosData
    };
}

// 初始化圖表
function initializeCharts(userData) {
    try {
        // 活動趨勢圖表
        const activityChartCtx = document.getElementById('activity-chart').getContext('2d');
        const activityChart = new Chart(activityChartCtx, {
            type: 'bar',
            data: {
                labels: userData.activityData.datasets.week.labels,
                datasets: [
                    {
                        label: '健身',
                        data: userData.activityData.datasets.week.workouts,
                        backgroundColor: 'rgba(0, 195, 255, 0.7)',
                        borderColor: 'rgba(0, 195, 255, 1)',
                        borderWidth: 1
                    },
                    {
                        label: '餐食',
                        data: userData.activityData.datasets.week.meals,
                        backgroundColor: 'rgba(255, 0, 255, 0.7)',
                        borderColor: 'rgba(255, 0, 255, 1)',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.7)'
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.7)'
                        }
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            color: 'rgba(255, 255, 255, 0.7)'
                        }
                    }
                }
            }
        });
        
        // 卡路里消耗圖表
        const caloriesChartCtx = document.getElementById('calories-chart').getContext('2d');
        const caloriesChart = new Chart(caloriesChartCtx, {
            type: 'line',
            data: {
                labels: userData.fitnessData.calories.labels,
                datasets: [{
                    label: '卡路里消耗',
                    data: userData.fitnessData.calories.values,
                    backgroundColor: 'rgba(0, 195, 255, 0.2)',
                    borderColor: 'rgba(0, 195, 255, 1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.7)'
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.7)'
                        }
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            color: 'rgba(255, 255, 255, 0.7)'
                        }
                    }
                }
            }
        });
        
        // 運動時間圖表
        const timeChartCtx = document.getElementById('time-chart').getContext('2d');
        const timeChart = new Chart(timeChartCtx, {
            type: 'line',
            data: {
                labels: userData.fitnessData.time.labels,
                datasets: [{
                    label: '運動時間 (分鐘)',
                    data: userData.fitnessData.time.values,
                    backgroundColor: 'rgba(255, 0, 255, 0.2)',
                    borderColor: 'rgba(255, 0, 255, 1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.7)'
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.7)'
                        }
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            color: 'rgba(255, 255, 255, 0.7)'
                        }
                    }
                }
            }
        });
        
        // 運動類型圖表
        const workoutsChartCtx = document.getElementById('workouts-chart').getContext('2d');
        const workoutsChart = new Chart(workoutsChartCtx, {
            type: 'doughnut',
            data: {
                labels: userData.fitnessData.types.labels,
                datasets: [{
                    data: userData.fitnessData.types.values,
                    backgroundColor: [
                        'rgba(0, 195, 255, 0.7)',
                        'rgba(255, 0, 255, 0.7)',
                        'rgba(255, 255, 0, 0.7)',
                        'rgba(0, 255, 0, 0.7)'
                    ],
                    borderColor: [
                        'rgba(0, 195, 255, 1)',
                        'rgba(255, 0, 255, 1)',
                        'rgba(255, 255, 0, 1)',
                        'rgba(0, 255, 0, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            color: 'rgba(255, 255, 255, 0.7)'
                        }
                    }
                }
            }
        });
        
        // 宏量營養素圖表
        const macrosChartCtx = document.getElementById('macros-chart').getContext('2d');
        const macrosChart = new Chart(macrosChartCtx, {
            type: 'pie',
            data: {
                labels: userData.nutritionData.macros.labels,
                datasets: [{
                    data: userData.nutritionData.macros.values,
                    backgroundColor: [
                        'rgba(0, 195, 255, 0.7)',
                        'rgba(255, 0, 255, 0.7)',
                        'rgba(255, 255, 0, 0.7)'
                    ],
                    borderColor: [
                        'rgba(0, 195, 255, 1)',
                        'rgba(255, 0, 255, 1)',
                        'rgba(255, 255, 0, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            color: 'rgba(255, 255, 255, 0.7)'
                        }
                    }
                }
            }
        });
        
        // 營養卡路里圖表
        const nutritionCaloriesChartCtx = document.getElementById('nutrition-calories-chart').getContext('2d');
        const nutritionCaloriesChart = new Chart(nutritionCaloriesChartCtx, {
            type: 'bar',
            data: {
                labels: userData.nutritionData.calories.labels,
                datasets: [{
                    label: '卡路里攝入',
                    data: userData.nutritionData.calories.values,
                    backgroundColor: 'rgba(255, 0, 255, 0.7)',
                    borderColor: 'rgba(255, 0, 255, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.7)'
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.7)'
                        }
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            color: 'rgba(255, 255, 255, 0.7)'
                        }
                    }
                }
            }
        });
        
        // 保存圖表實例
        window.appCharts = {
            activityChart,
            caloriesChart,
            timeChart,
            workoutsChart,
            macrosChart,
            nutritionCaloriesChart
        };
    } catch (error) {
        console.error('初始化圖表時出錯:', error);
    }
}

// 設置事件監聽器
function setupEventListeners() {
    try {
        // 活動趨勢時間範圍切換
        document.querySelectorAll('.chart-control-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const period = btn.dataset.period;
                updateActivityChart(period);
                
                // 更新按鈕狀態
                document.querySelectorAll('.chart-control-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
        
        // 健身數據類型切換
        document.querySelectorAll('.fitness-control-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const type = btn.dataset.type;
                updateFitnessChartVisibility(type);
                
                // 更新按鈕狀態
                document.querySelectorAll('.fitness-control-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
        
        // 營養數據類型切換
        document.querySelectorAll('.nutrition-control-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const type = btn.dataset.type;
                updateNutritionChartVisibility(type);
                
                // 更新按鈕狀態
                document.querySelectorAll('.nutrition-control-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    } catch (error) {
        console.error('設置事件監聽器時出錯:', error);
    }
}

// 更新活動圖表
function updateActivityChart(period) {
    try {
        const userData = loadUserData();
        const chart = window.appCharts.activityChart;
        
        chart.data.labels = userData.activityData.datasets[period].labels;
        chart.data.datasets[0].data = userData.activityData.datasets[period].workouts;
        chart.data.datasets[1].data = userData.activityData.datasets[period].meals;
        
        chart.update();
    } catch (error) {
        console.error('更新活動圖表時出錯:', error);
    }
}

// 更新健身圖表可見性
function updateFitnessChartVisibility(type) {
    try {
        document.querySelectorAll('.fitness-chart-container').forEach(container => {
            container.classList.remove('active');
        });
        
        document.getElementById(`${type}-chart-container`).classList.add('active');
    } catch (error) {
        console.error('更新健身圖表可見性時出錯:', error);
    }
}

// 更新營養圖表可見性
function updateNutritionChartVisibility(type) {
    try {
        document.querySelectorAll('.nutrition-chart-container').forEach(container => {
            container.classList.remove('active');
        });
        
        document.getElementById(`${type}-chart-container`).classList.add('active');
    } catch (error) {
        console.error('更新營養圖表可見性時出錯:', error);
    }
}

// 輔助函數
function formatDate(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function formatDateForDisplay(dateStr) {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()}`;
}