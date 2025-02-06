document.addEventListener('DOMContentLoaded', () => {
    const socket = io();
    let currentRoom = '';
    const currentUser = localStorage.getItem('username');

    // Load private conversation partners and display in the Private Messages section
    function loadPrivateConversations() {
        fetch(`/api/privateConversations?user=${encodeURIComponent(currentUser)}`)
            .then(response => response.json())
            .then(partners => {
                const privateList = document.getElementById('privateList');
                privateList.innerHTML = ''; // Clear previous list
                if (partners.length === 0) {
                    privateList.innerHTML = '<p class="text-muted">No private conversations.</p>';
                } else {
                    partners.forEach(partner => {
                        const btn = document.createElement('button');
                        btn.className = 'list-group-item list-group-item-action';
                        btn.textContent = partner;
                        btn.addEventListener('click', () => {
                            window.open(`/private?to=${encodeURIComponent(partner)}`, '_blank');
                        });
                        privateList.appendChild(btn);
                    });
                }
            })
            .catch(err => console.error('Error loading private conversations:', err));
    }
    loadPrivateConversations();

    // JOIN PUBLIC ROOM FUNCTIONALITY
    const roomButtons = document.querySelectorAll('.roomBtn');
    roomButtons.forEach(button => {
        button.addEventListener('click', () => {
            const room = button.getAttribute('data-room');
            currentRoom = room;

            // Clear previous messages
            const messagesDiv = document.getElementById('messages');
            messagesDiv.innerHTML = '';

            document.getElementById('roomName').textContent = room;
            socket.emit('joinRoom', room);

            // Fetch previous messages for this room from the API
            fetch(`/api/messages?room=${encodeURIComponent(room)}`)
                .then(response => response.json())
                .then(data => {
                    data.forEach(msg => {
                        const p = document.createElement('p');
                        p.innerHTML = `<strong class="username" data-username="${msg.from_user}">${msg.from_user}:</strong> ${msg.message}`;
                        messagesDiv.appendChild(p);
                    });
                    messagesDiv.scrollTop = messagesDiv.scrollHeight;
                })
                .catch(err => console.error('Error fetching messages:', err));

            // Hide room selection and private messages, show chat interface
            document.getElementById('roomSelection').style.display = 'none';
            document.getElementById('privateSelection').style.display = 'none';
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
            document.getElementById('privateSelection').style.display = 'block';
        });
    }

    // LOGOUT FUNCTIONALITY (Global Logout from header)
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('username');
            window.location.href = '/login';
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
                username: currentUser
            });
            messageInput.value = '';
            socket.emit('stopTyping', { username: currentUser, room: currentRoom });
        }
    });

    // PERSISTENT TYPING INDICATOR FUNCTIONALITY
    messageInput.addEventListener('input', () => {
        if (messageInput.value.trim() !== '') {
            socket.emit('typing', { username: currentUser, room: currentRoom });
        } else {
            socket.emit('stopTyping', { username: currentUser, room: currentRoom });
        }
    });

    socket.on('typing', (data) => {
        if (data.room === currentRoom) {
            document.getElementById('typingIndicator').textContent = `${data.username} is typing...`;
        }
    });

    socket.on('stopTyping', (data) => {
        if (data.room === currentRoom) {
            const indicator = document.getElementById('typingIndicator');
            if (indicator.textContent.includes(data.username)) {
                indicator.textContent = '';
            }
        }
    });

    // RECEIVING PUBLIC MESSAGES FUNCTIONALITY
    socket.on('receiveMessage', (data) => {
        if (data.room === currentRoom) {
            const messagesDiv = document.getElementById('messages');
            const newMessage = document.createElement('p');
            newMessage.innerHTML = `<strong class="username" data-username="${data.username}">${data.username}:</strong> ${data.message}`;
            messagesDiv.appendChild(newMessage);
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
        }
    });

    // Event delegation: clicking a username in the chat opens private chat in a new tab
    const messagesContainer = document.getElementById('messages');
    messagesContainer.addEventListener('click', (event) => {
        if (event.target && event.target.classList.contains('username')) {
            const toUser = event.target.getAttribute('data-username');
            if (toUser === currentUser) return;
            window.open(`/private?to=${encodeURIComponent(toUser)}`, '_blank');
        }
    });
});
