# Wasi Dental Clinic - Setup & Deployment

## Prerequisites
- Node.js 18+
- PostgreSQL
- npm or yarn

## Local Development

1. Clone the repository:
```bash
git clone <repo-url>
cd wasi-dental
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your database and service credentials
```

4. Set up the database:
```bash
npx prisma migrate dev --name init
npx prisma db seed
```

5. Start the development server:
```bash
npm run dev
```

6. Start the Socket.IO server (for live chat):
```bash
node server/index.js
```

## Build for Production

```bash
npm run build
npm start
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |
| `NEXT_PUBLIC_SITE_URL` | Site URL for CORS |
| `SOCKET_PORT` | Socket.IO server port |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | WhatsApp business number |

## Tech Stack

- **Frontend**: Next.js 15, React, Tailwind CSS, Framer Motion, GSAP
- **Backend**: Next.js API Routes, Prisma ORM, PostgreSQL
- **Realtime**: Socket.IO
- **Auth**: Supabase
- **Animations**: Framer Motion, GSAP, Lenis
- **UI**: ShadCN UI, Lucide Icons

## Features

- Cinematic hero with particles and parallax
- Glassmorphism design system
- Smooth scroll with Lenis
- Live chat with Socket.IO
- WhatsApp integration
- Step-by-step appointment booking
- Admin dashboard
- Dark/light mode
- SEO optimized
- Responsive design

## Deployment

### Vercel
1. Push to GitHub
2. Import to Vercel
3. Set environment variables
4. Deploy

### Database
1. Use Supabase or any PostgreSQL provider
2. Run migrations: `npx prisma migrate deploy`
3. Update DATABASE_URL in production
