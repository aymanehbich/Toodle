# 📝 Todo Application

A comprehensive Todo application built with **React**, **TypeScript**, and **Firebase**. It features a modern, responsive interface using **Mantine UI**, full user authentication, and real-time task management.

[![Live Preview](https://img.shields.io/badge/Live%20Preview-%F0%9F%9A%80-blue?style=for-the-badge)](https://toodle-hbich.vercel.app/)

---

## 🔐 Authentication System

- **Multiple Sign-in Methods:** Email/password and Google
- **User Registration:** Create accounts with email or Google
- **Password Management:** Forgot/reset password
- **Protected Routes:** Secure pages accessible only to logged-in users

## ✅ Task Management

- **Create Todos:** Add new tasks
- **Edit/Delete:** Update or remove tasks
- **Mark Complete/Incomplete**
- **Real-time Sync:** Tasks update instantly via Firebase
- **Default Todos:** Starter todos for new users

## 📊 Dashboard & Analytics

- **Monthly Stats:** Charts for todos created per month
- **Progress Breakdown:** Completed vs pending tasks
- **Live Dashboard:** Updates in real-time

## 👤 User Profile

- **Profile Management:** Update name/email info
- **Avatar Upload:** Upload profile images via Cloudinary
- **Password Change:** Secure password updates

## ⚙️ Technical Architecture

### Frontend

- **Framework:** React + TypeScript
- **Routing:** React Router v7
- **UI Library:** Mantine UI
- **Forms:** Mantine hooks
- **Notifications:** Toast alerts
- **Charts:** Recharts for analytics

### Backend & Data

- **Auth:** Firebase Authentication
- **Database:** Firestore (real-time)
- **File Uploads:** Cloudinary for image storage

## 🗂️ Project Structure

- **Component Hierarchy:** Modular structure
- **Context API:** Global auth state management
- **Layouts:** Shared layouts with sidebar/nav
- **Pages:** Per-route component files
- **Types:** TypeScript interfaces for safety

## 🚀 User Experience Flow

1. **Authentication:** Start from login or register
2. **Dashboard:** View real-time stats and charts
3. **Todo Page:** Create, update, manage todos
4. **Profile Settings:** Customize user info and avatar

---

## 📍 Live Demo

Click here to try it out:  
👉 **[Toodle App Live](https://toodle-hbich.vercel.app/)**

## 🧑‍💻 Tech Stack

```bash
Frontend: React, TypeScript, Mantine, Recharts  
Backend: Firebase Auth, Firestore  
Media: Cloudinary  
Deployment: Vercel
