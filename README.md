# 📄 Govt Docs Share

A web application to upload, store, and access important government documents securely using Firebase Authentication, Firestore, and Firebase Storage.

# 📌 Overview
Govt Docs Share is a lightweight, secure document-management system where users can:

Upload important files (PDFs, IDs, certificates, etc.)
Access uploaded documents anytime
Manage personal profile details
Login through phone OTP authentication

Built using React.js on the frontend and Firebase on the backend.

# 🚀 Features
## 🔐 Authentication

Phone number login
OTP verification using Firebase Authentication

## 📤 Document Upload

Upload files directly to Firebase Storage
Automatically store file metadata in Firestore

## 📚 Document Listing

View all uploaded documents
Fetch and display download links
Dynamically rendered list from Firestore

## 👤 User Profile

Manage and view logged-in user info
Secure session handling

## 🏗️ Tech Stack

### Frontend

React.js (CRA)
CSS (index.css)

### Backend / Cloud

Firebase Authentication (Phone Auth)
Firestore Database
Firebase Storage

### Tools & Config

firebase.json, firestore.rules, storage.rules
npm for package management

# Project Sructure
govt-docs-share/
│── public/
│── src/
│   ├── App.js
│   ├── DocumentList.js
│   ├── DocumentUpload.js
│   ├── PhoneAuth.js
│   ├── Profile.js
│   ├── firebase.js
│   ├── index.js
│   └── index.css
│── firebase.json
│── firestore.rules
│── storage.rules
│── package.json
└── README.md

# 🔧 Installation & Setup

## 1️⃣ Install dependencies
```sh
npm install
```
## 2️⃣ Start development server
```sh
npm start
```
## 3️⃣ Firebase Setup
```js
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};

const app = initializeApp(firebaseConfig);
export default app;
```
## Usage Flow

Enter mobile number
Receive OTP → Verify
Upload documents
View all uploaded files in the list
Download or view via storage URL

# 🔒 Firebase Security
Authentication-based access control
Firestore rules protect user-specific data
Storage rules restrict file access

## 🛠️ Future Enhancements

Role-based admin dashboard
Document sharing via link
Categorization (Aadhaar, PAN, Certificates, etc.)
File preview inside the app
Dark mode UI

# 👨‍💻 Author
Dipesh Ghosh
Solo Developer • Web Development • React & Firebase Projects
