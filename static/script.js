document.addEventListener('DOMContentLoaded', () => {
    const chatForm = document.getElementById('chat-form');
    const userInput = document.getElementById('user-input');
    const chatContainer = document.getElementById('chat-container');
    const sendBtn = document.getElementById('send-btn');
    
    let chatHistory = []; // To keep context

    // Scroll to bottom of chat
    const scrollToBottom = () => {
        chatContainer.scrollTop = chatContainer.scrollHeight;
    };

    // Format basic markdown from Gemini
    const formatText = (text) => {
        // Very basic formatting for bold and lists
        let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        formatted = formatted.replace(/\n/g, '<br>');
        return formatted;
    };

    // Add a message to the UI
    const appendMessage = (sender, text) => {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${sender}-message`;
        
        const bubble = document.createElement('div');
        bubble.className = 'message-bubble';
        
        if (sender === 'bot') {
            bubble.innerHTML = formatText(text);
        } else {
            bubble.textContent = text;
        }
        
        msgDiv.appendChild(bubble);
        chatContainer.appendChild(msgDiv);
        scrollToBottom();
    };

    // Add a loading indicator
    const showLoading = () => {
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'message bot-message loading';
        loadingDiv.id = 'loading-indicator';
        
        const bubble = document.createElement('div');
        bubble.className = 'message-bubble';
        bubble.innerHTML = `
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
        `;
        
        loadingDiv.appendChild(bubble);
        chatContainer.appendChild(loadingDiv);
        scrollToBottom();
    };

    // Remove loading indicator
    const removeLoading = () => {
        const indicator = document.getElementById('loading-indicator');
        if (indicator) {
            indicator.remove();
        }
    };

    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const message = userInput.value.trim();
        if (!message) return;
        
        // Disable input while processing
        userInput.value = '';
        userInput.disabled = true;
        sendBtn.disabled = true;
        
        // Show user message
        appendMessage('user', message);
        showLoading();
        
        try {
            const response = await fetch('/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    history: chatHistory
                }),
            });
            
            const data = await response.json();
            
            removeLoading();
            
            if (response.ok) {
                appendMessage('bot', data.response);
                // Update history
                if (data.history) {
                    chatHistory = data.history;
                }
            } else {
                appendMessage('bot', `Error: ${data.error || 'Something went wrong.'}`);
            }
        } catch (error) {
            removeLoading();
            appendMessage('bot', 'Network error. Please try again.');
            console.error('Error:', error);
        } finally {
            // Re-enable input
            userInput.disabled = false;
            sendBtn.disabled = false;
            userInput.focus();
        }
    });
});
