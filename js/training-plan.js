// 訓練計劃生成器
document.addEventListener('DOMContentLoaded', function() {
    // 獲取DOM元素
    const trainingForm = document.getElementById('training-form');
    const trainingResult = document.getElementById('training-result');
    const generateBtn = document.getElementById('generate-plan');
    const saveRecordBtn = document.getElementById('save-record');
    const planDetails = document.getElementById('plan-details');
    const recordTable = document.getElementById('record-table');
    const recordBody = document.getElementById('record-body');
    
    // 如果頁面上有這些元素，則添加事件監聽器
    if (generateBtn) {
        generateBtn.addEventListener('click', generateTrainingPlan);
    }
    
    if (saveRecordBtn) {
        saveRecordBtn.addEventListener('click', saveTrainingRecord);
    }
    
    // 生成訓練計劃
    function generateTrainingPlan() {
        // 獲取用戶輸入
        const gender = document.getElementById('gender').value;
        const age = parseInt(document.getElementById('age').value);
        const height = parseInt(document.getElementById('height').value);
        const weight = parseInt(document.getElementById('weight').value);
        const goal = document.getElementById('fitness-goal').value;
        const availableTime = parseInt(document.getElementById('available-time').value);
        const equipment = document.getElementById('equipment').value;
        
        // 驗證輸入
        if (!gender || !age || !height || !weight || !goal || !availableTime || !equipment) {
            alert('請填寫所有必填字段');
            return;
        }
        
        // 根據用戶資料生成訓練計劃
        const plan = createPersonalizedPlan(gender, age, height, weight, goal, availableTime, equipment);
        
        // 顯示訓練計劃
        displayTrainingPlan(plan);
        
        // 顯示結果區域
        trainingResult.classList.remove('hidden');
        
        // 生成記錄表格
        generateRecordTable(plan.exercises);
        
        // 滾動到結果區域
        trainingResult.scrollIntoView({ behavior: 'smooth' });
    }
    
    // 創建個性化訓練計劃
    function createPersonalizedPlan(gender, age, height, weight, goal, availableTime, equipment) {
        // 計算BMI
        const bmi = weight / ((height / 100) * (height / 100));
        
        // 初始化計劃對象
        let plan = {
            goal: '',
            totalTime: 0,
            exercises: [],
            warmup: '',
            cooldown: '',
            advanced: []
        };
        
        // 根據健身目標設置訓練重點
        switch(goal) {
            case '增肌':
                plan.goal = '增加肌肉質量和力量';
                plan = generateMuscleGainPlan(gender, age, bmi, availableTime, equipment);
                break;
            case '減脂':
                plan.goal = '減少體脂率，提高代謝';
                plan = generateFatLossPlan(gender, age, bmi, availableTime, equipment);
                break;
            case '身形雕塑':
                plan.goal = '塑造肌肉線條，提高肌肉質量';
                plan = generateBodySculptingPlan(gender, age, bmi, availableTime, equipment);
                break;
            case '提高體能':
                plan.goal = '提高心肺功能和整體體能水平';
                plan = generateEndurancePlan(gender, age, bmi, availableTime, equipment);
                break;
            default:
                plan.goal = '全面提升身體素質';
                plan = generateGeneralFitnessPlan(gender, age, bmi, availableTime, equipment);
        }
        
        return plan;
    }
    
    // 增肌訓練計劃
    function generateMuscleGainPlan(gender, age, bmi, availableTime, equipment) {
        let plan = {
            goal: '增加肌肉質量和力量',
            totalTime: Math.min(availableTime, 90),
            exercises: [],
            warmup: '5-10分鐘有氧熱身（快走、輕跑或跳繩），然後進行動態伸展（手臂繞環、髖關節繞環、深蹲預備動作）',
            cooldown: '5分鐘靜態伸展，針對訓練過的肌群進行拉伸',
            advanced: []
        };
        
        // 根據器材選擇適合的訓練動作
        if (equipment === '全套器材' || equipment === '啞鈴') {
            // 胸部/背部/腿部/肩部/手臂訓練
            plan.exercises = [
                { name: '槓鈴臥推（胸部）', sets: 4, reps: '8-10', weight: gender === '男' ? '60-80kg' : '30-40kg' },
                { name: '啞鈴划船（背部）', sets: 4, reps: '10-12', weight: gender === '男' ? '20-25kg' : '10-15kg' },
                { name: '深蹲（腿部）', sets: 4, reps: '8-10', weight: gender === '男' ? '80-100kg' : '40-60kg' },
                { name: '啞鈴肩推（肩部）', sets: 3, reps: '10-12', weight: gender === '男' ? '15-20kg' : '7.5-10kg' },
                { name: '二頭彎舉（手臂）', sets: 3, reps: '12-15', weight: gender === '男' ? '15-20kg' : '7.5-10kg' }
            ];
            
            // 進階訓練建議
            plan.advanced = [
                '超級組訓練：將兩個不同肌群的動作連續進行，中間不休息',
                '漸減組訓練：從較重的重量開始，每組減少重量但增加次數',
                '離心訓練：專注於動作的下放階段，控制速度增加肌肉刺激'
            ];
        } else if (equipment === '彈力帶') {
            plan.exercises = [
                { name: '彈力帶臥推（胸部）', sets: 4, reps: '12-15', weight: '中/高阻力彈力帶' },
                { name: '彈力帶划船（背部）', sets: 4, reps: '12-15', weight: '中/高阻力彈力帶' },
                { name: '彈力帶深蹲（腿部）', sets: 4, reps: '15-20', weight: '高阻力彈力帶' },
                { name: '彈力帶肩推（肩部）', sets: 3, reps: '12-15', weight: '中阻力彈力帶' },
                { name: '彈力帶二頭彎舉（手臂）', sets: 3, reps: '15-20', weight: '中阻力彈力帶' }
            ];
            
            plan.advanced = [
                '複合彈力帶訓練：同時使用多條彈力帶增加阻力',
                '脈衝訓練：在動作頂點進行小幅度脈衝增加肌肉刺激',
                '等長收縮：在動作頂點保持姿勢10-15秒'
            ];
        } else { // 自重
            plan.exercises = [
                { name: '俯臥撐（胸部）', sets: 4, reps: '15-20', weight: '自重' },
                { name: '引體向上/反向划船（背部）', sets: 4, reps: '8-12', weight: '自重' },
                { name: '深蹲跳（腿部）', sets: 4, reps: '15-20', weight: '自重' },
                { name: '倒立俯臥撐/派克推舉（肩部）', sets: 3, reps: '10-15', weight: '自重' },
                { name: '窄距俯臥撐（手臂）', sets: 3, reps: '12-15', weight: '自重' }
            ];
            
            plan.advanced = [
                '爆發力訓練：加入跳躍或爆發性動作',
                '單側訓練：單腿深蹲、單臂俯臥撐等',
                '慢速訓練：放慢動作速度，增加肌肉時間張力'
            ];
        }
        
        return plan;
    }
    
    // 減脂訓練計劃
    function generateFatLossPlan(gender, age, bmi, availableTime, equipment) {
        let plan = {
            goal: '減少體脂率，提高代謝',
            totalTime: Math.min(availableTime, 60),
            exercises: [],
            warmup: '5分鐘輕度有氧（原地踏步、輕跳），然後進行全身動態伸展',
            cooldown: '5分鐘慢走降低心率，然後進行全身靜態伸展',
            advanced: []
        };
        
        // 高強度間歇訓練 (HIIT)
        if (equipment === '全套器材') {
            plan.exercises = [
                { name: '槓鈴高翻（全身）', sets: 5, reps: '30秒工作/30秒休息', weight: gender === '男' ? '40-50kg' : '20-30kg' },
                { name: '戰繩（心肺）', sets: 5, reps: '30秒工作/30秒休息', weight: '重戰繩' },
                { name: '壺鈴擺盪（下半身）', sets: 5, reps: '30秒工作/30秒休息', weight: gender === '男' ? '16-24kg' : '8-16kg' },
                { name: '箱式跳（爆發力）', sets: 5, reps: '30秒工作/30秒休息', weight: '中等高度箱子' },
                { name: '划船機衝刺（心肺）', sets: 5, reps: '30秒工作/30秒休息', weight: '最大阻力' }
            ];
            
            plan.advanced = [
                'Tabata訓練：20秒全力/10秒休息，重複8次',
                '複合動作循環：不間斷完成5-6個複合動作',
                '漸增間歇：逐漸增加工作時間，減少休息時間'
            ];
        } else if (equipment === '啞鈴' || equipment === '彈力帶') {
            plan.exercises = [
                { name: '啞鈴/彈力帶深蹲跳（下半身）', sets: 4, reps: '40秒工作/20秒休息', weight: gender === '男' ? '10-15kg' : '5-10kg' },
                { name: '啞鈴/彈力帶高抬腿（核心）', sets: 4, reps: '40秒工作/20秒休息', weight: gender === '男' ? '5-10kg' : '3-5kg' },
                { name: '啞鈴/彈力帶俄羅斯轉體（核心）', sets: 4, reps: '40秒工作/20秒休息', weight: gender === '男' ? '5-10kg' : '3-5kg' },
                { name: '啞鈴/彈力帶弓箭步（腿部）', sets: 4, reps: '40秒工作/20秒休息', weight: gender === '男' ? '10-15kg' : '5-10kg' },
                { name: '啞鈴/彈力帶燕式飛鳥（上半身）', sets: 4, reps: '40秒工作/20秒休息', weight: gender === '男' ? '5-10kg' : '3-5kg' }
            ];
            
            plan.advanced = [
                'EMOM訓練：每分鐘開始時完成特定次數的動作',
                '複合動作超級組：兩個動作連續進行，然後休息',
                '金字塔訓練：逐漸增加/減少重複次數'
            ];
        } else { // 自重
            plan.exercises = [
                { name: '波比跳（全身）', sets: 4, reps: '45秒工作/15秒休息', weight: '自重' },
                { name: '登山者（核心）', sets: 4, reps: '45秒工作/15秒休息', weight: '自重' },
                { name: '深蹲跳（下半身）', sets: 4, reps: '45秒工作/15秒休息', weight: '自重' },
                { name: '交替弓箭步（腿部）', sets: 4, reps: '45秒工作/15秒休息', weight: '自重' },
                { name: '俯臥撐變式（上半身）', sets: 4, reps: '45秒工作/15秒休息', weight: '自重' }
            ];
            
            plan.advanced = [
                '間歇衝刺：20秒衝刺/10秒休息，重複8-10次',
                '階梯間歇：逐漸增加工作時間（30秒、45秒、60秒）',
                '複合動作循環：4-5個動作連續進行，然後休息'
            ];
        }
        
        return plan;
    }
    
    // 身形雕塑訓練計劃
    function generateBodySculptingPlan(gender, age, bmi, availableTime, equipment) {
        let plan = {
            goal: '塑造肌肉線條，提高肌肉質量',
            totalTime: Math.min(availableTime, 75),
            exercises: [],
            warmup: '5-8分鐘輕度有氧（快走、輕跑），然後進行動態伸展，特別是訓練部位',
            cooldown: '5分鐘靜態伸展，針對訓練過的肌群進行拉伸',
            advanced: []
        };
        
        if (equipment === '全套器材' || equipment === '啞鈴') {
            plan.exercises = [
                { name: '啞鈴弓箭步（腿部/臀部）', sets: 3, reps: '12-15每側', weight: gender === '男' ? '12-16kg' : '6-10kg' },
                { name: '啞鈴側平舉（肩部）', sets: 3, reps: '12-15', weight: gender === '男' ? '5-10kg' : '3-5kg' },
                { name: '纜繩下拉（背部）', sets: 3, reps: '12-15', weight: '中等重量' },
                { name: '啞鈴臥推（胸部）', sets: 3, reps: '12-15', weight: gender === '男' ? '15-25kg' : '7.5-12.5kg' },
                { name: '啞鈴俄羅斯轉體（核心）', sets: 3, reps: '15-20', weight: gender === '男' ? '5-10kg' : '3-5kg' }
            ];
            
            plan.advanced = [
                '三組合一訓練：連續完成三個不同動作，針對同一肌群',
                '節奏訓練：改變動作節奏（例如，3秒下放，1秒上舉）',
                '局部強化：針對特定部位進行額外的隔離訓練'
            ];
        } else if (equipment === '彈力帶') {
            plan.exercises = [
                { name: '彈力帶側向行走（臀部/外展肌）', sets: 3, reps: '15-20步每側', weight: '中阻力彈力帶' },
                { name: '彈力帶上拉（背部/肩部）', sets: 3, reps: '15-20', weight: '中阻力彈力帶' },
                { name: '彈力帶胸部夾擠（胸部）', sets: 3, reps: '15-20', weight: '中阻力彈力帶' },
                { name: '彈力帶深蹲（腿部）', sets: 3, reps: '15-20', weight: '中/高阻力彈力帶' },
                { name: '彈力帶旋轉（核心）', sets: 3, reps: '15-20每側', weight: '中阻力彈力帶' }
            ];
            
            plan.advanced = [
                '彈力帶複合訓練：結合多條彈力帶增加訓練難度',
                '脈衝訓練：在動作頂點進行小幅度脈衝',
                '等長收縮：在動作最困難點保持5-10秒'
            ];
        } else { // 自重
            plan.exercises = [
                { name: '弓箭步變化（腿部/臀部）', sets: 3, reps: '15-20每側', weight: '自重' },
                { name: '三角式俯臥撐（胸部/肩部）', sets: 3, reps: '12-15', weight: '自重' },
                { name: '超人式（背部/核心）', sets: 3, reps: '15-20', weight: '自重' },
                { name: '側棱支撐（核心/腰側）', sets: 3, reps: '30-45秒每側', weight: '自重' },
                { name: '單腿臀橋（臀部/後腿）', sets: 3, reps: '15-20每側', weight: '自重' }
            ];
            
            plan.advanced = [
                '流動式訓練：動作之間無縫連接，保持持續運動',
                '等長加脈衝：保持姿勢同時進行小幅度脈衝',
                '單側訓練：專注於單側肌群，提高平衡和對稱性'
            ];
        }
        
        return plan;
    }
    
    // 提高體能訓練計劃
    function generateEndurancePlan(gender, age, bmi, availableTime, equipment) {
        let plan = {
            goal: '提高心肺功能和整體體能水平',
            totalTime: Math.min(availableTime, 60),
            exercises: [],
            warmup: '5分鐘輕度有氧（原地踏步、輕跳），然後進行全身動態伸展',
            cooldown: '5分鐘慢走降低心率，然後進行全身靜態伸展',
            advanced: []
        };
        
        if (equipment === '全套器材') {
            plan.exercises = [
                { name: '划船機（心肺）', sets: 1, reps: '5分鐘中等強度', weight: '中等阻力' },
                { name: '壺鈴擺盪（全身）', sets: 3, reps: '20', weight: gender === '男' ? '16-20kg' : '8-12kg' },
                { name: '戰繩波浪（上半身/心肺）', sets: 3, reps: '30秒', weight: '中等重量戰繩' },
                { name: '跳箱（下半身/心肺）', sets: 3, reps: '10-12', weight: '中等高度箱子' },
                { name: '負重快走（全身/心肺）', sets: 1, reps: '5分鐘', weight: gender === '男' ? '10-15kg' : '5-10kg' }
            ];
            
            plan.advanced = [
                '循環訓練：設置6-8個站點，每站工作45秒，休息15秒',
                '漸增負荷：逐漸增加重量或強度，保持相同工作時間',
                '複合心肺訓練：結合力量和有氧元素的複合動作'
            ];
        } else if (equipment === '啞鈴' || equipment === '彈力帶') {
            plan.exercises = [
                { name: '啞鈴/彈力帶高抬腿（心肺）', sets: 3, reps: '40秒', weight: gender === '男' ? '5kg' : '3kg' },
                { name: '啞鈴/彈力帶深蹲跳（下半身/心肺）', sets: 3, reps: '15', weight: gender === '男' ? '5-10kg' : '3-5kg' },
                { name: '啞鈴/彈力帶交替箭步蹲（腿部）', sets: 3, reps: '20總計', weight: gender === '男' ? '8-12kg' : '4-8kg' },
                { name: '啞鈴/彈力帶划船（上半身）', sets: 3, reps: '15', weight: gender === '男' ? '10-15kg' : '5-8kg' },
                { name: '啞鈴/彈力帶旋轉推舉（全身/核心）', sets: 3, reps: '10每側', weight: gender === '男' ? '8-10kg' : '4-6kg' }
            ];
            
            plan.advanced = [
                'AMRAP訓練：在固定時間內完成盡可能多的輪次',
                '間歇訓練：30秒高強度/30秒低強度，重複10-12次',
                '複合動作超級組：連續完成兩個不同的複合動作'
            ];
        } else { // 自重
            plan.exercises = [
                { name: '波比跳（全身/心肺）', sets: 3, reps: '12-15', weight: '自重' },
                { name: '登山者（核心/心肺）', sets: 3, reps: '40秒', weight: '自重' },
                { name: '跳躍弓箭步（下半身/心肺）', sets: 3, reps: '20總計', weight: '自重' },
                { name: '俯臥撐變式（上半身）', sets: 3, reps: '12-15', weight: '自重' },
                { name: '爆發式深蹲（下半身/爆發力）', sets: 3, reps: '15', weight: '自重' }
            ];
            
            plan.advanced = [
                '間歇衝刺：30秒衝刺/30秒行走，重複8-10次',
                '金字塔訓練：逐漸增加然後減少重複次數',
                '複合動作循環：4-5個動作連續進行，最小休息'
            ];
        }
        
        return plan;
    }
    
    // 一般健身訓練計劃
    function generateGeneralFitnessPlan(gender, age, bmi, availableTime, equipment) {
        let plan = {
            goal: '全面提升身體素質',
            totalTime: Math.min(availableTime, 60),
            exercises: [],
            warmup: '5分鐘輕度有氧（快走、輕跑或跳繩），然後進行全身動態伸展',
            cooldown: '5分鐘全身靜態伸展，特別是訓練過的肌群',
            advanced: []
        };
        
        if (equipment === '全套器材' || equipment === '啞鈴') {
            plan.exercises = [
                { name: '啞鈴深蹲（腿部）', sets: 3, reps: '12-15', weight: gender === '男' ? '15-20kg' : '8-12kg' },
                { name: '啞鈴臥推（胸部）', sets: 3, reps: '12-15', weight: gender === '男' ? '15-20kg' : '8-12kg' },
                { name: '啞鈴划船（背部）', sets: 3, reps: '12-15', weight: gender === '男' ? '15-20kg' : '8-12kg' },
                { name: '啞鈴肩推（肩部）', sets: 3, reps: '12-15', weight: gender === '男' ? '10-15kg' : '5-8kg' },
                { name: '平板支撐（核心）', sets: 3, reps: '30-45秒', weight: '自重' }
            ];
            
            plan.advanced = [
                '全身分化訓練：每天專注於不同肌群',
                '超級組訓練：配對互補肌群的動作',
                '複合動作優先：專注於多關節複合動作'
            ];
        } else if (equipment === '彈力帶') {
            plan.exercises = [
                { name: '彈力帶深蹲（腿部）', sets: 3, reps: '15-20', weight: '中/高阻力彈力帶' },
                { name: '彈力帶推舉（胸部）', sets: 3, reps: '15-20', weight: '中阻力彈力帶' },
                { name: '彈力帶划船（背部）', sets: 3, reps: '15-20', weight: '中阻力彈力帶' },
                { name: '彈力帶側平舉（肩部）', sets: 3, reps: '15-20', weight: '輕/中阻力彈力帶' },
                { name: '彈力帶旋轉（核心）', sets: 3, reps: '15-20每側', weight: '中阻力彈力帶' }
            ];
            
            plan.advanced = [
                '彈力帶複合訓練：結合多條彈力帶增加訓練難度',
                '動態彈力帶訓練：加入跳躍或爆發性元素',
                '等長加動態：結合等長保持和動態動作'
            ];
        } else { // 自重
            plan.exercises = [
                { name: '深蹲（腿部）', sets: 3, reps: '15-20', weight: '自重' },
                { name: '俯臥撐（胸部/肩部）', sets: 3, reps: '10-15', weight: '自重' },
                { name: '超人式（背部）', sets: 3, reps: '12-15', weight: '自重' },
                { name: '倒立俯臥撐/派克推舉（肩部）', sets: 3, reps: '10-15', weight: '自重' },
                { name: '仰臥捲腹（核心）', sets: 3, reps: '15-20', weight: '自重' }
            ];
            
            plan.advanced = [
                '自重循環訓練：設置5-6個站點，每站工作45秒',
                '動作變化：為每個基本動作增加3-4個變化',
                '間歇訓練：高強度自重動作與低強度恢復交替'
            ];
        }
        
        return plan;
    }
    
    // 顯示訓練計劃
    function displayTrainingPlan(plan) {
        // 清空之前的內容
        planDetails.innerHTML = '';
        
        // 創建訓練目標部分
        const goalSection = document.createElement('div');
        goalSection.className = 'plan-section';
        goalSection.innerHTML = `
            <h4>訓練目標</h4>
            <p>${plan.goal}</p>
        `;
        planDetails.appendChild(goalSection);
        
        // 創建運動總時間部分
        const timeSection = document.createElement('div');
        timeSection.className = 'plan-section';
        timeSection.innerHTML = `
            <h4>運動總時間</h4>
            <p>約 ${plan.totalTime} 分鐘</p>
        `;
        planDetails.appendChild(timeSection);
        
        // 創建訓練動作列表部分
        const exerciseSection = document.createElement('div');
        exerciseSection.className = 'plan-section';
        exerciseSection.innerHTML = `<h4>訓練動作列表</h4>`;
        
        const exerciseList = document.createElement('ul');
        plan.exercises.forEach((exercise, index) => {
            const li = document.createElement('li');
            li.textContent = `${index + 1}. ${exercise.name} - ${exercise.sets} 組 x ${exercise.reps} - ${exercise.weight}`;
            exerciseList.appendChild(li);
        });
        
        exerciseSection.appendChild(exerciseList);
        planDetails.appendChild(exerciseSection);
        
        // 創建暖身與收操建議部分
        const warmupSection = document.createElement('div');
        warmupSection.className = 'plan-section';
        warmupSection.innerHTML = `
            <h4>建議暖身與收操方式</h4>
            <p><strong>暖身：</strong> ${plan.warmup}</p>
            <p><strong>收操：</strong> ${plan.cooldown}</p>
        `;
        planDetails.appendChild(warmupSection);
        
        // 創建進階課程建議部分
        if (plan.advanced && plan.advanced.length > 0) {
            const advancedSection = document.createElement('div');
            advancedSection.className = 'plan-section';
            advancedSection.innerHTML = `<h4>進階課程建議</h4>`;
            
            const advancedList = document.createElement('ul');
            plan.advanced.forEach((item) => {
                const li = document.createElement('li');
                li.textContent = item;
                advancedList.appendChild(li);
            });
            
            advancedSection.appendChild(advancedList);
            planDetails.appendChild(advancedSection);
        }
    }
    
    // 生成記錄表格
    function generateRecordTable(exercises) {
        // 清空表格內容
        recordBody.innerHTML = '';
        
        // 為每個訓練動作創建一行
        exercises.forEach((exercise) => {
            const row = document.createElement('tr');
            
            // 動作名稱
            const nameCell = document.createElement('td');
            nameCell.textContent = exercise.name;
            row.appendChild(nameCell);
            
            // 實際重量
            const weightCell = document.createElement('td');
            const weightInput = document.createElement('input');
            weightInput.type = 'text';
            weightInput.placeholder = '實際重量';
            weightCell.appendChild(weightInput);
            row.appendChild(weightCell);
            
            // 實際次數
            const repsCell = document.createElement('td');
            const repsInput = document.createElement('input');
            repsInput.type = 'text';
            repsInput.placeholder = '實際次數';
            repsCell.appendChild(repsInput);
            row.appendChild(repsCell);
            
            // 備註
            const noteCell = document.createElement('td');
            const noteInput = document.createElement('input');
            noteInput.type = 'text';
            noteInput.placeholder = '備註';
            noteCell.appendChild(noteInput);
            row.appendChild(noteCell);
            
            // 添加到表格
            recordBody.appendChild(row);
        });
    }
    
    // 保存訓練記錄
    function saveTrainingRecord() {
        // 獲取所有記錄
        const rows = recordBody.querySelectorAll('tr');
        const records = [];
        
        rows.forEach((row) => {
            const inputs = row.querySelectorAll('input');
            const name = row.querySelector('td:first-child').textContent;
            const weight = inputs[0].value;
            const reps = inputs[1].value;
            const note = inputs[2].value;
            
            records.push({
                name,
                weight,
                reps,
                note,
                date: new Date().toISOString().split('T')[0]
            });
        });
        
        // 保存到本地存儲
        let trainingHistory = JSON.parse(localStorage.getItem('trainingHistory') || '[]');
        trainingHistory = [...trainingHistory, ...records];
        localStorage.setItem('trainingHistory', JSON.stringify(trainingHistory));
        
        // 顯示成功消息
        alert('訓練記錄已保存！');
        
        // 更新成就數據
        updateAchievements(records.length);
    }
    
    // 更新成就數據
    function updateAchievements(completedExercises) {
        // 獲取當前成就數據
        let achievements = JSON.parse(localStorage.getItem('achievements') || '{}');
        
        // 更新訓練次數
        achievements.workoutCount = (achievements.workoutCount || 0) + 1;
        
        // 更新連續訓練天數
        const today = new Date().toISOString().split('T')[0];
        const lastWorkoutDate = achievements.lastWorkoutDate || '';
        
        // 檢查是否是連續訓練
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        
        if (lastWorkoutDate === yesterdayStr) {
            achievements.streak = (achievements.streak || 0) + 1;
        } else if (lastWorkoutDate !== today) {
            // 如果不是連續訓練且不是今天已經記錄過，重置連續天數為1
            achievements.streak = 1;
        }
        
        // 更新最後訓練日期
        achievements.lastWorkoutDate = today;
        
        // 更新完成的訓練動作總數
        achievements.totalExercises = (achievements.totalExercises || 0) + completedExercises;
        
        // 保存更新後的成就數據
        localStorage.setItem('achievements', JSON.stringify(achievements));
        
        // 如果在成就頁面，更新顯示
        if (typeof updateAchievementDisplay === 'function') {
            updateAchievementDisplay();
        }
    }
});