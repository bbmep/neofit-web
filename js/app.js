// app.js

// 頁面導覽控制

// 主題切換功能與個人資料設定
document.addEventListener('DOMContentLoaded', () => {
    // 初始化主題
    const savedTheme = localStorage.getItem('neofit-theme') || 'blue';
    document.body.classList.add(`theme-${savedTheme}`);
    
    // 檢查是否已設定個人資料
    const profileData = localStorage.getItem('neofit-profile');
    const dashboardPage = document.getElementById('dashboard');
    const profileSetupPage = document.getElementById('profile-setup');
    
    // 如果沒有個人資料，顯示設定頁面
    if (!profileData && profileSetupPage && dashboardPage) {
        profileSetupPage.classList.add('active');
        dashboardPage.classList.remove('active');
    } else if (dashboardPage) {
        dashboardPage.classList.add('active');
    }
    
    // 主題切換按鈕
    const themeToggle = document.getElementById('theme-toggle');
    const themeOptions = document.getElementById('theme-options');
    
    // 設置主題切換按鈕顏色
    function updateThemeButtonColor() {
        const currentTheme = localStorage.getItem('neofit-theme') || 'blue';
        if (themeToggle) {
            themeToggle.style.backgroundColor = currentTheme === 'blue' ? '#00F0FF' : 
                                               currentTheme === 'red' ? '#FF3366' : 
                                               currentTheme === 'green' ? '#00FF66' : 
                                               '#8A2BE2';
        }
    }
    
    // 初始化主題按鈕顏色
    updateThemeButtonColor();
    
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            themeOptions.style.display = themeOptions.style.display === 'block' ? 'none' : 'block';
        });
        
        // 點擊其他地方關閉選單
        document.addEventListener('click', (e) => {
            if (!themeToggle.contains(e.target) && !themeOptions.contains(e.target)) {
                themeOptions.style.display = 'none';
            }
        });
    }
    
    // 主題選項點擊事件
    const themeOptionElements = document.querySelectorAll('.theme-option');
    themeOptionElements.forEach(option => {
        option.addEventListener('click', () => {
            const theme = option.dataset.theme;
            
            // 移除所有主題類
            document.body.classList.remove('theme-blue', 'theme-red', 'theme-green');
            
            // 添加選中的主題類
            document.body.classList.add(`theme-${theme}`);
            
            // 更新主題按鈕顏色
            updateThemeButtonColor();
            
            // 保存到本地存儲
            localStorage.setItem('neofit-theme', theme);
            
            // 關閉選單
            themeOptions.style.display = 'none';
            
            // 廣播主題變更事件，讓所有頁面都能響應
            const themeChangeEvent = new CustomEvent('neofit-theme-change', { 
                detail: { theme: theme } 
            });
            window.dispatchEvent(themeChangeEvent);
        });
    });
});

// 監聽主題變更事件，確保全局即時生效
window.addEventListener('neofit-theme-change', (e) => {
    const theme = e.detail.theme;
    // 更新所有頁面的主題
    document.body.classList.remove('theme-blue', 'theme-red', 'theme-green');
    document.body.classList.add(`theme-${theme}`);
    
    // 更新主題按鈕顏色
    const themeToggles = document.querySelectorAll('.theme-btn');
    themeToggles.forEach(btn => {
        btn.style.backgroundColor = theme === 'blue' ? '#00F0FF' : 
                                   theme === 'red' ? '#FF3366' : 
                                   theme === 'green' ? '#00FF66' : 
                                   '#8A2BE2';
    });
});

// 處理個人資料表單提交
const profileForm = document.getElementById('profile-form');
if (profileForm) {
    profileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // 獲取表單數據
        const name = document.getElementById('user-name').value;
        const height = document.getElementById('user-height').value;
        const weight = document.getElementById('user-weight').value;
        const goalElement = document.querySelector('input[name="fitness-goal"]:checked');
        
        // 驗證所有必填字段
        if (!name || !height || !weight || !goalElement) {
            alert('請填寫所有必填字段');
            return;
        }
        
        const goal = goalElement.value;
        
        // 保存個人資料到本地存儲
        const profileData = {
            name,
            height,
            weight,
            goal,
            createdAt: new Date().toISOString()
        };
        
        localStorage.setItem('neofit-profile', JSON.stringify(profileData));
        
        // 切換到儀表板頁面
        const profileSetupPage = document.getElementById('profile-setup');
        const dashboardPage = document.getElementById('dashboard');
        
        if (profileSetupPage && dashboardPage) {
            profileSetupPage.classList.remove('active');
            dashboardPage.classList.add('active');
        }
    });
}

// onboarding 多步驟表單控制
document.addEventListener('DOMContentLoaded', () => {
    // 檢查是否已完成onboarding
    const onboardingCompleted = localStorage.getItem('onboarding-completed');
    
    if (!onboardingCompleted) {
        // 顯示onboarding頁面
        document.getElementById('onboarding').classList.add('active');
        document.getElementById('dashboard').classList.remove('active');
    }
    
    // 目標卡片選擇
    document.querySelectorAll('.goal-card').forEach(card => {
        card.addEventListener('click', () => {
            // 移除所有卡片的active類
            document.querySelectorAll('.goal-card').forEach(c => {
                c.classList.remove('active');
            });
            
            // 添加當前卡片的active類
            card.classList.add('active');
        });
    });
    
    // 天數按鈕選擇
    document.querySelectorAll('.day-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            // 移除所有按鈕的active類
            document.querySelectorAll('.day-btn').forEach(b => {
                b.classList.remove('active');
            });
            
            // 添加當前按鈕的active類
            btn.classList.add('active');
        });
    });
    
    // 完成onboarding按鈕
    const completeBtn = document.getElementById('complete-onboarding');
    if (completeBtn) {
        completeBtn.addEventListener('click', () => {
            // 保存onboarding狀態
            localStorage.setItem('onboarding-completed', 'true');
            
            // 隱藏onboarding頁面，顯示儀表板
            document.getElementById('onboarding').classList.remove('active');
            document.getElementById('dashboard').classList.add('active');
        });
    }
});

document.querySelectorAll(".next-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        const nextStep = btn.dataset.next;
        document.querySelectorAll(".onboarding-step").forEach(step => step.classList.remove("active"));
        document.getElementById(`step${nextStep}`).classList.add("active");

        updateProgress(nextStep);
    });
});

document.querySelectorAll(".back-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        const prevStep = btn.dataset.prev;
        document.querySelectorAll(".onboarding-step").forEach(step => step.classList.remove("active"));
        document.getElementById(`step${prevStep}`).classList.add("active");

        updateProgress(prevStep);
    });
});

function updateProgress(step) {
    const steps = document.querySelectorAll(".step");
    steps.forEach((s, idx) => {
        if (idx < step) {
            s.classList.add("active");
        } else {
            s.classList.remove("active");
        }
    });

    const progressBar = document.querySelector(".progress");
    progressBar.style.width = `${(step - 1) * 33}%`;
}

// 完成 onboarding → 顯示 dashboard
document.querySelector(".complete-btn").addEventListener("click", () => {
    document.getElementById("onboarding").classList.remove("active");
    document.getElementById("dashboard").classList.add("active");
});
