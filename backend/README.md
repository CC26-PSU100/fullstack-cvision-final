# CVision Backend

## Setup

### Install Dependencies

```bash
npm install
```

### Setup Environment

```bash
cp .env.example .env
```

`.env`

```env
DATABASE_URL="postgresql://user:password@localhost:5432/cvision"
JWT_SECRET="your-secret-key"
PORT=3000
```

### Create Database

```bash
createdb cvision
```

### Run Prisma

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### Start Server

```bash
npm run dev
```

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register |
| POST | `/api/auth/login` | Login |
| GET | `/api/cv` | Get CV list |
| POST | `/api/cv/upload-and-analyse` | Upload & analyse CV |
| GET | `/api/cv/:cvId/detailed-analysis` | Get analysis detail |
| DELETE | `/api/cv/:cvId` | Delete CV |
| GET | `/api/dashboard/stats` | Dashboard stats |

---

## Reset Database

```bash
npx prisma migrate reset --force
npx prisma db push
```