

# TIET Social – The College Networking Website

## 🔍 Project Overview
**TIET Social** is an exclusive platform designed for college students to engage, collaborate, and share ideas. It offers a user-friendly interface and a secure space for students to build their network and foster a community of mutual interests.

## 📖 Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [Future Enhancements](#future-enhancements)

## ✨ Features
- **Real-Time Chat**: Instant and smooth communication between users.
- **User Authentication**: Secure login and signup functionality.
- **Post Creation and Engagement**: Users can share posts, comment, and interact with content.
- **Profile Management**: Personalized user profiles.
- **Profanity Filter**: Integrated filter to maintain respectful content.
- 
## Images

- **Signup Page:**  
  ![Signup](images/2.jpeg)

- **Login Page:**  
  ![Login](images/1.jpeg)

- **Home Page:**  
  ![Home feed](images/3.jpeg)

- **Profile Page:**  
  ![Profile](images/4.jpeg)

- **Post Feature:**  
  ![Post](images/5.jpeg)

- **Messaging Feature**  
  ![chat](images/6.jpeg)

## 🛠️ Tech Stack
### Frontend
- **React.js**: Modular and scalable UI framework.
- **Material-UI (MUI)**: Modern UI components for professional design.
- **React Router**: Enables seamless navigation.

### Backend
- **Node.js**: High-performance server environment.
- **Express.js**: Simplified RESTful services.
- **Socket.IO**: Enables real-time bi-directional communication.
- **JWT (JSON Web Tokens)**: Ensures secure user authentication.

### Database
- **MongoDB Atlas**: A cloud-based, highly scalable NoSQL database.

## 🚀 Installation
### Steps to get started:
1. **Clone the repository**:
   ```bash
   git clone https://github.com/Prerna-Nagpal/TIET_Social.git
   ```

2. **Install dependencies**:
   - Backend:
     ```bash
     cd server
     npm install
     ```
   - Frontend:
     ```bash
     cd client
     npm install
     ```

3. **Configure environment variables**:
   Create a `.env` file in the `server` directory:
   ```plaintext
   MONGO_URI='your-mongodb-connection-string'
   TOKEN_KEY='your-secret-token'
   PORT=4000
   ```

## 🔧 Environment Variables
Ensure the following variables are set in your environment:
- **`MONGO_URI`**: Connection string for MongoDB.
- **`TOKEN_KEY`**: Secret key for JWT token generation.
- **`PORT`**: The port for the backend server.

## 🎯 Usage
### Run the application:
1. **Start the backend**:
   ```bash
   cd server
   npm start
   ```

2. **Run the frontend**:
   ```bash
   cd client
   npm start
   ```

3. **Open in browser**:
   Navigate to `http://localhost:3000`.

## 🚀 Future Enhancements
- **Push Notifications**: Notify users of new interactions.
- **Dark Mode**: Include theme toggling between light and dark modes.
- **Advanced Search**: Add filters and sorting for enhanced search functionality.
- **Media Uploads**: Allow image and video sharing in posts.

## 🙏 Acknowledgments
<sub>Special thanks to **Material-UI** for its comprehensive component library and **MongoDB Atlas** for reliable cloud database solutions.</sub>
<<<<<<< HEAD
=======
=======
=======