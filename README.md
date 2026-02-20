# 🌺 UQ Messenger

**The ICQ Spiritual Successor for 2026**

> Remember the flower? The "Uh-oh!" sound? Your 9-digit number? **It's all back.**

![Status](https://img.shields.io/badge/status-working-brightgreen) ![Version](https://img.shields.io/badge/version-0.0.0-blue)

---

## 🎯 What is UQ?

UQ is a **fully functional** modern messenger that captures the authentic ICQ 2001b experience with:

- 🌺 **Real ICQ 2001b Design** - Windows 98 aesthetic, three-panel layout
- 🔢 **Unique UQ Numbers** - Your own 5-digit ID (like #48291)
- ⚡ **Real-Time Messaging** - Instant delivery with actual "Uh-oh!" sound
- 🟢 **Presence System** - Online, Away, Busy, Invisible
- 🌍 **Global User Registry** - Browse and add anyone
- 🔐 **Magic Link Auth** - No passwords needed

---

## 🚀 Quick Start

```bash
cd /Users/asychov/uq
npm run dev
# Open http://localhost:5174/
```

**That's it!** The app is fully working with real database and messaging.

---

## ✨ Features Status

### ✅ Working Now (Production Ready)
- ✅ Magic link authentication (no passwords)
- ✅ Unique 5-digit UQ numbers auto-generated
- ✅ Real-time messaging with full persistence
- ✅ Contact management (add/remove)
- ✅ Global user registry with search
- ✅ Status system (Online/Away/Busy/Invisible)
- ✅ Dynamic flower logo (changes color with status)
- ✅ **REAL ICQ "Uh-oh!" sound** (authentic audio file)
- ✅ Three-panel ICQ 2001b interface
- ✅ Marketing landing page with animations
- ✅ Desktop apps (macOS, Windows, Linux via Electron)
- ✅ Message history persistence

### 🚧 Not Implemented (Intentionally Removed from UI)
- ❌ AI translation (not adding)
- ❌ Chat rooms (schema exists, no UI)
- ❌ File sharing
- ❌ User profile pages

---

## 🛠️ Tech Stack

| Layer | Technology | Notes |
|-------|------------|-------|
| **Frontend** | React 19 + TypeScript | No class components |
| **Build Tool** | Vite 7.3.1 | Fast HMR |
| **Styling** | Pure CSS | NO Tailwind (removed) |
| **Backend** | Supabase | PostgreSQL + Realtime |
| **Auth** | Supabase Auth | Magic links only |
| **Desktop** | Electron 40.4.1 | Cross-platform |
| **Routing** | React Router DOM | /login, /app routes |
| **AI** | None | Intentionally not adding |

---

## 📁 Project Structure

```
/Users/asychov/uq/
├── src/
│   ├── pages/
│   │   ├── Landing.tsx              ← Marketing page with animated flower
│   │   ├── Login.tsx                ← Magic link auth
│   │   └── Home-ICQ-Style.tsx       ← Main 3-panel chat interface
│   ├── components/
│   │   ├── FlowerLogo.tsx           ← Dynamic status flower (SVG)
│   │   ├── UserRegistry.tsx         ← Global user browser
│   │   └── AddContactModal.tsx      ← Add contact modal
│   ├── lib/
│   │   ├── supabase.ts              ← DB client + isConfigured flag
│   │   └── sounds.ts                ← Real ICQ sound player
│   └── index.css                    ← Windows 98 ICQ styling
├── public/
│   └── sounds/
│       └── icq.mp3                  ← REAL ICQ "Uh-oh!" sound
├── electron/
│   └── main.js                      ← Desktop app entry
├── supabase-schema.sql              ← Full database schema
├── fix-auth-trigger.sql             ← Auth fix (if needed)
├── .env                             ← Supabase credentials (configured)
├── PROJECT_NOTES.md                 ← Detailed project state
├── ARCHITECTURE.md                  ← Technical architecture
└── QUICKSTART.md                    ← Commands & troubleshooting
```

---

## 🗄️ Database (Supabase)

**Live Database:** `https://wjzgbedvltnlzjataavt.supabase.co`

### Tables
```sql
users         (id, username, email, uq_number, status, created_at)
contacts      (id, user_id, contact_id, created_at)
messages      (id, sender_id, recipient_id, content, created_at)
rooms         (id, name, created_by, created_at)         -- Not in UI yet
room_members  (room_id, user_id, joined_at)             -- Not in UI yet
```

### How It Works
1. User signs up → trigger creates profile with random UQ number
2. Messages saved to `messages` table forever
3. Real-time sync via Supabase WebSocket
4. Status updates propagate instantly to all users

---

## 🎨 Design System

### Colors (Windows 98 / ICQ Theme)
- **Background:** `#ece9d8` (beige), `#c0c0c0` (gray)
- **ICQ Blue:** `#0054e3` (primary), `#0041b8` (dark)
- **Status Colors:**
  - Online: `#00ff00` (green)
  - Away: `#ffff00` (yellow)
  - Busy: `#ff0000` (red)
  - Invisible: `#999999` (gray)

### Typography (2x Original ICQ)
- **Base:** 16px (Tahoma, Arial)
- **Buttons:** 14px
- **Titles:** 24px+
- **Monospace:** UQ numbers

### UI Elements
- `.icq-window` - Beveled border boxes
- `.icq-title-bar` - Blue gradient headers
- `.icq-btn` - 3D push buttons
- `.icq-input` - Inset text fields
- Custom scrollbars (Windows 98 style)

---

## 📋 Common Commands

```bash
# Development
npm run dev                    # Start dev server (port 5174)
npm run build                  # Build web app → dist/
npm run preview                # Preview production build

# Desktop App
npm run electron               # Run Electron (needs dev server)
npm run electron:build         # Build macOS .dmg
npm run electron:build:all     # Build all platforms

# Dependencies
npm install --cache ~/.npm     # Install (with cache fix)
```

---

## 🌐 URLs

- **Dev Server:** http://localhost:5174/
- **Landing:** http://localhost:5174/
- **Login:** http://localhost:5174/login
- **App:** http://localhost:5174/app
- **Supabase:** https://supabase.com/dashboard

---

## 🐛 Troubleshooting

### White Screen
- ✅ **FIXED** - Removed Tailwind, using pure CSS

### Scrolling Issues
- ✅ **FIXED** - Changed body `overflow: hidden` to `auto`

### "Database error saving new user"
- ✅ **FIXED** - Run `fix-auth-trigger.sql` in Supabase

### Port 5173 in Use
- ✅ **AUTO-HANDLED** - Vite switches to 5174 automatically

---

## 📚 Documentation

| File | Purpose |
|------|---------|
| **PROJECT_NOTES.md** | Complete project state, features, what's working |
| **ARCHITECTURE.md** | Technical architecture, data flows, system design |
| **QUICKSTART.md** | Commands, troubleshooting, quick reference |
| **README.md** | This file - project overview |

---

## 🎯 How Messaging Works

1. **Send Message:**
   - User types message → clicks Send
   - Inserts into `messages` table
   - Recipient's Realtime subscription fires

2. **Receive Message:**
   - WebSocket event arrives
   - Message appended to chat
   - Plays `/sounds/icq.mp3` (real ICQ sound!)

3. **Message History:**
   - Loaded from database when selecting contact
   - All messages persist forever
   - No pagination yet (loads all)

---

## 📦 Build Sizes

- **Web App:** ~408 KB (`dist/`)
- **Desktop App:** ~115 MB (`dist-electron/`)
  - Electron: ~100 MB
  - App: ~408 KB
  - Node modules: ~14 MB

---

## 🚀 Deployment

### Web App
```bash
npm run build
# Upload dist/ to Vercel, Netlify, or any static host
```

### Desktop App
```bash
npm run electron:build:all
# Distribute .dmg (macOS), .exe (Windows), .AppImage (Linux)
```

---

## 🤝 Contributing

This is a personal nostalgia project. Feel free to:
- Report bugs
- Suggest features
- Fork and experiment
- Share your UQ number! 🌺

---

## 📄 License

Not specified - Personal project

---

## 🙏 Acknowledgments

- **Inspired by:** ICQ (1996-2024) - The original instant messenger
- **Design:** ICQ 2001b + Windows 98 aesthetic
- **Sound:** Authentic ICQ "Uh-oh!" notification

---

**Remember the flower. Remember the sound. Welcome back to 2001.** 🌺

*"Uh-oh!"* - ICQ, 1996

---

## 📞 Quick Reference

| Item | Value |
|------|-------|
| **Project Path** | `/Users/asychov/uq` |
| **Dev URL** | http://localhost:5174/ |
| **Database** | Supabase (configured in .env) |
| **Status** | ✅ Fully working - production ready |
| **Last Updated** | 2026-02-20 |
