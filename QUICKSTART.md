# UQ Messenger - Quick Start Guide

## 🚀 Getting Started in 30 Seconds

```bash
cd /Users/asychov/uq
npm run dev
# Open http://localhost:5174/
```

---

## 📋 Common Commands

### Development
```bash
npm run dev              # Start dev server (usually port 5174)
npm run build           # Build for production
npm run preview         # Preview production build
```

### Desktop App
```bash
npm run electron               # Run Electron (requires dev server running)
npm run electron:build         # Build macOS app
npm run electron:build:all     # Build all platforms
```

### Dependencies
```bash
npm install --cache ~/.npm     # Install with cache fix
npm update                     # Update packages
```

---

## 🌐 URLs

| Environment | URL |
|-------------|-----|
| Dev Server | http://localhost:5174/ |
| Landing Page | http://localhost:5174/ |
| Login | http://localhost:5174/login |
| Main App | http://localhost:5174/app |
| Supabase Dashboard | https://supabase.com/dashboard |

---

## 🔑 Quick Reference

### File Locations
```
Components:     /Users/asychov/uq/src/components/
Pages:          /Users/asychov/uq/src/pages/
Styles:         /Users/asychov/uq/src/index.css
Sounds:         /Users/asychov/uq/public/sounds/
Database SQL:   /Users/asychov/uq/supabase-schema.sql
```

### Key Components
- `Landing.tsx` - Marketing landing page
- `Login.tsx` - Authentication page
- `Home-ICQ-Style.tsx` - Main 3-panel chat interface
- `FlowerLogo.tsx` - Dynamic status logo
- `UserRegistry.tsx` - Global user browser

### Database Tables
- `users` - User profiles + UQ numbers
- `contacts` - Friend list relationships
- `messages` - Chat message history
- `rooms` - Group chats (not implemented in UI yet)

---

## 🐛 Troubleshooting

### Port 5173 Already in Use
```bash
# Vite will auto-switch to 5174
# Always check terminal output for actual port
```

### White Screen
```bash
# Check browser console for errors
# Verify .env file has Supabase credentials
# Try clearing browser cache
```

### "Database error saving new user"
```bash
# Run fix-auth-trigger.sql in Supabase SQL Editor
# Check Supabase logs for trigger errors
```

### Sound Not Playing
```bash
# Check /public/sounds/icq.mp3 exists
# Check browser audio permissions
# Open browser console for errors
```

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install --cache ~/.npm

# Clear Vite cache
rm -rf .vite
npm run dev
```

---

## 🎯 Testing Checklist

### After Changes
- [ ] Dev server running without errors
- [ ] Landing page loads and scrolls
- [ ] Login page accepts email
- [ ] Main app shows contact list
- [ ] Can send and receive messages
- [ ] Sound plays on message receipt
- [ ] FlowerLogo changes with status

### Before Release
- [ ] Production build completes (`npm run build`)
- [ ] Build size is reasonable (~400 KB)
- [ ] All features work in production build
- [ ] Desktop app builds without errors
- [ ] Test on multiple browsers

---

## 📝 Making Changes

### Adding a New Feature
1. Create component in `src/components/`
2. Import and use in appropriate page
3. Update types if needed
4. Test in dev mode
5. Update PROJECT_NOTES.md

### Modifying Database
1. Write SQL migration
2. Run in Supabase SQL Editor
3. Update `supabase-schema.sql`
4. Update types in code
5. Test queries

### Changing Styles
1. Edit `src/index.css` for global styles
2. Use inline styles for component-specific
3. Keep ICQ Windows 98 aesthetic
4. Test on different screen sizes

---

## 🔒 Environment Setup

### First Time Setup
1. Clone/open project
2. Copy `.env.example` to `.env` (if exists)
3. Add Supabase credentials to `.env`
4. Run `npm install --cache ~/.npm`
5. Run `npm run dev`

### Supabase Setup
1. Go to https://supabase.com/dashboard
2. Create new project
3. Copy URL and anon key
4. Paste into `.env`
5. Run `supabase-schema.sql` in SQL Editor
6. Run `fix-auth-trigger.sql` if needed

---

## 📦 Dependencies to Know

### Critical
- `react` - UI framework
- `vite` - Build tool
- `@supabase/supabase-js` - Backend
- `react-router-dom` - Routing

### Optional
- `electron` - Desktop app
- `typescript` - Type safety

---

## 🎨 Design Guidelines

### Colors
- Use ICQ blue `#0054e3` for primary actions
- Use beige `#ece9d8` for backgrounds
- Use gray `#c0c0c0` for borders/inactive
- Status colors: green/yellow/red/gray

### Typography
- Base: 16px (2x original ICQ)
- Buttons: 14px
- Titles: 24px+
- Font: Tahoma, Arial, sans-serif

### Layout
- 3-panel for main app (left menu, center contacts, right chat)
- ICQ Windows 98 beveled borders
- Blue gradient title bars
- Classic scrollbars

---

## 💡 Quick Tips

- **Dev server auto-reloads** - just save and see changes
- **Use TypeScript** - catch errors before runtime
- **Check terminal** - Vite logs all errors there
- **Test with 2 users** - open in normal + incognito
- **Sound only plays once** - browser may block autoplay
- **Messages persist forever** - no auto-deletion
- **UQ numbers are unique** - can't be changed

---

## 🆘 Getting Help

### Check These First
1. Terminal output for errors
2. Browser console for client errors
3. Supabase logs for backend errors
4. PROJECT_NOTES.md for detailed info
5. ARCHITECTURE.md for technical details

### Common Errors
- `EACCES` → Use `--cache ~/.npm`
- `Port in use` → Check terminal for new port
- `White screen` → Check browser console
- `Build fails` → Clear cache and reinstall
- `Types error` → Use `import type {}`

---

**Remember:** The project is fully functional! Core messaging, contacts, and real-time sync all work. Don't overthink it - just run `npm run dev` and start coding! 🌺
