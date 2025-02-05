document.addEventListener('DOMContentLoaded', () => {
    const socket = io();
    let currentRoom = '';

    // JOIN ROOM FUNCTIONALITY
    const roomButtons = document.querySelectorAll('.roomBtn');
    roomButtons.forEach(button => {
        button.addEventListener('click', () => {
            const room = button.getAttribute('data-room');
            currentRoom = room;
            document.getElementById('roomName').textContent = room;
            socket.emit('joinRoom', room);
            document.getElementById('roomSelection').style.display = 'none';
            document.getElementById('chatContainer').style.display = 'block';
        });
    });

    // LEAVE ROOM FUNCTIONALITY
    const leaveRoomBtn = document.getElementById('leaveRoom');
    if (leaveRoomBtn) {
        leaveRoomBtn.addEventListener('click', () => {
            socket.emit('leaveRoom', currentRoom);
            currentRoom = '';
            document.getElementById('chatContainer').style.display = 'none';
            document.getElementById('roomSelection').style.display = 'block';
        });
    }

    // LOGOUT FUNCTIONALITY
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            // Clear the user session from localStorage
            localStorage.removeItem('username');
            // Redirect to the login page
            window.location.href = 'login.html';
        });
    }

    // MESSAGE SENDING FUNCTIONALITY
    const messageForm = document.getElementById('messageForm');
    const messageInput = document.getElementById('messageInput');
    messageForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const message = messageInput.value;
        if (message.trim() !== '' && currentRoom !== '') {
            socket.emit('sendMessage', {
                message,
                room: currentRoom,
                username: localStorage.getItem('username')
            });
            messageInput.value = '';
        }
    });

    // TYPING INDICATOR FUNCTIONALITY
    messageInput.addEventListener('input', () => {
        socket.emit('typing', {
            username: localStorage.getItem('username'),
            room: currentRoom
        });
    });

    socket.on('typing', (data) => {
        if (data.room === currentRoom) {
            document.getElementById('typingIndicator').textContent = `${data.username} is typing...`;
            setTimeout(() => {
                document.getElementById('typingIndicator').textContent = '';
            }, 2000);
        }
    });

    // RECEIVING MESSAGES FUNCTIONALITY
    socket.on('receiveMessage', (data) => {
        if (data.room === currentRoom) {
            const messagesDiv = document.getElementById('messages');
            const newMessage = document.createElement('p');
            newMessage.innerHTML = `<strong>${data.username}:</strong> ${data.message}`;
            messagesDiv.appendChild(newMessage);
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
        }
    });
});
