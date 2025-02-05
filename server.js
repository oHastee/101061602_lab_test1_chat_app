const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

// Import models
const GroupMessage = require('./models/GroupMessage');
const PrivateMessage = require('./models/PrivateMessage');

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/chat_app', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');

        // Check if the GroupMessage collection is empty and insert a sample message if so.
        GroupMessage.estimatedDocumentCount((err, count) => {
            if (!err && count === 0) {
                const sampleMessage = new GroupMessage({
                    from_user: "sampleUser",
                    room: "general",
                    message: "Welcome to the chat!"
                });
                sampleMessage.save()
                    .then(() => console.log('Sample group message inserted'))
                    .catch(err => console.error('Error inserting sample message:', err));
            }
        });
    })
    .catch(err => console.error(err));

server.listen(3000, () => console.log('Server running on port 3000'));

// Socket.io handling for room-based chat
io.on('connection', (socket) => {
    console.log(`New client connected: ${socket.id}`);

    // Handle joining a room
    socket.on('joinRoom', (room) => {
        socket.join(room);
        socket.currentRoom = room;
        console.log(`Socket ${socket.id} joined room: ${room}`);
    });

    // Handle leaving a room
    socket.on('leaveRoom', (room) => {
        socket.leave(room);
        socket.currentRoom = null;
        console.log(`Socket ${socket.id} left room: ${room}`);
    });

    // Handle sending messages (room-based chat)
    socket.on('sendMessage', async ({ message, room, username }) => {
        try {
            // Create and store a new group message in MongoDB
            const newMessage = new GroupMessage({ from_user: username, room, message });
            await newMessage.save();

            // Emit the message to all users in the room
            io.to(room).emit('receiveMessage', { username, message, room });
        } catch (error) {
            console.error('Error saving message:', error);
        }
    });

    // Handle typing indicator
    socket.on('typing', ({ username, room }) => {
        // Broadcast to everyone else in the room that this user is typing
        socket.to(room).emit('typing', { username, room });
    });
});
