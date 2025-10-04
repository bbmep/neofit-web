// 21天習慣挑戰追蹤器 JavaScript
document.addEventListener('DOMContentLoaded', () => {
    // 初始化變量
    const challengeDuration = 21; // 挑戰總天數
    let challengeData = loadChallengeData();
    let currentDate = new Date();
    
    // DOM元素
    const progressBar = document.querySelector('.progress');
    const dayCirclesContainer = document.querySelector('.day-circles');
    const currentDayElement = document.querySelector('.stat-value.current-day');
    const streakElement = document.querySelector('.stat-value.streak');
    const completionRateElement = document.querySelector('.stat-value.completion-rate');
    const taskListElement = document.querySelector('.task-list');
    const calendarDaysElement = document.querySelector('.calendar-days');
    const monthYearElement = document.querySelector('.month-year');
    const dayDetailModal = document.querySelector('.modal');
    const modalTitle = document.querySelector('.modal-title');
    const dayTasksElement = document.querySelector('.day-tasks');
    const closeModalBtn = document.querySelector('.close-modal');
    const rewardsContainer = document.querySelector('.rewards-container');
    
    // 初始化挑戰
    initializeChallenge();
    
    // 事件監聽器
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            dayDetailModal.classList.remove('active');
        });
    }
    
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('day-circle')) {
            const day = parseInt(e.target.dataset.day);
            showDayDetails(day);
        }
        
        if (e.target.classList.contains('calendar-day') && e.target.dataset.date) {
            const date = new Date(e.target.dataset.date);
            const challengeDay = getChallengeDay(date);
            if (challengeDay > 0 && challengeDay <= challengeDuration) {
                showDayDetails(challengeDay);
            }
        }
        
        if (e.target.classList.contains('task-check') || e.target.closest('.task-check')) {
            const taskItem = e.target.closest('.task-item');
            const taskId = taskItem.dataset.taskId;
            const day = parseInt(taskItem.dataset.day || getCurrentChallengeDay());
            toggleTaskCompletion(taskId, day);
        }
    });
    
    document.querySelectorAll('.calendar-nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const direction = btn.dataset.direction;
            navigateCalendar(direction);
        });
    });
    
    // 函數定義
    function initializeChallenge() {
        // 如果沒有挑戰數據，創建初始數據
        if (!challengeData) {
            challengeData = {
                startDate: formatDate(new Date()),
                currentDay: 1,
                streak: 0,
                completedDays: [],
                dailyTasks: {}
            };
            
            // 為每一天創建默認任務
            for (let i = 1; i <= challengeDuration; i++) {
                challengeData.dailyTasks[i] = [
                    { id: `day${i}_task1`, content: '完成30分鐘有氧運動', completed: false },
                    { id: `day${i}_task2`, content: '記錄一日三餐', completed: false },
                    { id: `day${i}_task3`, content: '喝足8杯水', completed: false },
                    { id: `day${i}_task4`, content: '與AI教練交流', completed: false }
                ];
            }
            
            saveChallengeData();
        }
        
        updateChallengeUI();
        renderDayCircles();
        renderTodayTasks();
        renderCalendar();
        updateRewards();
    }
    
    function updateChallengeUI() {
        const currentDay = getCurrentChallengeDay();
        const completedDaysCount = challengeData.completedDays.length;
        const completionRate = Math.round((completedDaysCount / Math.min(currentDay - 1, challengeDuration)) * 100) || 0;
        
        // 更新統計數據
        if (currentDayElement) currentDayElement.textContent = currentDay > challengeDuration ? challengeDuration : currentDay;
        if (streakElement) streakElement.textContent = challengeData.streak;
        if (completionRateElement) completionRateElement.textContent = `${completionRate}%`;
        
        // 更新進度條
        if (progressBar) {
            const progress = (Math.min(currentDay - 1, challengeDuration) / challengeDuration) * 100;
            progressBar.style.width = `${progress}%`;
        }
    }
    
    function renderDayCircles() {
        if (!dayCirclesContainer) return;
        
        dayCirclesContainer.innerHTML = '';
        const currentDay = getCurrentChallengeDay();
        
        for (let i = 1; i <= challengeDuration; i++) {
            const dayCircle = document.createElement('div');
            dayCircle.classList.add('day-circle');
            dayCircle.dataset.day = i;
            dayCircle.textContent = i;
            
            if (i < currentDay) {
                if (challengeData.completedDays.includes(i)) {
                    dayCircle.classList.add('completed');
                }
            } else if (i === currentDay) {
                dayCircle.classList.add('active');
            } else {
                dayCircle.classList.add('future');
            }
            
            dayCirclesContainer.appendChild(dayCircle);
        }
    }
    
    function renderTodayTasks() {
        if (!taskListElement) return;
        
        taskListElement.innerHTML = '';
        const currentDay = getCurrentChallengeDay();
        
        if (currentDay > challengeDuration) {
            taskListElement.innerHTML = '<p>恭喜你完成了21天挑戰！</p>';
            return;
        }
        
        const todayTasks = challengeData.dailyTasks[currentDay] || [];
        
        todayTasks.forEach(task => {
            const taskItem = document.createElement('div');
            taskItem.classList.add('task-item');
            if (task.completed) taskItem.classList.add('completed');
            taskItem.dataset.taskId = task.id;
            taskItem.dataset.day = currentDay;
            
            taskItem.innerHTML = `
                <div class="task-check">
                    <i class="fas fa-check"></i>
                </div>
                <div class="task-content">
                    <h3>${task.content}</h3>
                </div>
                <div class="task-status ${task.completed ? 'completed' : 'pending'}">
                    ${task.completed ? '已完成' : '待完成'}
                </div>
            `;
            
            taskListElement.appendChild(taskItem);
        });
    }
    
    function renderCalendar(date = new Date()) {
        if (!calendarDaysElement || !monthYearElement) return;
        
        const year = date.getFullYear();
        const month = date.getMonth();
        
        // 設置月份和年份
        const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
        monthYearElement.textContent = `${monthNames[month]} ${year}`;
        
        // 清空日曆
        calendarDaysElement.innerHTML = '';
        
        // 獲取當月第一天和最後一天
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        
        // 獲取當月第一天是星期幾（0是星期日）
        let firstDayOfWeek = firstDay.getDay();
        if (firstDayOfWeek === 0) firstDayOfWeek = 7; // 調整為星期一為一週的第一天
        
        // 獲取上個月的最後幾天
        const prevMonthLastDay = new Date(year, month, 0).getDate();
        
        // 填充上個月的日期
        for (let i = 1; i < firstDayOfWeek; i++) {
            const day = prevMonthLastDay - firstDayOfWeek + i + 1;
            const dayElement = createCalendarDay(new Date(year, month - 1, day), 'other-month');
            calendarDaysElement.appendChild(dayElement);
        }
        
        // 填充當月的日期
        for (let i = 1; i <= lastDay.getDate(); i++) {
            const currentDate = new Date(year, month, i);
            const classes = [];
            
            // 檢查是否是今天
            if (isToday(currentDate)) {
                classes.push('today');
            }
            
            // 檢查是否是挑戰日
            const challengeDay = getChallengeDay(currentDate);
            if (challengeDay > 0 && challengeDay <= challengeDuration) {
                classes.push('challenge-day');
                
                // 檢查是否是已完成的日期
                if (challengeData.completedDays.includes(challengeDay)) {
                    classes.push('completed-day');
                }
            }
            
            const dayElement = createCalendarDay(currentDate, ...classes);
            calendarDaysElement.appendChild(dayElement);
        }
        
        // 填充下個月的日期
        const daysAdded = firstDayOfWeek - 1 + lastDay.getDate();
        const remainingDays = 7 - (daysAdded % 7);
        if (remainingDays < 7) {
            for (let i = 1; i <= remainingDays; i++) {
                const dayElement = createCalendarDay(new Date(year, month + 1, i), 'other-month');
                calendarDaysElement.appendChild(dayElement);
            }
        }
    }
    
    function createCalendarDay(date, ...classes) {
        const dayElement = document.createElement('div');
        dayElement.classList.add('calendar-day', ...classes);
        dayElement.textContent = date.getDate();
        dayElement.dataset.date = formatDate(date);
        return dayElement;
    }
    
    function navigateCalendar(direction) {
        const currentMonth = monthYearElement.textContent;
        const [monthName, year] = currentMonth.split(' ');
        const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
        const monthIndex = monthNames.indexOf(monthName);
        
        let newDate;
        if (direction === 'prev') {
            newDate = new Date(parseInt(year), monthIndex - 1, 1);
        } else {
            newDate = new Date(parseInt(year), monthIndex + 1, 1);
        }
        
        renderCalendar(newDate);
    }
    
    function showDayDetails(day) {
        if (!dayDetailModal || !modalTitle || !dayTasksElement) return;
        
        const dayTasks = challengeData.dailyTasks[day] || [];
        const dayDate = getDayDate(day);
        
        modalTitle.textContent = `第 ${day} 天 - ${formatDateForDisplay(dayDate)}`;
        dayTasksElement.innerHTML = '';
        
        dayTasks.forEach(task => {
            const taskItem = document.createElement('div');
            taskItem.classList.add('task-item');
            if (task.completed) taskItem.classList.add('completed');
            taskItem.dataset.taskId = task.id;
            taskItem.dataset.day = day;
            
            taskItem.innerHTML = `
                <div class="task-check">
                    <i class="fas fa-check"></i>
                </div>
                <div class="task-content">
                    <h3>${task.content}</h3>
                </div>
                <div class="task-status ${task.completed ? 'completed' : 'pending'}">
                    ${task.completed ? '已完成' : '待完成'}
                </div>
            `;
            
            dayTasksElement.appendChild(taskItem);
        });
        
        dayDetailModal.classList.add('active');
    }
    
    function toggleTaskCompletion(taskId, day) {
        if (!challengeData.dailyTasks[day]) return;
        
        const taskIndex = challengeData.dailyTasks[day].findIndex(task => task.id === taskId);
        if (taskIndex === -1) return;
        
        challengeData.dailyTasks[day][taskIndex].completed = !challengeData.dailyTasks[day][taskIndex].completed;
        
        // 檢查當天所有任務是否已完成
        const allTasksCompleted = challengeData.dailyTasks[day].every(task => task.completed);
        
        // 更新已完成天數
        if (allTasksCompleted && !challengeData.completedDays.includes(day)) {
            challengeData.completedDays.push(day);
            challengeData.completedDays.sort((a, b) => a - b);
        } else if (!allTasksCompleted && challengeData.completedDays.includes(day)) {
            challengeData.completedDays = challengeData.completedDays.filter(d => d !== day);
        }
        
        // 更新連續天數
        updateStreak();
        
        // 保存數據並更新UI
        saveChallengeData();
        updateChallengeUI();
        renderDayCircles();
        renderTodayTasks();
        renderCalendar();
        updateRewards();
        
        // 如果是在模態框中，更新模態框內容
        if (document.querySelector('.modal.active')) {
            showDayDetails(day);
        }
    }
    
    function updateStreak() {
        let streak = 0;
        const currentDay = getCurrentChallengeDay();
        
        // 從當前天數向前檢查連續完成的天數
        for (let i = currentDay - 1; i >= 1; i--) {
            if (challengeData.completedDays.includes(i)) {
                streak++;
            } else {
                break;
            }
        }
        
        challengeData.streak = streak;
    }
    
    function updateRewards() {
        if (!rewardsContainer) return;
        
        const rewards = [
            { days: 3, title: '初學者', description: '連續完成3天挑戰', icon: 'fa-seedling' },
            { days: 7, title: '堅持一週', description: '連續完成7天挑戰', icon: 'fa-fire' },
            { days: 14, title: '半程達人', description: '連續完成14天挑戰', icon: 'fa-medal' },
            { days: 21, title: '習慣養成', description: '完成全部21天挑戰', icon: 'fa-trophy' }
        ];
        
        rewardsContainer.innerHTML = '';
        
        rewards.forEach(reward => {
            const isUnlocked = challengeData.streak >= reward.days || challengeData.completedDays.length >= reward.days;
            
            const rewardItem = document.createElement('div');
            rewardItem.classList.add('reward-item');
            if (isUnlocked) rewardItem.classList.add('unlocked');
            
            rewardItem.innerHTML = `
                <div class="reward-icon">
                    <i class="fas ${reward.icon}"></i>
                    <div class="days-required">${reward.days}</div>
                </div>
                <div class="reward-info">
                    <h3>${reward.title}</h3>
                    <p>${reward.description}</p>
                </div>
                <div class="reward-status ${isUnlocked ? 'unlocked' : ''}">
                    <i class="fas ${isUnlocked ? 'fa-unlock' : 'fa-lock'}"></i>
                </div>
            `;
            
            rewardsContainer.appendChild(rewardItem);
        });
    }
    
    // 輔助函數
    function getCurrentChallengeDay() {
        const startDate = new Date(challengeData.startDate);
        const today = new Date();
        
        // 重置時間部分以確保準確比較日期
        startDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);
        
        const diffTime = today - startDate;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
        
        return diffDays;
    }
    
    function getChallengeDay(date) {
        const startDate = new Date(challengeData.startDate);
        
        // 重置時間部分以確保準確比較日期
        startDate.setHours(0, 0, 0, 0);
        date.setHours(0, 0, 0, 0);
        
        const diffTime = date - startDate;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
        
        return diffDays;
    }
    
    function getDayDate(day) {
        const startDate = new Date(challengeData.startDate);
        return new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + day - 1);
    }
    
    function isToday(date) {
        const today = new Date();
        return date.getDate() === today.getDate() &&
               date.getMonth() === today.getMonth() &&
               date.getFullYear() === today.getFullYear();
    }
    
    function formatDate(date) {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    }
    
    function formatDateForDisplay(date) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('zh-TW', options);
    }
    
    function loadChallengeData() {
        const data = localStorage.getItem('neofit_challenge');
        return data ? JSON.parse(data) : null;
    }
    
    function saveChallengeData() {
        localStorage.setItem('neofit_challenge', JSON.stringify(challengeData));
        
        // 同時更新應用程序狀態中的挑戰數據
        const appState = JSON.parse(localStorage.getItem('neofit_app_state') || '{}');
        appState.challenge = {
            currentDay: getCurrentChallengeDay(),
            completedDays: challengeData.completedDays.length,
            streak: challengeData.streak
        };
        localStorage.setItem('neofit_app_state', JSON.stringify(appState));
        
        // 更新儀表板上的挑戰進度
        updateDashboardChallenge();
    }
    
    function updateDashboardChallenge() {
        // 檢查是否在儀表板頁面
        const dashboardChallengeProgress = document.querySelector('.dashboard .challenge-progress .progress');
        const dashboardChallengeDay = document.querySelector('.dashboard .challenge-day');
        const dashboardChallengeStreak = document.querySelector('.dashboard .challenge-streak');
        
        if (dashboardChallengeProgress) {
            const progress = (Math.min(getCurrentChallengeDay() - 1, challengeDuration) / challengeDuration) * 100;
            dashboardChallengeProgress.style.width = `${progress}%`;
        }
        
        if (dashboardChallengeDay) {
            dashboardChallengeDay.textContent = getCurrentChallengeDay() > challengeDuration ? challengeDuration : getCurrentChallengeDay();
        }
        
        if (dashboardChallengeStreak) {
            dashboardChallengeStreak.textContent = challengeData.streak;
        }
    }
});