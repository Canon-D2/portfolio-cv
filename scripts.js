function toggleMobileMenu(){
	document.getElementById("menu").classList.toggle("active");
}

// Hiệu ứng nhập, xóa họ tên
document.addEventListener("DOMContentLoaded", function() {
	const nameElement = document.getElementById('animatedName');
	const nameText = "Đặng Chí Bảo";
	let isDeleting = false;
	let charIndex = 0;
	let timeout = 100;
  
	function typeEffect() {
	  const currentText = nameElement.innerText;
  
	  if (!isDeleting) {
		// Typing phase
		nameElement.textContent = nameText.slice(0, charIndex + 1);
		charIndex++;
		timeout = 100;
  
		if (charIndex === nameText.length) {
		  isDeleting = true;
		  timeout = 2000; // Pause at full name
		}
	  } else {
		// Deleting phase
		nameElement.textContent = nameText.slice(0, charIndex - 1);
		charIndex--;
		timeout = 50;
  
		if (charIndex === 0) {
		  isDeleting = false;
		  timeout = 500; // Pause before restart
		}
	  }
  
	  setTimeout(typeEffect, timeout);
	}
  
	// Start animation
	typeEffect();
  
	// Add blinking cursor
	const style = document.createElement('style');
	style.textContent = `
	  #animatedName::after {
		content: "|";
		animation: blink 1s infinite;
		opacity: 1;
	  }
  
	  @keyframes blink {
		0%, 100% { opacity: 1; }
		50% { opacity: 0; }
	  }
	`;
	document.head.appendChild(style);
  });


// Weather Script Handle

!function(d,s,id)
{
	var js,fjs=d.getElementsByTagName(s)[0];
	if(!d.getElementById(id))
	{
		js=d.createElement(s);
		js.id=id;
		js.src='https://weatherwidget.io/js/widget.min.js';
		fjs.parentNode.insertBefore(js,fjs);
	}
	else 
	{
		console.warn('Weather widget script already exists.');
	}
}	(document,'script','weatherwidget-io-js');


// Darkmode handle
document.addEventListener('DOMContentLoaded', function() {
    const themeIcon = document.getElementById('themeIcon');
    const body = document.body;

    // Kiểm tra theme đã lưu
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        themeIcon.src = './imgs/sun.png'; // Dark mode -> hiển thị mặt trời
    } else {
        themeIcon.src = './imgs/moon.png'; // Light mode -> hiển thị mặt trăng
    }

    // Bắt sự kiện click
    themeIcon.addEventListener('click', function() {
        body.classList.toggle('dark-mode');
        
        // Cập nhật icon và lưu theme
        if (body.classList.contains('dark-mode')) {
            themeIcon.src = './imgs/sun.png';
            localStorage.setItem('theme', 'dark');
        } else {
            themeIcon.src = './imgs/moon.png';
            localStorage.setItem('theme', 'light');
        }
    });
});


// BACK TO TOP BUTTON CLICK
window.onscroll = function() {
    const backToTopButton = document.getElementById('backToTop');
    // Sửa điều kiện hiển thị
    if (document.body.scrollTop > 1800 || document.documentElement.scrollTop > 1800) {
        backToTopButton.style.display = "block";
    } else {
        backToTopButton.style.display = "none";
    }
};

// Thêm trình xử lý sự kiện click
document.getElementById('backToTop').addEventListener('click', function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});


// Chatbox Gemini API Handle (Cache Local Storage/ Button Clear Cache/ Hidden Messenge Default)
document.addEventListener('DOMContentLoaded', function() {
    const chatLog = document.getElementById('chat-log');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const clearButton = document.getElementById('clear-chat');
    const notification = document.getElementById('notification');
    let isFirstMessage = true;

    const prompt = "Dựa vào CV sau, tự xem mình là ứng viên với các thông tin gồm: Là sinh viên mới tốt nghiệp tên Đặng Chí Bảo cần ứng tuyển vị trí Software Engineering tại quý công ty, hiện tốt nghiệp chuyên ngành Kỹ thuật phần mềm, đam mê công nghệ, phát triển phần mềm trên nhiều nền tảng, có khả năng tư duy tốt và thích nghiên cứu công nghệ mới, có thể tư vấn công nghệ tốt. Học vấn: Đại học Sài Gòn. Kinh nghiệm: Khóa luận sử dụng OC-SORT & YOLOv8, thực tập Backend tại MONA HOST trong đó xây dựng RESTful API, xử lý giao dịch thanh toán online. Kỹ năng: Manage Cloud Server, IT Supports, tư vấn sản phẩm, làm việc nhóm, kỹ năng giao tiếp. Bằng cấp: Đại học SGU (GPA 2.96/4), giải Hackathon cấp trường, TOEIC nghe đọc. Liên hệ: Phone: 0349734840, dcbao.dev@gmail.com. Hỏi tên thì chỉ trả lời tên, hỏi dự án thì chỉ trả lời dự án,... tránh trả lời thông tin không liên quan.";

    function addMessage(role, message) {
        const li = document.createElement('li');
        const sender = role === 'user' ? 'You' : 'AI';
        li.innerHTML = `
            <span class="avatar ${sender.toLowerCase()}">${sender}</span>
            <div class="message">${message}</div>
        `;
        chatLog.appendChild(li);
        chatLog.scrollTop = chatLog.scrollHeight;
        saveMessages();
    }

    function addThinkingMessage() {
		const li = document.createElement('li');
		li.className = 'thinking';
		li.innerHTML = `
		  <span class="avatar ai">AI</span>
		  <div class="message">I'm thinking...</div>
	  `;
		chatLog.appendChild(li);
		chatLog.scrollTop = chatLog.scrollHeight;
	  }
	
	function removeThinkingMessage() {
		const thinkingMessage = chatLog.querySelector('.thinking');
		if (thinkingMessage) {
		  chatLog.removeChild(thinkingMessage);
		}
	}
	
	function showNotification(message) {
		notification.textContent = message;
		notification.style.display = 'block';
		setTimeout(() => {
		  notification.style.display = 'none';
		}, 3000);
	}

    function saveMessages() {
        const messages = [];
        Array.from(chatLog.children).forEach(li => {
            const sender = li.querySelector('.avatar').textContent;
            const role = sender === 'You' ? 'user' : 'model';
            const message = li.querySelector('.message').textContent;
            messages.push({ role, parts: [{ text: message }] });
        });
        localStorage.setItem('chatHistory', JSON.stringify(messages));
    }

    function loadMessages() {
        const savedHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
        chatLog.innerHTML = '';
        savedHistory.forEach(msg => {
            addMessage(msg.role, msg.parts[0].text);
        });
        if (savedHistory.length === 0) {
            addSampleChat();
        }
    }

    function addSampleChat() {
        addMessage('user', 'Xin chào, tôi có thể hỏi một vài điều được không?');
        addMessage('model', 'Đương nhiên, tôi sẽ trả lời các câu hỏi của bạn.');
    }

    async function sendMessage() {
        const message = userInput.value.trim();
        if (message) {
            if (isFirstMessage) {
                chatLog.innerHTML = '';
                isFirstMessage = false;
            }

            addMessage('user', message);
            userInput.value = '';
            addThinkingMessage();

            try {
                const savedHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
                
                // Build contents with prompt and full history
                const contents = [
                    { role: 'user', parts: [{ text: prompt }] },
                    ...savedHistory,
                    { role: 'user', parts: [{ text: message }] }
                ];

                const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyA6A9xHLHlIaULhZHL9u_s1ZjZoF-sPK2M', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        contents: contents,
                        generationConfig: {
                            maxOutputTokens: 70
                        }
                    }),
                });

                if (!response.ok) throw new Error('API request failed');

                const data = await response.json();
                const aiResponse = data.candidates[0].content.parts[0].text;
                
                // Update chat history
                savedHistory.push(
                    { role: 'user', parts: [{ text: message }] },
                    { role: 'model', parts: [{ text: aiResponse }] }
                );
                localStorage.setItem('chatHistory', JSON.stringify(savedHistory));

                removeThinkingMessage();
                addMessage('model', aiResponse);
            } catch (error) {
                console.error('Error:', error);
                removeThinkingMessage();
                addMessage('model', 'Xin lỗi, đã có lỗi xảy ra.');
                // Rollback: Remove failed message from history
                const savedHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
                savedHistory.pop();
                localStorage.setItem('chatHistory', JSON.stringify(savedHistory));
            }
        }
    }

    function clearChat() {
        localStorage.removeItem('chatHistory');
        chatLog.innerHTML = '';
        addSampleChat();
        isFirstMessage = true;
        showNotification('Tất cả tin nhắn đã được xóa');
    }

    // Khởi tạo chat
    loadMessages();

    sendButton.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => e.key === 'Enter' && sendMessage());
    clearButton.addEventListener('click', clearChat);
});