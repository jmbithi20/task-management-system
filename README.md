# Task Management System

A comprehensive task management application built with React, Vite, and Firebase. This system allows administrators to manage users and assign tasks, while users can view and update their assigned tasks.

## Features

### Administrator Features
- **User Management**: Create, edit, and delete users with proper authentication
- **Task Management**: Create, edit, and delete tasks
- **Task Assignment**: Assign tasks to specific users with deadlines
- **Priority Management**: Set task priorities (Low, Medium, High)
- **Email Notifications**: Automatic email notifications when tasks are assigned

### User Features
- **Task Viewing**: View all tasks assigned to them
- **Status Updates**: Update task status (Pending, In Progress, Completed)
- **Deadline Tracking**: View task deadlines with overdue indicators
- **Responsive Design**: Works on desktop and mobile devices

### Technical Features
- **Firebase Authentication**: Secure user authentication
- **Firestore Database**: Real-time data storage
- **Role-based Access**: Different interfaces for admins and users
- **Material-UI**: Modern, responsive UI components
- **Email Notifications**: Simulated email service for task assignments

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase project with Authentication and Firestore enabled

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd task-manager
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Firebase Configuration

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication with Email/Password provider
3. Create a Firestore database
4. Get your Firebase configuration

### 4. Update Firebase Config

Edit `src/firebase/config.js` and replace the placeholder values with your Firebase configuration:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id"
};
```

### 5. Firestore Security Rules

Set up Firestore security rules to allow authenticated access:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Admins can read all users
    match /users/{userId} {
      allow read, write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Users can read tasks assigned to them
    match /tasks/{taskId} {
      allow read: if request.auth != null && 
        (resource.data.assignedTo == request.auth.uid || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

### 6. Run the Application
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Usage

### Creating an Admin Account
1. Navigate to the signup page
2. Fill in your details and select "Administrator" as the role
3. Complete the registration

### Managing Users (Admin)
1. Log in as an administrator
2. Navigate to the "User Management" tab
3. Use the "Add User" button to create new users with proper authentication
4. You can edit existing users' roles and information
5. Delete users as needed (except yourself)

### Creating Tasks (Admin)
1. Navigate to the "Task Management" tab
2. Click "Create Task"
3. Fill in task details:
   - Title and description
   - Assign to a specific user
   - Set deadline and priority
4. Save the task (user will receive email notification)

### Managing Tasks (Users)
1. Log in as a regular user
2. View all assigned tasks on the dashboard
3. Update task status using the "Update Status" button
4. Use quick action buttons to start or complete tasks

## Project Structure

```
src/
├── components/          # React components
│   ├── Login.jsx       # Login form
│   ├── Signup.jsx      # Registration form
│   ├── Dashboard.jsx   # Main dashboard
│   ├── AdminDashboard.jsx  # Admin interface
│   ├── UserDashboard.jsx   # User interface
│   ├── UserManagement.jsx  # User management
│   └── TaskManagement.jsx  # Task management
├── contexts/           # React contexts
│   └── AuthContext.jsx # Authentication context
├── services/          # API services
│   ├── taskService.js # Task operations
│   ├── userService.js # User operations
│   └── emailService.js # Email notifications
├── firebase/          # Firebase configuration
│   └── config.js      # Firebase setup
└── App.jsx           # Main application component
```

## Email Notifications

The system includes a simulated email notification service. In a production environment, you would integrate with services like:
- SendGrid
- Mailgun
- Firebase Functions with email service
- AWS SES

## Security Features

- Role-based access control
- Protected routes
- Firebase Authentication
- Firestore security rules
- Input validation

## Technologies Used

- **Frontend**: React 19, Vite
- **UI Framework**: Material-UI (MUI)
- **Routing**: React Router DOM
- **Backend**: Firebase (Authentication, Firestore)
- **Styling**: CSS3 with Material-UI theming

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository.
