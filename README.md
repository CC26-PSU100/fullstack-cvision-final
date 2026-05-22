# CVision Fullstack Project

Proyek ini terdiri dari aplikasi Backend (Express + Prisma) dan Frontend (React + Vite).

## 🚀 Setup

### 1. Persiapan Database & Backend
```bash
cd backend
npm install
cp .env.example .env
# Sesuaikan DATABASE_URL di .env jika perlu
npx prisma generate
npx prisma migrate dev
npm run dev
```

### 2. Persiapan Frontend
```bash
cd frontend
npm install
npm run dev
```

## 🛠️ Detail Layanan

### Backend
- **Port:** 3000
- **Teknologi:** Express, Prisma, PostgreSQL, Cloudinary.
- **Fitur:** Auth (JWT), CV Upload, Analysis Detail.

### Frontend
- **Port:** 5173
- **Teknologi:** React 19, Vite, Tailwind CSS 4, DaisyUI.
- **Fitur:** Dashboard, Upload Zone, Result Analysis.

---
Pastikan backend berjalan sebelum mengakses fitur upload di frontend.
