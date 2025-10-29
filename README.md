# Expense Tracker — Frontend

**A lightweight React + Vite frontend** for the Expense Tracker app.  
Connects to a Node/Express backend (MongoDB Atlas) and shows expenses, supports create/update/delete, and displays a visual summary (pie + bar charts) using **Recharts**.


## Live Demo
Open the app: https://expense-frontend-bay.vercel.app/ 


Backend (API): https://expense-backend-5eyp.onrender.com

---

## Features
- Create, read, update, delete expenses (CRUD)
- Category-wise aggregation and total expenses
- Interactive charts (Pie + Bar) using **Recharts**
- Responsive layout for desktop and mobile
- Easy to configure API base via `VITE_API_BASE` env var

---

## Tech Stack
- Frontend: React (Vite)
- HTTP client: Axios
- Charts: Recharts
- Styling: Plain CSS (single stylesheet)
- Hosting: Vercel 

---


## Local Setup (Development)

1. Clone the repo
```bash
git clone https://github.com/your-username/your-frontend-repo.git
cd your-frontend-repo
