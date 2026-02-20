# 🚀 Complete UQ Messenger Setup - Production Ready

## Step-by-Step: From Zero to Production

### Part 1: Set Up Supabase Backend (5 minutes)

1. **Create Supabase Account**
   - Go to https://supabase.com
   - Sign up for free account
   - Create a new project
   - Choose a region close to your users
   - Set a strong database password (save it!)
   - Wait 2-3 minutes for project to initialize

2. **Run Database Schema**
   - In Supabase dashboard, click "SQL Editor"
   - Click "New Query"
   - Copy ALL contents from `supabase-schema.sql`
   - Paste and click "Run"
   - Wait for "Success" message

3. **Get Your API Keys**
   - Go to Project Settings > API
   - Copy:
     - Project URL (starts with https://xxx.supabase.co)
     - anon/public key (long string)

4. **Configure Authentication**
   - Go to Authentication > Providers
   - Enable "Email" provider
   - Configure email templates (optional)
   - Go to Authentication > URL Configuration
   - Add your domain (or use localhost:5173 for testing)

### Part 2: Get Anthropic API Key (2 minutes)

1. Go to https://console.anthropic.com
2. Sign up or log in
3. Go to API Keys
4. Create new key
5. Copy the key (starts with sk-ant-)

### Part 3: Configure Your App

Create `.env` file in project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_ANTHROPIC_API_KEY=sk-ant-your-key-here
```

Replace with YOUR actual keys!

### Part 4: Test Locally

```bash
npm run dev
```

Open http://localhost:5173/app.html

Now you should see:
- Real login page
- Ability to create account
- Magic link email authentication
- Get your UQ number on signup!

### Part 5: Build Everything for Production

```bash
# Build web app
npm run build

# Build macOS app
npm run electron:build
```

### Part 6: Deploy Web App

**Option A: Vercel (Easiest)**
```bash
npm install -g vercel
vercel
```
Follow prompts, add environment variables in Vercel dashboard

**Option B: Netlify**
```bash
npm install -g netlify-cli
netlify deploy --prod
```
Add environment variables in Netlify dashboard

### Part 7: Distribute Desktop App

Your `.dmg` file is in `dist-electron/`
- Upload to your website for download
- Or create GitHub release
- Or submit to Mac App Store (requires developer account)

## 🎯 What You'll Have

✅ Real user authentication with magic links
✅ Each user gets unique UQ number
✅ Real-time messaging between users
✅ Presence system (online/away/busy/invisible)
✅ Contact management
✅ AI translation (any language to any language)
✅ AI chat summaries
✅ Desktop app (macOS, Windows, Linux)
✅ Web app (deploy anywhere)
✅ Production-ready homepage

## 🔧 Troubleshooting

**"Demo Mode - No Backend"**
- Check your .env file exists
- Make sure keys are correct
- Restart dev server

**White screen**
- Check browser console for errors
- Make sure Supabase project is running
- Verify API keys are correct

**Can't send messages**
- Make sure you ran the SQL schema
- Check Supabase logs for errors
- Verify RLS policies are enabled

## 💰 Costs

- **Supabase Free Tier:**
  - 500MB database
  - 50,000 monthly active users
  - 2GB bandwidth
  - Realtime connections

- **Anthropic Claude:**
  - Pay per token
  - ~$0.01 per translation
  - ~$0.02 per summary

- **Hosting:**
  - Vercel: Free for personal
  - Netlify: Free for personal

## 🚀 Go Live Checklist

- [ ] Supabase project created
- [ ] Database schema executed
- [ ] Environment variables configured
- [ ] App tested locally
- [ ] Web app built and deployed
- [ ] Desktop app built and distributed
- [ ] Custom domain configured (optional)
- [ ] Analytics added (optional)
- [ ] Error monitoring setup (optional)

---

**Ready to start? Let me walk you through setting up Supabase first!**
