# Chat Application - COMP 3133 Lab Test 1

## 📌 Project Overview

This is a **real-time chat application** built as part of **COMP 3133 Lab Test 1**. The app provides **room-based and private messaging**, user authentication, message storage, and real-time updates using **Socket.io**. It also includes features such as **typing indicators**, user session persistence, and MongoDB database integration.

## 🚀 Technologies Used

### **Backend**
- **Node.js** - JavaScript runtime for building the server.
- **Express.js** - Web framework for handling API routes.
- **Socket.io** - Real-time communication for chat functionality.
- **Mongoose** - ODM for MongoDB to store messages and user data.
- **MongoDB Atlas** - Cloud-based database to store users and messages.
- **Cors** - Middleware to allow cross-origin requests.
- **Bcrypt.js** - Used for hashing and securing user passwords.
- **Dotenv** - To manage environment variables securely.

### **Frontend**
- **HTML5** - Structure for all web pages.
- **CSS3 & Bootstrap** - Styling and responsive design.
- **jQuery** - Simplifies AJAX calls and DOM manipulations.
- **Fetch API** - Used to make API requests.
- **Socket.io Client** - Enables real-time communication in the browser.

---

## 📸 Screenshots & Pages

### **1️⃣ Signup Page**
_Users can register for a new account._  
![Signup Page](app_screenshots/Signup_Page.png)

### **2️⃣ Login Page**
_Users can log in with their credentials._  
![Login Page](app_screenshots/Login_Page.png)

### **3️⃣ Select a Room Page**
_Users can choose from different chat rooms and see private messages._  
![Select a Room Page](app_screenshots/Select_a_Room_Page.png)

### **4️⃣ Chat Room Page**
_Users can send messages in public rooms._  
![Chat Room Page](app_screenshots/Chat_Room_Page.png)

### **5️⃣ Private Message Page**
_Private one-on-one messaging with other users._  
![Private Message Page](app_screenshots/Private_Message_Page.png)

### **6️⃣ Typing Indicator**
_Shows when a user is currently typing._  
![User is Typing](app_screenshots/User_Is_Typing.png)

### **7️⃣ Error Handling for Unique Usernames**
_Users cannot register with an existing username._  
![Error Handling](app_screenshots/Error_Handling_for_Unique_Username.png)

---

## 🔥 Features

✅ **User Authentication**  
- Users can sign up and log in.  
- Passwords are securely stored using bcrypt.js.  
- User sessions persist via **localStorage**.  

✅ **Real-Time Chat with Socket.io**  
- Users can join **public chat rooms**.  
- **Messages are stored** in MongoDB for future retrieval.  
- Users **see only messages from their active room**.  

✅ **Private Messaging**  
- Users can click a username to start a **private chat**.  
- Messages sent privately are stored in MongoDB.  

✅ **Typing Indicator**  
- Displays "User is typing..." when someone is typing.  

✅ **Room Management**  
- Users can join and leave rooms dynamically.  

✅ **Logout Functionality**  
- Logging out clears session data and redirects users.  

---

## 🔧 Installation & Setup

1️⃣ Clone the repository:
```sh
git clone https://github.com/YOUR_GITHUB_USERNAME/studentID_lab_test1_chat_app.git
```

2️⃣ Navigate into the project folder:
```sh
cd studentID_lab_test1_chat_app
```

3️⃣ Install dependencies:
```sh
npm install
```

4️⃣ Create a `.env` file in the root directory and add:
```sh
MONGODB_URI_REMOTE=mongodb+srv://your-mongodb-user:your-mongodb-password@your-cluster.mongodb.net/chat_app?retryWrites=true&w=majority
PORT=3000
```

5️⃣ Start the server:
```sh
npm start
```

6️⃣ Open the browser at:
```
http://localhost:3000
```

---

## ✨ Future Improvements

🔹 User profile pictures.  
🔹 Push notifications for private messages.  
🔹 Improved UI with animations.  
🔹 Message reactions.  

---

## 📜 License

This project is licensed under the **MIT License**.

---

## 💡 Author

**Oscar Piedrasanta Diaz**  
📧 oscarpiediaz@gmail.com  
GitHub: [oHastee](https://github.com/oHastee)  

---

Enjoy chatting! 💬✨
