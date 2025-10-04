// 餐食記錄頁面的JavaScript功能
document.addEventListener('DOMContentLoaded', function() {
    // 初始化變量
    let selectedMealType = null;
    let mealPhoto = null;
    const mealTypeButtons = document.querySelectorAll('.meal-type-btn');
    const uploadBtn = document.getElementById('upload-btn');
    const mealPhotoInput = document.getElementById('meal-photo');
    const mealPreview = document.getElementById('meal-preview');
    const uploadPlaceholder = document.getElementById('upload-placeholder');
    const analyzeBtn = document.getElementById('analyze-btn');
    const loadingModal = document.getElementById('loading-modal');
    const analysisResults = document.getElementById('analysis-results');
    const analysisPlaceholder = document.getElementById('analysis-placeholder');
    const saveBtn = document.getElementById('save-btn');
    const mealHistoryContainer = document.getElementById('meal-history-container');
    const emptyHistory = document.getElementById('empty-history');

    // 初始化餐食歷史
    initMealHistory();

    // 餐食類型選擇
    mealTypeButtons.forEach(button => {
        button.addEventListener('click', function() {
            mealTypeButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            selectedMealType = this.getAttribute('data-type');
            checkAnalyzeButtonState();
        });
    });

    // 照片上傳按鈕
    uploadBtn.addEventListener('click', function() {
        mealPhotoInput.click();
    });

    // 照片選擇處理
    mealPhotoInput.addEventListener('change', function(e) {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            mealPhoto = file;
            
            const reader = new FileReader();
            reader.onload = function(event) {
                mealPreview.src = event.target.result;
                mealPreview.style.display = 'block';
                uploadPlaceholder.style.display = 'none';
            };
            reader.readAsDataURL(file);
            
            checkAnalyzeButtonState();
        }
    });

    // 檢查分析按鈕狀態
    function checkAnalyzeButtonState() {
        if (selectedMealType && mealPhoto) {
            analyzeBtn.disabled = false;
        } else {
            analyzeBtn.disabled = true;
        }
    }

    // AI分析按鈕
    analyzeBtn.addEventListener('click', function() {
        // 顯示加載模態框
        loadingModal.classList.add('active');
        
        // 模擬AI分析過程（實際應用中，這裡會調用AI API）
        setTimeout(function() {
            // 隱藏加載模態框
            loadingModal.classList.remove('active');
            
            // 顯示分析結果
            analysisPlaceholder.style.display = 'none';
            analysisResults.style.display = 'block';
            
            // 生成模擬的分析結果
            generateMockAnalysis();
        }, 2000);
    });

    // 生成模擬的分析結果
    function generateMockAnalysis() {
        // 模擬卡路里數據
        const calories = Math.floor(Math.random() * 400) + 200;
        document.getElementById('calories-value').textContent = calories;
        
        // 模擬營養成分數據
        const protein = Math.floor(Math.random() * 30) + 10;
        const carbs = Math.floor(Math.random() * 50) + 20;
        const fat = Math.floor(Math.random() * 20) + 5;
        
        document.getElementById('protein-value').textContent = protein + 'g';
        document.getElementById('carbs-value').textContent = carbs + 'g';
        document.getElementById('fat-value').textContent = fat + 'g';
        
        // 設置營養條寬度
        const totalMacros = protein + carbs + fat;
        document.getElementById('protein-bar').style.width = (protein / totalMacros * 100) + '%';
        document.getElementById('carbs-bar').style.width = (carbs / totalMacros * 100) + '%';
        document.getElementById('fat-bar').style.width = (fat / totalMacros * 100) + '%';
        
        // 模擬AI反饋
        const feedbacks = [
            "這是一頓均衡的餐食！蛋白質含量適中，有助於肌肉恢復。",
            "碳水化合物含量較高，建議下次增加更多蔬菜來平衡營養。",
            "這頓餐食的脂肪含量適中，但可以考慮增加更多健康脂肪來源，如堅果或牛油果。",
            "蛋白質含量不錯！如果您的目標是增肌，這是一個很好的選擇。",
            "這頓餐食的營養成分相當均衡，非常適合您的健身目標。"
        ];
        
        const randomFeedback = feedbacks[Math.floor(Math.random() * feedbacks.length)];
        document.getElementById('ai-feedback').textContent = randomFeedback;
    }

    // 保存餐食記錄
    saveBtn.addEventListener('click', function() {
        // 獲取當前日期和時間
        const now = new Date();
        const dateStr = now.toLocaleDateString();
        const timeStr = now.toLocaleTimeString();
        
        // 獲取分析結果
        const calories = document.getElementById('calories-value').textContent;
        const mealNotes = document.getElementById('meal-notes').value || '無備註';
        
        // 創建餐食記錄對象
        const mealRecord = {
            id: Date.now(),
            type: selectedMealType,
            date: dateStr,
            time: timeStr,
            calories: calories,
            notes: mealNotes,
            photoUrl: mealPreview.src
        };
        
        // 保存到本地存儲
        saveMealToLocalStorage(mealRecord);
        
        // 更新餐食歷史顯示
        updateMealHistory();
        
        // 重置表單
        resetForm();
        
        // 顯示成功消息
        alert('餐食記錄已保存！');
    });

    // 保存餐食到本地存儲
    function saveMealToLocalStorage(meal) {
        let meals = JSON.parse(localStorage.getItem('neofit_meals')) || [];
        meals.push(meal);
        localStorage.setItem('neofit_meals', JSON.stringify(meals));
        
        // 更新每日任務
        updateDailyTask('meal_logged');
    }

    // 更新每日任務
    function updateDailyTask(taskType) {
        let userData = JSON.parse(localStorage.getItem('neofit_user_data')) || {};
        let dailyTasks = userData.dailyTasks || {};
        
        const today = new Date().toISOString().split('T')[0];
        dailyTasks[today] = dailyTasks[today] || {};
        dailyTasks[today][taskType] = true;
        
        userData.dailyTasks = dailyTasks;
        localStorage.setItem('neofit_user_data', JSON.stringify(userData));
    }

    // 初始化餐食歷史
    function initMealHistory() {
        const meals = JSON.parse(localStorage.getItem('neofit_meals')) || [];
        
        if (meals.length > 0) {
            emptyHistory.style.display = 'none';
            updateMealHistory();
        }
    }

    // 更新餐食歷史顯示
    function updateMealHistory() {
        const meals = JSON.parse(localStorage.getItem('neofit_meals')) || [];
        
        if (meals.length === 0) {
            emptyHistory.style.display = 'flex';
            return;
        }
        
        emptyHistory.style.display = 'none';
        
        // 清空歷史容器（除了空歷史提示）
        const historyItems = mealHistoryContainer.querySelectorAll('.meal-card');
        historyItems.forEach(item => item.remove());
        
        // 按時間倒序排序
        const sortedMeals = meals.sort((a, b) => b.id - a.id);
        
        // 顯示最近的10個餐食記錄
        const recentMeals = sortedMeals.slice(0, 10);
        
        // 創建餐食卡片
        recentMeals.forEach(meal => {
            const mealCard = createMealCard(meal);
            mealHistoryContainer.appendChild(mealCard);
        });
    }

    // 創建餐食卡片
    function createMealCard(meal) {
        const mealCard = document.createElement('div');
        mealCard.className = 'meal-card';
        
        // 將餐食類型轉換為中文
        const mealTypeMap = {
            'breakfast': '早餐',
            'lunch': '午餐',
            'dinner': '晚餐',
            'snack': '點心'
        };
        
        const mealTypeName = mealTypeMap[meal.type] || meal.type;
        
        mealCard.innerHTML = `
            <img src="${meal.photoUrl}" alt="${mealTypeName}" class="meal-card-img">
            <div class="meal-card-content">
                <div class="meal-card-header">
                    <span class="meal-type">${mealTypeName}</span>
                    <span class="meal-date">${meal.date}</span>
                </div>
                <div class="meal-calories">${meal.calories} kcal</div>
            </div>
        `;
        
        // 點擊卡片顯示詳細信息
        mealCard.addEventListener('click', function() {
            alert(`餐食詳情：\n類型：${mealTypeName}\n日期：${meal.date} ${meal.time}\n卡路里：${meal.calories} kcal\n備註：${meal.notes}`);
        });
        
        return mealCard;
    }

    // 重置表單
    function resetForm() {
        // 重置餐食類型
        mealTypeButtons.forEach(btn => btn.classList.remove('active'));
        selectedMealType = null;
        
        // 重置照片
        mealPhoto = null;
        mealPreview.src = '#';
        mealPreview.style.display = 'none';
        uploadPlaceholder.style.display = 'flex';
        mealPhotoInput.value = '';
        
        // 重置備註
        document.getElementById('meal-notes').value = '';
        
        // 重置分析按鈕
        analyzeBtn.disabled = true;
        
        // 隱藏分析結果
        analysisResults.style.display = 'none';
        analysisPlaceholder.style.display = 'flex';
    }
});