# TaskFlow - Quick Start

## 🚀 Getting Started

### 1. Start the Server
```bash
npm run dev
```
Open: http://localhost:3000

### 2. Register Account
- Click **"สมัครสมาชิก"** (Register)
- Enter email, password, name
- Click **"สมัครสมาชิก"**

### 3. Login
- Enter email and password
- Click **"เข้าสู่ระบบ"**

### 4. Add Tasks
- Type task title
- Select priority
- Choose due date
- Click **"เพิ่มงาน"**

### 5. Manage Tasks
- ✓ Check to complete task
- 🔍 Filter (All/Active/Completed)
- 📊 View statistics
- 🚪 Logout when done

## 📁 Project Structure
```
taskflow/
├── app/                 # Next.js routes
├── prisma/             # Database
├── lib/                # Utilities
├── public/             # Static files
├── .env.local          # Configuration
└── package.json        # Dependencies
```

## 🔗 API Endpoints
- `GET /api/tasks` - List tasks
- `POST /api/tasks` - Create task
- `PUT /api/tasks` - Update task
- `DELETE /api/tasks?id=ID` - Delete task

## ✨ Features
- User authentication with NextAuth
- Task management (CRUD)
- Task filtering & priority
- Due date tracking
- Statistics dashboard
- Responsive design

---
**All systems operational. Ready to use!** ✅
