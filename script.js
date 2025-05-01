// 初始化 GUN
const gun = Gun({
    peers: [
        'https://gun-manhattan.herokuapp.com/gun', // 公共伺服器
        'https://gun-us.herokuapp.com/gun'
    ]
});

// 建立留言參考
const messages = gun.get('messages');

// 建立留言 HTML 元素
function createMessageElement(message, id) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'card message-card';
    messageDiv.innerHTML = `
        <div class="card-body">
            <div class="message-header">
                <h5 class="card-title">${message.name}</h5>
                <div>
                    <span class="message-time">${message.time}</span>
                    <button class="btn btn-danger btn-sm delete-btn" onclick="deleteMessage('${id}')">刪除</button>
                </div>
            </div>
            <p class="card-text message-content">${message.content}</p>
        </div>
    `;
    return messageDiv;
}

// 顯示所有留言
function displayMessages() {
    const messageList = document.getElementById('messageList');
    messageList.innerHTML = '';
    
    // 監聽留言更新
    messages.map().once((data, id) => {
        if (data) {
            const messageElement = createMessageElement(data, id);
            messageList.insertBefore(messageElement, messageList.firstChild);
        }
    });
}

// 刪除留言
function deleteMessage(id) {
    messages.get(id).put(null);
}

// 處理表單提交
document.getElementById('messageForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const nameInput = document.getElementById('name');
    const messageInput = document.getElementById('message');
    
    const newMessage = {
        name: nameInput.value,
        content: messageInput.value,
        time: new Date().toLocaleString('zh-TW')
    };
    
    // 使用 GUN 儲存新留言
    messages.set(newMessage);
    
    nameInput.value = '';
    messageInput.value = '';
});

// 儲存樣式設定
function saveStyleSettings() {
    const settings = {
        backgroundColor: document.getElementById('bgColor').value,
        textColor: document.getElementById('textColor').value,
        fontFamily: document.getElementById('fontFamily').value
    };
    localStorage.setItem('styleSettings', JSON.stringify(settings));
}

// 載入樣式設定
function loadStyleSettings() {
    const settings = localStorage.getItem('styleSettings');
    if (settings) {
        const { backgroundColor, textColor, fontFamily } = JSON.parse(settings);
        document.getElementById('bgColor').value = backgroundColor;
        document.getElementById('textColor').value = textColor;
        document.getElementById('fontFamily').value = fontFamily;
        applyStyles(backgroundColor, textColor, fontFamily);
    }
}

// 套用樣式
function applyStyles(backgroundColor, textColor, fontFamily) {
    document.body.style.backgroundColor = backgroundColor;
    document.body.style.color = textColor;
    document.body.style.fontFamily = fontFamily;
    
    // 更新留言卡片的文字顏色
    document.querySelectorAll('.card').forEach(card => {
        card.style.color = textColor;
    });
}

// 監聽樣式設定變更
document.getElementById('bgColor').addEventListener('input', function(e) {
    applyStyles(
        e.target.value,
        document.getElementById('textColor').value,
        document.getElementById('fontFamily').value
    );
    saveStyleSettings();
});

document.getElementById('textColor').addEventListener('input', function(e) {
    applyStyles(
        document.getElementById('bgColor').value,
        e.target.value,
        document.getElementById('fontFamily').value
    );
    saveStyleSettings();
});

document.getElementById('fontFamily').addEventListener('change', function(e) {
    applyStyles(
        document.getElementById('bgColor').value,
        document.getElementById('textColor').value,
        e.target.value
    );
    saveStyleSettings();
});

// 頁面載入時顯示留言並載入樣式設定
window.addEventListener('load', function() {
    displayMessages();
    loadStyleSettings();
});