document.addEventListener('DOMContentLoaded', function() {
    initTheme();
});

// 初始化主題設置
function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeOptions = document.getElementById('theme-options');
    
    if (!themeToggle || !themeOptions) return;
    
    const themeOptionElements = document.querySelectorAll('.theme-option');
    
    // 從localStorage獲取主題
    const currentTheme = localStorage.getItem('theme') || 'blue';
    document.body.setAttribute('data-theme', currentTheme);
    
    // 更新主題按鈕顏色
    updateThemeButtonColor(currentTheme);
    
    // 主題切換按鈕點擊事件
    themeToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        themeOptions.classList.toggle('show');
    });
    
    // 主題選項點擊事件
    themeOptionElements.forEach(option => {
        option.addEventListener('click', function(e) {
            e.stopPropagation();
            const selectedTheme = this.getAttribute('data-theme');
            document.body.setAttribute('data-theme', selectedTheme);
            localStorage.setItem('theme', selectedTheme);
            themeOptions.classList.remove('show');
            
            // 更新主題按鈕顏色
            updateThemeButtonColor(selectedTheme);
        });
    });
    
    // 點擊其他地方關閉主題選項
    document.addEventListener('click', function(event) {
        if (themeOptions.classList.contains('show')) {
            themeOptions.classList.remove('show');
        }
    });
}

// 更新主題按鈕顏色
function updateThemeButtonColor(theme) {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;
    
    // 根據主題設置按鈕顏色
    switch(theme) {
        case 'blue':
            themeToggle.style.backgroundColor = '#3498db';
            break;
        case 'red':
            themeToggle.style.backgroundColor = '#e74c3c';
            break;
        case 'green':
            themeToggle.style.backgroundColor = '#2ecc71';
            break;
        default:
            themeToggle.style.backgroundColor = '#3498db';
    }
}