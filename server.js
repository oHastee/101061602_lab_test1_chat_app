// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const open = require('open'); // Used to auto-open the browser

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

// Import Models and Routes
const GroupMessage = require('./models/GroupMessage');
const PrivateMessage = require('./models/PrivateMessage');
const authRoutes = require('./routes/auth');
const messageRoutes = require('./routes/messages');
const privateMessagesRoutes = require('./routes/privateMessages');
const privateConversationsRoutes = require('./routes/privateConversations');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes to Serve Views
app.get(['/', '/signup'], (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'views', 'signup.html'));
});
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'views', 'login.html'));
});
app.get('/chat', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'views', 'chat.html'));
});
app.get('/private', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'views', 'private.html'));
});

// Mount API Routes
app.use('/api', authRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/privateMessages', privateMessagesRoutes);
app.use('/api/privateConversations', privateConversationsRoutes);

// Connect to MongoDB Atlas using the connection string from .env
mongoose.connect(process.env.MONGODB_URI_REMOTE)
    .then(() => {
        console.log('Connected to MongoDB Atlas');

        // (Optional) Insert a sample group message if none exists
        GroupMessage.estimatedDocumentCount()
            .then(count => {
                if (count === 0) {
                    const sampleMessage = new GroupMessage({
                        from_user: "sampleUser",
                        room: "general",
                        message: "Welcome to the chat!"
                    });
                    return sampleMessage.save();
                }
            })
            .then(() => console.log('Sample group message inserted (if needed)'))
            .catch(err => console.error('Error counting/inserting sample message:', err));
    })
    .catch(err => console.error('Error connecting to MongoDB:', err));

// Start the Server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    // Automatically open the default URL in the browser
    open(`http://localhost:${PORT}`);
});

// In-memory mapping for private messaging (username => socket id)
const onlineUsers = {};

io.on('connection', (socket) => {
    console.log(`New client connected: ${socket.id}`);

    // Register the user for private messaging
    socket.on('register', (username) => {
        socket.username = username;
        onlineUsers[username] = socket.id;
        console.log(`User registered: ${username} with socket id ${socket.id}`);
    });

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

    // Handle sending public messages (room-based chat)
    socket.on('sendMessage', async ({ message, room, username }) => {
        try {
            const newMessage = new GroupMessage({ from_user: username, room, message });
            await newMessage.save();
            io.to(room).emit('receiveMessage', { username, message, room });
        } catch (error) {
            console.error('Error saving message:', error);
        }
    });

    // Handle persistent typing indicator
    socket.on('typing', ({ username, room }) => {
        socket.to(room).emit('typing', { username, room });
    });
    socket.on('stopTyping', ({ username, room }) => {
        socket.to(room).emit('stopTyping', { username, room });
    });

    // Handle sending private messages
    socket.on('sendPrivateMessage', async ({ to_user, message, from_user }) => {
        try {
            const newPrivateMessage = new PrivateMessage({ from_user, to_user, message });
            await newPrivateMessage.save();
            const targetSocketId = onlineUsers[to_user];
            if (targetSocketId) {
                io.to(targetSocketId).emit('receivePrivateMessage', { from_user, message });
            }
        } catch (error) {
            console.error('Error saving private message:', error);
        }
    });

    // Clean up on disconnect
    socket.on('disconnect', () => {
        if (socket.username) {
            delete onlineUsers[socket.username];
        }
        console.log(`Client disconnected: ${socket.id}`);
    });
});
