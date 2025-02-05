const messageInput = document.getElementById('messageInput');
messageInput.addEventListener('input', () => {
    socket.emit('typing', { username: localStorage.getItem('username'), room: currentRoom });
});

socket.on('typing', (username) => {
    // Display typing indicator
});