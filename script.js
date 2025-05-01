// 儲存留言到 localStorage
function saveMessages(messages) {
    localStorage.setItem('messages', JSON.stringify(messages));
}

// 從 localStorage 讀取留言
function getMessages() {
    const messages = localStorage.getItem('messages');
    return messages ? JSON.parse(messages) : [];
}

// 建立留言 HTML 元素
function createMessageElement(message, index) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'card message-card';
    messageDiv.innerHTML = `
        <div class="card-body">
            <div class="message-header">
                <h5 class="card-title">${message.name}</h5>
                <div>
                    <span class="message-time">${message.time}</span>
                    <button class="btn btn-danger btn-sm delete-btn" onclick="deleteMessage(${index})">刪除</button>
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
    const messages = getMessages();
    
    messages.forEach((message, index) => {
        const messageElement = createMessageElement(message, index);
        messageList.appendChild(messageElement);
    });
}

// 刪除留言
function deleteMessage(index) {
    const messages = getMessages();
    messages.splice(index, 1);
    saveMessages(messages);
    displayMessages();
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
    
    const messages = getMessages();
    messages.unshift(newMessage);
    saveMessages(messages);
    
    nameInput.value = '';
    messageInput.value = '';
    
    displayMessages();
});

// 頁面載入時顯示留言
window.addEventListener('load', displayMessages);