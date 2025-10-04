// workouts.js - 健身頁面功能

// 健身課程數據
const workoutData = [
    {
        id: 1,
        title: "全身高強度間歇訓練",
        category: "cardio",
        duration: "30 分鐘",
        level: "中級",
        calories: "300-400",
        description: "這個高強度間歇訓練結合了心肺和力量訓練，能在短時間內有效燃燒脂肪。",
        image: "images/workout-hiit.jpg"
    },
    {
        id: 2,
        title: "核心肌群強化",
        category: "strength",
        duration: "25 分鐘",
        level: "初級",
        calories: "200-250",
        description: "專注於腹部、背部和臀部的核心肌群訓練，幫助改善姿勢和穩定性。",
        image: "images/workout-core.jpg"
    },
    {
        id: 3,
        title: "上肢力量訓練",
        category: "strength",
        duration: "40 分鐘",
        level: "進階",
        calories: "350-450",
        description: "針對手臂、肩膀和胸部的全面訓練，幫助增加上半身肌肉量和力量。",
        image: "images/workout-upper.jpg"
    },
    {
        id: 4,
        title: "瑜伽伸展",
        category: "flexibility",
        duration: "35 分鐘",
        level: "所有級別",
        calories: "150-200",
        description: "結合呼吸和伸展動作，幫助增加柔韌性、減輕壓力並改善身體平衡。",
        image: "images/workout-yoga.jpg"
    },
    {
        id: 5,
        title: "下肢力量訓練",
        category: "strength",
        duration: "45 分鐘",
        level: "中級",
        calories: "400-500",
        description: "專注於腿部和臀部的訓練，幫助增強下半身力量和肌肉耐力。",
        image: "images/workout-lower.jpg"
    },
    {
        id: 6,
        title: "有氧舞蹈",
        category: "cardio",
        duration: "30 分鐘",
        level: "初級",
        calories: "250-350",
        description: "結合舞蹈和有氧運動的有趣訓練，幫助提高心肺功能並燃燒卡路里。",
        image: "images/workout-dance.jpg"
    }
];

// 初始化頁面
document.addEventListener('DOMContentLoaded', () => {
    // 確保DOM元素已加載
    setTimeout(() => {
        // 載入所有健身課程
        loadWorkouts('all');
        
        // 分類按鈕事件監聽
        const categoryButtons = document.querySelectorAll('.category-btn');
        categoryButtons.forEach(button => {
            button.addEventListener('click', () => {
                // 移除所有按鈕的active類
                categoryButtons.forEach(btn => btn.classList.remove('active'));
                // 添加當前按鈕的active類
                button.classList.add('active');
                // 載入對應分類的健身課程
                loadWorkouts(button.dataset.category);
            });
        });
        
        // 模態框關閉按鈕
        const closeBtn = document.querySelector('.close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                document.getElementById('workout-modal').style.display = 'none';
            });
        }
        
        // 創建模態框如果不存在
        if (!document.getElementById('workout-modal')) {
            const modal = document.createElement('div');
            modal.id = 'workout-modal';
            modal.className = 'modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <span class="close-btn">&times;</span>
                    <div id="workout-detail-content"></div>
                </div>
            `;
            document.body.appendChild(modal);
            
            // 添加關閉按鈕事件
            modal.querySelector('.close-btn').addEventListener('click', () => {
                modal.style.display = 'none';
            });
        }
    }, 100); // 短暫延遲確保DOM完全加載
});

// 載入健身課程
function loadWorkouts(category) {
    const workoutGrid = document.querySelector('.workout-grid');
    
    // 清空網格
// 打開健身詳情
function openWorkoutDetail(workoutId) {
    const workout = workoutData.find(w => w.id === workoutId);
    if (!workout) return;
    
    const detailContent = document.getElementById('workout-detail-content');
    detailContent.innerHTML = `
        <div class="workout-detail">
            <h2>${workout.title}</h2>
            <div class="workout-detail-image">
                <img src="${workout.image}" alt="${workout.title}">
            </div>
            <div class="workout-detail-info">
                <p><strong>時長:</strong> ${workout.duration}</p>
                <p><strong>難度:</strong> ${workout.level}</p>
                <p><strong>卡路里:</strong> ${workout.calories}</p>
                <p><strong>描述:</strong> ${workout.description}</p>
            </div>
            <button class="btn start-workout-btn">開始訓練</button>
        </div>
    `;
    
    // 添加開始訓練按鈕事件
    const startBtn = detailContent.querySelector('.start-workout-btn');
    startBtn.addEventListener('click', () => {
        // 這裡可以添加開始訓練的邏輯，例如顯示訓練計時器等
        alert('訓練開始！');
        document.getElementById('workout-modal').style.display = 'none';
    });
    
    // 顯示模態框
    document.getElementById('workout-modal').style.display = 'block';
}

    // 過濾課程
    const filteredWorkouts = category === 'all' 
        ? workoutData 
        : workoutData.filter(workout => workout.category === category);
    
    // 創建課程卡片
    filteredWorkouts.forEach(workout => {
        const workoutCard = document.createElement('div');
        workoutCard.className = 'workout-card';
        workoutCard.innerHTML = `
            <div class="workout-card-image">
                <img src="${workout.image}" alt="${workout.title}">
            </div>
            <div class="workout-card-content">
                <h3>${workout.title}</h3>
                <div class="workout-info">
                    <span>${workout.duration}</span>
                    <span>${workout.level}</span>
                </div>
                <button class="btn workout-btn" data-id="${workout.id}">開始訓練</button>
            </div>
        `;
        workoutGrid.appendChild(workoutCard);
        
        // 添加按鈕點擊事件
        const button = workoutCard.querySelector('.workout-btn');
        button.addEventListener('click', () => {
            openWorkoutDetail(workout.id);
        });
    });
}
    workoutGrid.innerHTML = '';
    
    // 過濾課程
    const filteredWorkouts = category === 'all' 
        ? workoutData 
        : workoutData.filter(workout => workout.category === category);
    
    // 如果沒有找到課程
    if (filteredWorkouts.length === 0) {
        workoutGrid.innerHTML = '<p class="no-results">沒有找到符合條件的健身課程</p>';
        return;
    }
    
    // 創建課程卡片
    filteredWorkouts.forEach(workout => {
        const workoutCard = document.createElement('div');
        workoutCard.className = 'workout-card';
        workoutCard.dataset.id = workout.id;
        
        workoutCard.innerHTML = `
            <div class="workout-card-image">
                <img src="${workout.image || 'images/workout-placeholder.jpg'}" alt="${workout.title}">
            </div>
            <div class="workout-card-content">
                <h3>${workout.title}</h3>
                <div class="workout-card-meta">
                    <span>${workout.duration}</span>
                    <span>難度: ${workout.level}</span>
                </div>
                <p class="workout-card-description">${workout.description}</p>
                <button class="btn workout-card-btn">開始訓練</button>
            </div>
        `;
        
        // 添加點擊事件
        workoutCard.addEventListener('click', () => {
            openWorkoutDetail(workout);
        });
        
        workoutGrid.appendChild(workoutCard);
    });
}

// 打開健身課程詳情
function openWorkoutDetail(workout) {
    const modal = document.getElementById('workout-modal');
    const detailContent = modal.querySelector('.workout-detail');
    
    detailContent.innerHTML = `
        <h2 class="neon-text">${workout.title}</h2>
        <div class="workout-detail-meta">
            <div class="meta-item">
                <span class="meta-label">時長:</span>
                <span class="meta-value">${workout.duration}</span>
            </div>
            <div class="meta-item">
                <span class="meta-label">難度:</span>
                <span class="meta-value">${workout.level}</span>
            </div>
            <div class="meta-item">
                <span class="meta-label">卡路里:</span>
                <span class="meta-value">${workout.calories}</span>
            </div>
        </div>
        <p class="workout-description">${workout.description}</p>
        <div class="workout-actions">
            <button class="btn start-workout-btn">開始訓練</button>
            <button class="btn save-workout-btn">保存到我的計劃</button>
        </div>
    `;
    
    modal.style.display = 'block';
}