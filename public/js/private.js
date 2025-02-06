// public/js/private.js
document.addEventListener('DOMContentLoaded', () => {
    const socket = io();
    const privateMessagesDiv = document.getElementById('privateMessages');
    const privateMessageForm = document.getElementById('privateMessageForm');
    const privateMessageInput = document.getElementById('privateMessageInput');
    const backToChatBtn = document.getElementById('backToChat');

    // Get the query parameter 'to' from the URL to determine the recipient
    const urlParams = new URLSearchParams(window.location.search);
    const recipient = urlParams.get('to');
    const currentUser = localStorage.getItem('username');

    if (!currentUser || !recipient) {
        alert('Invalid session or recipient.');
        window.location.href = '/chat';
    }

    // Register the current user on this socket so that private messages will be delivered.
    socket.emit('register', currentUser);

    // Set the header text to show the recipient
    document.getElementById('privateChatHeader').textContent = `Private Chat with ${recipient}`;

    // Function to append a message to the private chat area
    const appendMessage = (sender, message) => {
        const p = document.createElement('p');
        p.innerHTML = `<strong>${sender}:</strong> ${message}`;
        privateMessagesDiv.appendChild(p);
        privateMessagesDiv.scrollTop = privateMessagesDiv.scrollHeight;
    };

    // Fetch previous private messages between currentUser and recipient
    fetch(`/api/privateMessages?user1=${encodeURIComponent(currentUser)}&user2=${encodeURIComponent(recipient)}`)
        .then(response => response.json())
        .then(data => {
            data.forEach(msg => {
                appendMessage(msg.from_user, msg.message);
            });
        })
        .catch(err => console.error('Error fetching private messages:', err));

    // Handle sending a private message
    privateMessageForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const message = privateMessageInput.value;
        if (message.trim() !== '') {
            socket.emit('sendPrivateMessage', {
                to_user: recipient,
                message,
                from_user: currentUser
            });
            appendMessage(currentUser, message);
            privateMessageInput.value = '';
        }
    });

    // Listen for incoming private messages
    socket.on('receivePrivateMessage', (data) => {
        // Only append the message if it's from the current conversation partner
        if (data.from_user === recipient) {
            appendMessage(data.from_user, data.message);
        }
    });

    // Back button to return to the main chat rooms view
    backToChatBtn.addEventListener('click', () => {
        window.location.href = '/chat';
    });
});
