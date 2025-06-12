# Todo Application Overview

This is a comprehensive Todo application built with **React**, **TypeScript**, and **Firebase**. The application provides a modern, responsive user interface using **Mantine UI** components and offers complete user authentication flow along with task management capabilities.

## Core Features

### Authentication System

- **Multiple Sign-in Methods:** Email/password and Google authentication
- **User Registration:** New users can create accounts with email or social providers
- **Password Management:** Includes forgot/reset password functionality
- **Protected Routes:** Authenticated access to app features

### Task Management

- **Todo Creation:** Users can create new tasks
- **Task Manipulation:** Edit, delete, and mark tasks as complete/incomplete
- **Real-time Updates:** Changes sync with Firebase in real-time
- **Default Todos:** New users receive starter todo items

### Dashboard & Analytics

- **Visual Statistics:** Chart visualization of todos created by month
- **Completed vs. Total:** Visual breakdown of completed versus pending tasks
- **Real-time Data:** Dashboard updates as todo status changes

### User Profile

- **Profile Management:** Users can update their profile information
- **Avatar Upload:** Support for profile picture uploads to Cloudinary
- **Password Change:** Email/password users can update their credentials

## Technical Architecture

### Frontend

- **Framework:** React with TypeScript
- **Routing:** React Router v7 for navigation
- **UI Components:** Mantine UI library
- **Form Handling:** Mantine form hooks
- **Notifications:** Toast notifications for user feedback
- **Data Visualization:** Recharts for analytics dashboards

### Backend & Data

- **Authentication:** Firebase Authentication
- **Database:** Firestore for data storage
- **File Storage:** Cloudinary for image uploads
- **Real-time Updates:** Firestore listeners for live data

## Project Structure

- **Component Organization:** Well-structured component hierarchy
- **Context API:** Authentication state management
- **Layouts:** Main layout with navigation sidebar
- **Pages:** Separate page components for each route
- **Types:** TypeScript interfaces for type safety

## User Experience Flow

1. **Authentication:** Users start at login/register screens
2. **Dashboard:** After authentication, they see todo statistics
3. **Todo Management:** Create, edit, and delete todos on the todo page
4. **Profile:** Access profile settings to customize their experience

The application follows modern React practices with hooks, Context API for state management, and a clean, component-based architecture that separates concerns for better maintainability.
