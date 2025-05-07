# 📝 Task Management App

A full-stack **Task Management Application** that enables users to create, assign, update, filter, and delete tasks in real time. Designed with role-based access (Admin/User), real-time notifications using Socket.IO, and secure authentication. Built for productivity and collaboration.

---

## 🛠️ Technology Stack

### 🔧 Backend

- **Node.js** – JavaScript runtime environment
- **Express.js** – Web framework for Node.js
- **MongoDB** – NoSQL database
- **Mongoose** – ODM for MongoDB
- **JWT (JSON Web Tokens)** – Authentication
- **Socket.IO** – Real-time communication
- **Bcrypt.js** – Password hashing

### 🎨 Frontend

- **React** – Frontend UI library
- **Tailwind CSS** – Utility-first CSS framework
- **React Router** – SPA navigation
- **Axios** – API requests
- **React Toastify** – Toast notifications
- **Vite** – Fast development build tool

---

## ✨ Features

### 👤 Authentication & Authorization

- User registration & login with JWT
- Role-based access (Admin vs User)
- Protected routes

### 📋 Task Management

- Create, view, edit, and delete tasks
- Assign tasks to users
- Filter by **status**, **priority**, and **search keyword**
- Real-time notifications when a task is assigned

### 🔁 Real-Time Updates

- Admins can assign tasks
- Users receive live task notifications via Socket.IO

### 🧑‍💼 Admin Capabilities

- Assign tasks to any user
- Delete tasks
- View all tasks in the system

### 👨‍💻 User Capabilities

- View tasks assigned to them or created by them
- Edit/update their own tasks
- Cannot delete tasks (restricted)
