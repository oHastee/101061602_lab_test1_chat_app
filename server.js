require('dotenv').config();
const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

// Import Models and Routes
const GroupMessage = require('./models/GroupMessage');
const authRoutes = require('./routes/auth');
// If needed later add default PM
//const PrivateMessage = require('./models/PrivateMessage');


app.use(cors());
app.use(express.json());
// Serve static files from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// Additional Routes to Serve the Views
// Default route serves the signup page
app.get(['/', '/signup'], (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'views', 'signup.html'));
});

// Route to serve the login page
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'views', 'login.html'));
});

// Route to serve the chat page
app.get('/chat', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'views', 'chat.html'));
});

// Mount authentication routes at /api
app.use('/api', authRoutes);

// Connect to MongoDB Atlas using the connection string from .env
mongoose.connect(process.env.MONGODB_URI_REMOTE)
    .then(() => {
        console.log('Connected to MongoDB Atlas');

        // Optional: Check if the GroupMessage collection is empty and insert a sample message if so.
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

// Use PORT from environment variables or default to 3000
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

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
            const newMessage = new GroupMessage({ from_user: username, room, message });
            await newMessage.save();
            io.to(room).emit('receiveMessage', { username, message, room });
        } catch (error) {
            console.error('Error saving message:', error);
        }
    });

    // Handle typing indicator
    socket.on('typing', ({ username, room }) => {
        socket.to(room).emit('typing', { username, room });
    });
});
