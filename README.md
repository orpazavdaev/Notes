<div align="center">

# 📋 My Tasks | המשימות שלי

### A Modern Task Management Mobile App

[![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

**A beautifully designed, fully functional task management application built with React Native & Expo**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Architecture](#-architecture) • [Installation](#-installation)

---

</div>

## 🌟 Overview

**My Tasks** is a cross-platform mobile application for managing daily tasks and to-dos. Built with modern technologies and best practices, this project demonstrates proficiency in mobile development, state management, and creating intuitive user interfaces.

### Key Highlights

- 🌐 **Full RTL Support** - Native Hebrew language support with complete right-to-left UI
- 📱 **Cross-Platform** - Single codebase for iOS, Android, and Web
- 🎨 **Modern UI/UX** - Clean, intuitive design with smooth animations
- 💾 **Offline-First** - Local data persistence with AsyncStorage
- 📦 **Production Ready** - Configured for App Store & Google Play deployment

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| ✅ **Task Management** | Create, edit, delete, and mark tasks as complete |
| 📅 **Interactive Calendar** | Visual calendar view for date-based task organization |
| ⏰ **Date & Time Picker** | Schedule tasks with specific dates and times |
| 🔄 **Real-time Updates** | Instant UI updates using React Context |
| 💾 **Auto-Save** | Automatic local storage persistence |
| 🌙 **RTL Layout** | Full Hebrew language and RTL support |

---

## 🛠 Tech Stack

### Frontend
- **React Native** - Cross-platform mobile framework
- **Expo** - Development platform and build tools
- **TypeScript** - Type-safe JavaScript

### State Management
- **React Context API** - Global state management
- **Custom Hooks** - Reusable logic encapsulation

### Data & Storage
- **AsyncStorage** - Persistent local storage
- **TypeScript Interfaces** - Strongly typed data models

### Development Tools
- **EAS Build** - Cloud-based app building
- **Expo CLI** - Development and debugging

---

## 🏗 Architecture

The project follows a **modular component-based architecture** with clear separation of concerns:

```
src/
├── components/          # Reusable UI Components
│   ├── Calendar.tsx         # Interactive calendar component
│   ├── TaskList.tsx         # Task list container
│   ├── TaskItem.tsx         # Individual task card
│   ├── AddTaskModal.tsx     # Task creation modal
│   ├── EditTaskModal.tsx    # Task editing modal
│   └── DateTimePicker.tsx   # Date/time selection
│
├── screens/             # Application Screens
│   ├── HomeScreen.tsx       # Main dashboard
│   └── CalendarScreen.tsx   # Calendar view
│
├── context/             # State Management
│   └── TaskContext.tsx      # Global task state & actions
│
├── types/               # TypeScript Definitions
│   └── index.ts             # Shared interfaces & types
│
├── constants/           # Configuration
│   └── theme.ts             # Colors, fonts, spacing
│
└── utils/               # Utilities
    └── storage.ts           # AsyncStorage helpers
```

### Design Patterns Used

- **Context Provider Pattern** - Centralized state management
- **Container/Presentational** - Separation of logic and UI
- **Custom Hooks** - Reusable stateful logic
- **Single Responsibility** - Each component has one purpose

---

## 🚀 Installation

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo Go app (for mobile testing)

### Quick Start

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/my-tasks-app.git

# Navigate to project directory
cd my-tasks-app

# Install dependencies
npm install

# Start the development server
npx expo start
```

### Running on Devices

| Platform | Command |
|----------|---------|
| 📱 **Mobile** | Scan QR code with Expo Go app |
| 🤖 **Android Emulator** | `npx expo start --android` |
| 🍎 **iOS Simulator** | `npx expo start --ios` |
| 🌐 **Web Browser** | `npx expo start --web` |

---

## 📦 Building for Production

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Build for Android (APK)
eas build -p android --profile preview

# Build for iOS
eas build -p ios --profile production

# Submit to stores
eas submit -p android  # Google Play
eas submit -p ios      # App Store
```

---

## 🎨 Customization

The app's theme can be easily customized via `src/constants/theme.ts`:

```typescript
export const COLORS = {
  primary: '#F5A623',      // Main accent color
  primaryLight: '#FFD59E', // Light variant
  primaryBg: '#FFF5EB',    // Background color
  // ... additional colors
};
```

---

## 📝 What I Learned

Building this project enhanced my skills in:

- 📱 **Mobile Development** - React Native best practices and patterns
- 🔄 **State Management** - Implementing Context API for complex state
- 🌐 **Internationalization** - RTL support and Hebrew localization
- 📦 **App Deployment** - Building and publishing to app stores
- 🎨 **UI/UX Design** - Creating intuitive mobile interfaces

---

## 🔮 Future Enhancements

- [ ] Push notifications for task reminders
- [ ] Cloud sync with Firebase
- [ ] Dark mode support
- [ ] Recurring tasks
- [ ] Task categories & tags
- [ ] Data export/import

---

<div align="center">

### ⭐ If you found this project interesting, please consider giving it a star!

</div>
