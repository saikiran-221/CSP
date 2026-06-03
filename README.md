# 🎓 DoubtExchange — Smart Academic Doubt Platform

An AI-assisted anonymous academic collaboration platform for school students and teachers.

## ✨ Features

- 🔒 **Anonymous doubt posting** — ask without fear of judgement
- 🏫 **Subject-wise teacher moderation** — each teacher sees only their subject
- 📸 **Rich answers** — teachers can reply with text, images, or explanation videos
- ⭐ **Best answer system** — students mark the most helpful answer
- 🔔 **Notifications** — get notified when your doubt is answered
- 🔍 **Search & filter** — find existing answers before asking
- 🛡️ **Moderation panel** — report and remove inappropriate content
- 📱 **Fully responsive** — works on mobile, tablet and desktop

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + Vite 8 |
| Styling | Tailwind CSS v4 |
| Backend | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Storage | Supabase Storage |
| Deployment | Vercel |

## 🛠️ Local Development

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/doubt-exchange.git
cd doubt-exchange

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Fill in your Supabase URL and anon key

# 4. Run the dev server
npm run dev
```

## 🗄️ Database Setup

Run the SQL from `supabase_setup.sql` in your Supabase SQL Editor to create all tables, RLS policies, and triggers.

## 📦 Deployment

1. Push to GitHub
2. Import project on [vercel.com](https://vercel.com)
3. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy!

## 👤 User Roles

- **Student** — post anonymous doubts, search, upvote answers
- **Teacher** — answer doubts with text/image/video, moderate content
- **Admin** — manage users and reports (future)

## 📄 License

MIT License — free to use and modify.
