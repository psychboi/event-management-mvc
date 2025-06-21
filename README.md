# Event Management System - MVC Architecture

A comprehensive community event management web application built with Next.js following the Model-View-Controller (MVC) architectural pattern.

## 🏗️ Architecture Overview

This application demonstrates a clear separation of concerns using the MVC pattern:

### **Model** (`/lib/models/` & `/lib/database.ts`)
- **Event Model**: Defines the event data structure and validation logic
- **Database Layer**: Handles data persistence using localStorage (simulating a database)
- **Authentication Model**: Manages user sessions and authentication logic

### **View** (`/components/`)
- **LoginForm**: User authentication interface
- **EventDashboard**: Main dashboard displaying all events with analytics
- **EventForm**: Form for creating and editing events

### **Controller** (`/lib/actions.ts`)
- **Server Actions**: Handle business logic and data flow
- **Authentication Controller**: Manages login/logout operations
- **Event Controller**: Handles CRUD operations for events

## 🚀 Features

### ✅ Complete CRUD Operations
- **Create**: Add new events with full validation
- **Read**: View all events in an organized dashboard
- **Update**: Edit existing events with pre-filled forms
- **Delete**: Remove events with confirmation dialogs

### 🔐 Authentication System
- Secure login/logout functionality
- Session management with HTTP-only cookies
- Protected routes requiring authentication

### 📊 Advanced Dashboard
- **Search & Filter**: Real-time search functionality
- **Status Indicators**: Visual badges for event status
- **Professional Design**: Clean, modern UI with responsive layout

### ✨ Enhanced Features
- **Event Categories**: 9 predefined categories
- **Priority Levels**: Low, Medium, High priority system
- **Attendee Limits**: Optional maximum capacity for events
- **Advanced Validation**: Client and server-side validation
- **Persistent Storage**: Events saved to localStorage

## 🛠️ Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Storage**: localStorage (simulating database)
- **Authentication**: Custom session-based auth

## 🏃‍♂️ Getting Started

1. **Clone the Repository**
   \`\`\`bash
   git clone https://github.com/yourusername/event-management-mvc.git
   cd event-management-mvc
   \`\`\`

2. **Install Dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Run Development Server**
   \`\`\`bash
   npm run dev
   \`\`\`

4. **Open Application**
   Navigate to `http://localhost:3000`

5. **Login**
   Use the credentials: admin / password

## 📁 Project Structure

\`\`\`
├── app/
│   ├── page.tsx              # Home page (redirects to dashboard)
│   ├── login/page.tsx        # Login page
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── components/
│   ├── EventDashboard.tsx    # Main dashboard
│   ├── EventForm.tsx         # Event creation/editing form
│   └── LoginForm.tsx         # Authentication form
├── lib/
│   ├── models/
│   │   └── Event.ts          # Event model and validation
│   ├── actions.ts            # Server actions (controllers)
│   ├── auth.ts               # Authentication logic
│   └── database.ts           # Database operations
\`\`\`

## 🎯 MVC Implementation Details

### Model Layer
- **Event Model**: Defines data structure, validation rules, and business logic
- **Database Operations**: Abstracts data persistence with CRUD operations
- **Type Safety**: Full TypeScript interfaces for data integrity

### View Layer
- **Component-Based**: Modular React components for each UI section
- **State Management**: Local state for UI interactions
- **Responsive Design**: Mobile-first approach with Tailwind CSS

### Controller Layer
- **Server Actions**: Handle form submissions and data operations
- **Authentication**: Manage user sessions and route protection
- **Validation**: Server-side validation and error handling

## 🔒 Security Features

- HTTP-only cookies for session management
- Server-side authentication validation
- Input sanitization and validation
- Protected routes with automatic redirects

## 🌐 Live Demo

**Live Application**: [https://your-app-name.vercel.app](https://your-app-name.vercel.app)

**Login Credentials**: admin / password

## 📝 Future Enhancements

- Real database integration (PostgreSQL/MySQL)
- Email notifications for events
- Calendar integration
- User roles and permissions
- File upload for event images
- Advanced reporting and analytics

## 🤝 Contributing

This project demonstrates MVC architecture principles and can be extended with additional features. The codebase is well-documented and follows best practices for maintainability.

## 📄 License

This project is created for educational purposes as part of a web development assignment.

---

*This project was created as part of a Web Development assignment focusing on MVC architecture implementation.*
