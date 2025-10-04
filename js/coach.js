// AI教練頁面的JavaScript功能
document.addEventListener('DOMContentLoaded', function() {
    // 初始化變量
    const chatMessages = document.getElementById('chat-messages');
    const userMessageInput = document.getElementById('user-message');
    const sendBtn = document.getElementById('send-btn');
    const topicButtons = document.querySelectorAll('.topic-btn');
    const thinkingIndicator = document.getElementById('thinking-indicator');
    
    // 用戶數據
    let userData = JSON.parse(localStorage.getItem('neofit_user_data')) || {};
    
    // 預設回覆
    const defaultResponses = {
        workout: [
            "根據您的資料，我推薦您嘗試HIIT訓練。這種高強度間歇訓練非常適合在短時間內燃燒卡路里。",
            "考慮到您的目標，我建議您每週進行3-4次力量訓練，專注於複合動作如深蹲、硬拉和臥推。",
            "您的身體數據顯示您可能適合進行中等強度的有氧運動，如快走或慢跑，每週至少150分鐘。"
        ],
        nutrition: [
            "分析您最近的餐食記錄，我注意到您的蛋白質攝入可能不足。考慮增加雞胸肉、魚類或豆類等優質蛋白質來源。",
            "您的碳水化合物攝入似乎偏高。建議增加更多蔬菜，減少精製碳水化合物如白麵包和糖。",
            "您的飲食模式顯示您可能需要更多健康脂肪。嘗試增加牛油果、堅果和橄欖油等食物。"
        ],
        progress: [
            "您的進度非常出色！過去一週，您完成了85%的計劃運動，這比上週提高了10%。",
            "您的餐食記錄顯示您正在逐漸改善飲食習慣。特別是，您的蛋白質攝入增加了15%。",
            "根據您的數據，您的體重已經開始朝著目標方向發展。保持這種趨勢，您將在預期時間內達成目標。"
        ],
        motivation: [
            "記住，每一次運動都是對未來自己的投資。即使只有短短20分鐘，也比不做要好得多。",
            "進步不總是線性的。有時候您可能會感到停滯，但只要堅持下去，突破就會到來。",
            "您已經比昨天的自己更強大了。專注於自己的進步，而不是與他人比較。"
        ],
        tips: [
            "確保在運動前充分熱身，運動後拉伸。這可以減少受傷風險並促進恢復。",
            "睡眠對於健身進步至關重要。每晚嘗試獲得7-9小時的優質睡眠。",
            "保持水分對於運動表現和整體健康都很重要。每天至少喝2升水。"
        ]
    };
    
    // 初始化
    init();
    
    // 初始化函數
    function init() {
        // 設置事件監聽器
        sendBtn.addEventListener('click', sendMessage);
        userMessageInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
        
        // 設置話題按鈕事件
        topicButtons.forEach(button => {
            button.addEventListener('click', function() {
                const topic = this.getAttribute('data-topic');
                userMessageInput.value = this.textContent;
                sendMessage(topic);
            });
        });
        
        // 如果有用戶名，更新歡迎消息
        if (userData.name) {
            updateWelcomeMessage();
        }
    }
    
    // 更新歡迎消息
    function updateWelcomeMessage() {
        const firstMessage = chatMessages.querySelector('.message-text');
        if (firstMessage) {
            firstMessage.innerHTML = `
                <p>嗨，${userData.name}！我是NEO，您的個人健身AI教練。我會幫助您達成健身目標，回答您的問題，並提供個性化的建議。</p>
                <p>您今天想談些什麼？可以問我關於運動、營養、進度追蹤或任何健身相關的問題。</p>
            `;
        }
    }
    
    // 發送消息
    function sendMessage(predefinedTopic = null) {
        const message = predefinedTopic || userMessageInput.value.trim();
        
        if (message) {
            // 添加用戶消息到聊天
            addUserMessage(userMessageInput.value);
            
            // 清空輸入框
            userMessageInput.value = '';
            
            // 顯示AI思考中動畫
            thinkingIndicator.classList.add('active');
            
            // 模擬AI回覆（延遲以模擬思考）
            setTimeout(() => {
                // 隱藏思考動畫
                thinkingIndicator.classList.remove('active');
                
                // 生成AI回覆
                let response;
                
                if (predefinedTopic && defaultResponses[predefinedTopic]) {
                    // 使用預定義回覆
                    const responses = defaultResponses[predefinedTopic];
                    response = responses[Math.floor(Math.random() * responses.length)];
                } else {
                    // 分析用戶消息並生成回覆
                    response = generateResponse(message);
                }
                
                // 添加AI回覆到聊天
                addCoachMessage(response);
                
                // 滾動到底部
                scrollToBottom();
            }, 1500);
        }
    }
    
    // 添加用戶消息
    function addUserMessage(message) {
        const now = new Date();
        const timeString = now.getHours() + ':' + now.getMinutes().toString().padStart(2, '0');
        
        const messageHTML = `
            <div class="message user-message">
                <div class="message-avatar">
                    <div class="user-avatar"></div>
                </div>
                <div class="message-content">
                    <div class="message-header">
                        <span class="message-time">${timeString}</span>
                        <span class="message-sender">${userData.name || '您'}</span>
                    </div>
                    <div class="message-text">
                        <p>${message}</p>
                    </div>
                </div>
            </div>
        `;
        
        chatMessages.insertAdjacentHTML('beforeend', messageHTML);
        scrollToBottom();
    }
    
    // 添加教練消息
    function addCoachMessage(message) {
        const now = new Date();
        const timeString = now.getHours() + ':' + now.getMinutes().toString().padStart(2, '0');
        
        const messageHTML = `
            <div class="message coach-message">
                <div class="message-avatar">
                    <img src="images/ai-coach.svg" alt="AI教練">
                </div>
                <div class="message-content">
                    <div class="message-header">
                        <span class="message-sender">NEO</span>
                        <span class="message-time">${timeString}</span>
                    </div>
                    <div class="message-text">
                        <p>${message}</p>
                    </div>
                </div>
            </div>
        `;
        
        chatMessages.insertAdjacentHTML('beforeend', messageHTML);
        scrollToBottom();
        
        // 更新每日任務
        updateDailyTask('coach_interaction');
    }
    
    // 生成回覆
    function generateResponse(message) {
        // 關鍵詞匹配
        message = message.toLowerCase();
        
        if (message.includes('運動') || message.includes('鍛煉') || message.includes('workout')) {
            return defaultResponses.workout[Math.floor(Math.random() * defaultResponses.workout.length)];
        }
        else if (message.includes('飲食') || message.includes('營養') || message.includes('吃') || message.includes('食物')) {
            return defaultResponses.nutrition[Math.floor(Math.random() * defaultResponses.nutrition.length)];
        }
        else if (message.includes('進度') || message.includes('進展') || message.includes('成果')) {
            return defaultResponses.progress[Math.floor(Math.random() * defaultResponses.progress.length)];
        }
        else if (message.includes('動力') || message.includes('激勵') || message.includes('懶') || message.includes('不想')) {
            return defaultResponses.motivation[Math.floor(Math.random() * defaultResponses.motivation.length)];
        }
        else if (message.includes('建議') || message.includes('提示') || message.includes('技巧') || message.includes('怎麼做')) {
            return defaultResponses.tips[Math.floor(Math.random() * defaultResponses.tips.length)];
        }
        else {
            // 默認回覆
            const defaultReplies = [
                "這是個很好的問題。根據您的健身目標，我建議您專注於保持一致性，無論是運動還是飲食。",
                "謝謝您的提問。健康的生活方式是一場馬拉松，而不是短跑。小的、可持續的改變往往比激進的改變更有效。",
                "這是個有趣的話題。記住，每個人的身體都是獨特的，所以最重要的是找到適合您的方法。",
                "我理解您的疑問。在健身旅程中，監測進度和根據需要調整計劃是非常重要的。",
                "很高興您問這個問題。保持水分、充足的睡眠和適當的營養對於任何健身計劃都是基礎。"
            ];
            
            return defaultReplies[Math.floor(Math.random() * defaultReplies.length)];
        }
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
    
    // 滾動到底部
    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
});