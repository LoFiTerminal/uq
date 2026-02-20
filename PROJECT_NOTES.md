# UQ Messenger - Project Notes

**Last Updated:** 2026-02-20
**Status:** Core features working, web app functional, desktop builds available

---

## 🌺 Project Overview

**UQ Messenger** is a spiritual successor to ICQ, built with modern web technologies but maintaining the authentic ICQ 2001b look and feel. It's a real-time messaging app with magic link authentication, unique UQ numbers (like ICQ's 9-digit IDs), and a Windows 98-style interface.

**Live Development Server:** http://localhost:5174/
**Main App Route:** http://localhost:5174/app

---

## 🛠️ Tech Stack

- **Frontend:** React 19, TypeScript, Vite 7.3.1
- **Styling:** Pure CSS (Windows 98/ICQ theme) - NO Tailwind
- **Backend:** Supabase (PostgreSQL + Realtime + Auth)
- **Desktop:** Electron 40.4.1
- **Routing:** React Router DOM
- **AI:** Anthropic Claude API (placeholder, not implemented)

---

## 📁 Key Files & Structure

### Core Application Files
```
/Users/asychov/uq/
├── src/
│   ├── App.tsx                      # Main app with React Router (/, /login, /app)
│   ├── main.tsx                     # Entry point
│   ├── index.css                    # ICQ Windows 98 global styles
│   │
│   ├── pages/
│   │   ├── Landing.tsx              # NEW: Marketing landing page with animated flower
│   │   ├── Login.tsx                # Magic link auth page
│   │   ├── Home-ICQ-Style.tsx       # Main 3-panel ICQ interface (contacts + chat)
│   │   └── App-Demo.tsx             # Standalone demo (not used in production)
│   │
│   ├── components/
│   │   ├── FlowerLogo.tsx           # Dynamic SVG flower (changes color by status)
│   │   ├── UserRegistry.tsx         # Global user browser/search
│   │   └── AddContactModal.tsx      # Add contact by UQ number
│   │
│   └── lib/
│       ├── supabase.ts              # Supabase client + isConfigured flag
│       └── sounds.ts                # Real ICQ "Uh-oh!" sound player
│
├── public/
│   ├── sounds/
│   │   └── icq.mp3                  # REAL ICQ notification sound
│   ├── index-retro.html             # Old retro landing page (deprecated)
│   └── app.html                     # Old entry point (deprecated)
│
├── electron/
│   └── main.js                      # Electron main process
│
├── supabase-schema.sql              # Complete database schema
├── fix-auth-trigger.sql             # Fixed user creation trigger
├── .env                             # Supabase credentials (configured)
└── package.json                     # Dependencies + Electron build config
```

---

## 🗄️ Database Schema (Supabase)

**Connection:**
- URL: `https://wjzgbedvltnlzjataavt.supabase.co`
- Configured in `.env`

### Tables

#### `users`
```sql
- id (uuid, primary key, references auth.users)
- username (text)
- email (text)
- uq_number (integer, unique) -- 5-digit random number
- status (text) -- 'online' | 'away' | 'busy' | 'invisible'
- created_at (timestamp)
```

#### `contacts`
```sql
- id (uuid, primary key)
- user_id (uuid, references users)
- contact_id (uuid, references users)
- created_at (timestamp)
```

#### `messages`
```sql
- id (uuid, primary key)
- sender_id (uuid, references users)
- recipient_id (uuid, references users)
- content (text)
- created_at (timestamp)
```

#### `rooms` & `room_members`
- Defined in schema but NOT YET IMPLEMENTED in UI

### Triggers
- `on_auth_user_created` → calls `handle_new_user()` to auto-create user profile with UQ number on signup

---

## ✅ What's WORKING

### 1. Authentication
- Magic link email authentication via Supabase Auth
- No passwords - click email link to sign in
- Auto-generates UQ number on first signup
- Session persistence

### 2. User Profiles
- Unique 5-digit UQ numbers (like #48291)
- Username from email prefix
- Status system: Online 🟢, Away 🌙, Busy 🔴, Invisible 👻
- Status updates persist to database

### 3. Dynamic FlowerLogo Component
- Changes color based on status:
  - **Online:** All green (#00ff00)
  - **Away:** Yellow petals + green center
  - **Busy:** Yellow petals + red center (#ff0000)
  - **Invisible:** All gray
- Used throughout app (login, landing, contact list, footer)
- Animated on landing page (floating effect)

### 4. Global User Registry
- Browse all registered users (fetches 50 most recent)
- Client-side search by username or UQ number
- Shows real-time online status
- One-click add to contacts
- Located: `src/components/UserRegistry.tsx`

### 5. Contacts System
- Add contacts by UQ number or from registry
- Contact list in middle panel
- Online/All tabs filter view
- Shows status indicators (colored dots)
- Persists to `contacts` table

### 6. Real-Time Messaging
- **Message Storage:** All messages saved to `messages` table with sender_id, recipient_id, content, timestamp
- **Message History:** Loads full conversation when selecting contact
- **Real-Time Sync:** Uses Supabase Realtime (WebSocket) to instantly receive new messages
- **Notifications:** Plays REAL ICQ "Uh-oh!" sound (`/sounds/icq.mp3`) on message receipt
- **Three-panel layout:** Left menu → Contact list → Chat window

### 7. Landing Page
- Marketing page at `/` (root)
- ICQ color palette (#ece9d8, #0054e3)
- Animated flower logo (floating + rotating)
- Live chat demo (messages appear every 2 seconds)
- Feature showcase
- Download buttons for all platforms
- "START HERE" CTA button

### 8. Sounds
- Real ICQ notification sound from `/public/sounds/icq.mp3`
- Plays on incoming messages
- Uses HTML Audio API (50% volume)

---

## ❌ NOT Implemented (Removed from UI)

- ~~AI Translation~~ - Intentionally not adding
- Chat rooms (schema exists, no UI)
- File sharing
- User profiles at `/u/[number]`
- Idle detection
- Multiple message notifications sounds
- Read receipts
- Typing indicators

---

## 🎨 Design System

### Color Palette
- **Background:** `#c0c0c0` (gray), `#ece9d8` (beige), `#d4d0c8` (darker beige)
- **ICQ Blue:** `#0054e3` (primary), `#0041b8` (darker)
- **Status Colors:**
  - Online: `#00ff00`
  - Away: `#ffff00`
  - Busy: `#ff0000`
  - Invisible: `#c0c0c0`

### CSS Classes (in `src/index.css`)
- `.icq-window` - Windows 98 beveled border box
- `.icq-title-bar` - Blue gradient title bar
- `.icq-btn` - Beveled 3D button
- `.icq-input` - Inset input field
- Custom scrollbars (Windows 98 style)

### Font Sizes (2x larger than original ICQ)
- Base text: `16px` (was 11px)
- Buttons: `14px`
- Titles: `24px+`
- All UI scaled 2x per user request

---

## 🚀 How to Run

### Development
```bash
cd /Users/asychov/uq
npm run dev
# Opens on http://localhost:5174/ (5173 was in use)
```

### Build Web App
```bash
npm run build
# Output: dist/ folder (408 KB)
```

### Build Desktop Apps
```bash
npm run electron:build        # macOS only
npm run electron:build:all    # macOS + Windows + Linux
# Output: dist-electron/ folder
```

### Run Electron in Dev
```bash
npm run electron
# Loads from localhost:5173
```

---

## 🐛 Known Issues & Solutions

### 1. Port 5173 in Use
- Vite auto-switches to 5174
- Always check dev server output for actual port

### 2. White Screen Issues (RESOLVED)
- Was caused by Tailwind v4 config issues
- Solution: Removed Tailwind, using pure CSS
- Demo mode added for when Supabase not configured

### 3. TypeScript Import Errors (RESOLVED)
- Error: "Message is a type and must be imported using type-only import"
- Solution: Use `import type { Message }` instead of `import { Message }`

### 4. "Database error saving new user" (RESOLVED)
- Fixed with `fix-auth-trigger.sql`
- Trigger needed SECURITY DEFINER SET search_path

### 5. Scrolling Issues (RESOLVED)
- Was `overflow: hidden` on body
- Changed to `overflow-y: auto, overflow-x: hidden`

---

## 📝 Development Notes

### React Router Structure
```
/ (Landing)
├── /login (Login) → redirects to /app if logged in
└── /app (Home-ICQ-Style) → redirects to /login if not logged in
```

### Supabase Realtime Pattern
```typescript
supabase.channel('messages')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'messages',
    filter: `recipient_id=eq.${currentUserId}`
  }, (payload) => {
    // Handle new message
    playMessageSound();
  })
  .subscribe();
```

### Adding a New User
1. User enters email on login page
2. Supabase sends magic link
3. User clicks link → creates auth.users entry
4. Trigger `on_auth_user_created` fires
5. `handle_new_user()` creates profile in `users` table
6. Auto-generates random UQ number (10000-99999)

---

## 🎯 Next Steps / TODO

### High Priority
- [ ] Test with multiple real users
- [ ] Add error handling for network failures
- [ ] Add loading states for message sending
- [ ] Add "user is typing..." indicator
- [ ] Improve mobile responsiveness

### Medium Priority
- [ ] Add avatar/profile pictures
- [ ] Implement chat rooms (schema exists)
- [ ] Add file/image sharing
- [ ] User profiles at `/u/[number]`
- [ ] Export chat history
- [ ] Dark mode toggle (in addition to Windows 98 theme)

### Low Priority
- [ ] Add more notification sounds
- [ ] Implement idle detection (auto-away)
- [ ] Add emoji picker
- [ ] Rich text formatting
- [ ] Message search
- [ ] Block/report users

### Desktop App
- [ ] Add app icon (currently placeholder)
- [ ] Auto-updater
- [ ] System tray integration
- [ ] Desktop notifications
- [ ] Launch on startup option

---

## 🔑 Important Commands

```bash
# Install dependencies (with cache fix)
npm install --cache ~/.npm

# Database migrations
# Run in Supabase SQL Editor:
# 1. supabase-schema.sql (initial setup)
# 2. fix-auth-trigger.sql (if auth errors)

# Check dev server output
cat /private/tmp/claude-501/-Users-asychov/tasks/b03aa39.output

# Production build sizes
# Web: ~408 KB (dist/)
# Desktop: ~115 MB (dist-electron/)
```

---

## 📦 Dependencies

### Production
- `@supabase/supabase-js` - Database, Auth, Realtime
- `react` + `react-dom` - UI framework
- `react-router-dom` - Client-side routing
- `@anthropic-ai/sdk` - Placeholder (not used)

### Development
- `vite` - Build tool
- `typescript` - Type safety
- `electron` + `electron-builder` - Desktop app
- `@vitejs/plugin-react` - React support

---

## 🌐 URLs & Resources

- **Supabase Project:** https://wjzgbedvltnlzjataavt.supabase.co
- **Local Dev:** http://localhost:5174/
- **Main App:** http://localhost:5174/app
- **Login:** http://localhost:5174/login

---

## 💡 Tips for Next Session

1. **Always check which port Vite is running on** - it auto-switches if 5173 is taken
2. **The landing page is at `/` root** - login is at `/login`, app at `/app`
3. **FlowerLogo component is reusable** - just pass status prop
4. **Real ICQ sound is in `/public/sounds/icq.mp3`** - already integrated
5. **Database schema is stable** - don't need to re-run SQL unless adding features
6. **All message history persists** - nothing is temporary/demo data
7. **UI is 2x scale** - base font is 16px, not 11px like original ICQ
8. **No Tailwind** - using pure CSS with Windows 98 styling

---

## 🚨 Critical Info

- **DO NOT** re-add Tailwind CSS - causes white screen issues
- **DO NOT** use `overflow: hidden` on body - breaks scrolling
- **ALWAYS** use `import type { Type }` for TypeScript types
- **Password for nothing** - Magic links only, no passwords
- **Real backend** - This is NOT a demo, all data persists to Supabase

---

**Project is in GOOD STATE** - Core messaging works end-to-end with real database, real-time sync, and authentic ICQ experience! 🌺
