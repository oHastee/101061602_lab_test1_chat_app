const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/chat_app', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error(err));

server.listen(3000, () => console.log('Server running on port 3000'));

io.on('connection', (socket) => {
    socket.on('joinRoom', (room) => {
        socket.join(room);
    });

    socket.on('sendMessage', async ({ message, room, username }) => {
        const newMessage = new GroupMessage({ from_user: username, room, message });
        await newMessage.save();
        io.to(room).emit('receiveMessage', { username, message });
    });

    socket.on('typing', ({ username, room }) => {
        socket.to(room).emit('typing', username);
    });
});