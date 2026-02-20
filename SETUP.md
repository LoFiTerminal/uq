# 🌺 UQ Messenger - Setup Guide

## 🎯 What You Have

- **Web App** - Fully functional React app with ICQ-style design
- **Desktop Build** - Electron-based macOS/Windows/Linux apps
- **Authentic ICQ Feel** - Classic Windows 98-style UI, flower logo, status indicators
- **Web Audio Sounds** - ICQ-inspired notification sounds

## 🚀 Quick Start

### 1. Web App (Development)

```bash
npm run dev
```

Then open:
- **Homepage**: http://localhost:5173/
- **Web App**: http://localhost:5173/app.html

### 2. Desktop App (Development)

First terminal:
```bash
npm run dev
```

Second terminal:
```bash
npm run electron
```

### 3. Build for Production

**Web Build:**
```bash
npm run build
```

**macOS Desktop Build:**
```bash
npm run electron:build
```
This creates a `.dmg` file in `dist-electron/`

**All Platforms:**
```bash
npm run electron:build:all
```

## 📱 Available Routes

- `/` - ICQ-style homepage with demo and features
- `/app.html` - The actual messenger app
- `/landing.html` - Alternative landing page

## 🎨 Design Features

### Authentic ICQ Elements:
- ✅ Windows 98-style window borders
- ✅ Classic title bars with minimize/maximize/close
- ✅ Flower logo (inspired by ICQ)
- ✅ Status indicators (Online/Away/DND/Invisible)
- ✅ Beveled buttons and inputs
- ✅ Contact list with avatars
- ✅ Message windows
- ✅ Web Audio API notification sounds

### Color Scheme:
- Window chrome: #ece9d8
- Title bar: #0054e3 (Windows XP blue)
- Borders: 3D beveled effect
- Status colors: Green/Yellow/Red/Gray

## 🔊 Sounds

The app includes Web Audio API-generated sounds that approximate classic ICQ:
- **Uh-oh!** - Incoming message
- **Online** - Contact comes online
- **Message** - New notification

These are generated in real-time and are NOT copyrighted material.

## 🗄️ Database Setup (Supabase)

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Run the SQL in `supabase-schema.sql`
3. Copy `.env.example` to `.env`
4. Add your Supabase credentials

**Without Supabase:**
The app will run in "demo mode" showing the UI without backend functionality.

## 📦 Distribution

### macOS App
After building:
1. Find the `.dmg` file in `dist-electron/`
2. Double-click to mount
3. Drag UQ Messenger to Applications
4. Launch from Applications folder

### Web App
Deploy the `dist/` folder to:
- Vercel
- Netlify
- Any static hosting

## 🎯 Features Status

**✅ Working:**
- ICQ-style UI
- Login page with flower logo
- Contact list interface
- Message window interface
- Status selector
- Sound notifications (Web Audio)
- Desktop app (Electron)
- Web app

**🚧 Requires Supabase Setup:**
- User authentication
- Real-time messaging
- Contact management
- Presence system
- AI features (translation, summaries)

## 🛠️ Tech Stack

- **Frontend:** React 19 + TypeScript + Vite
- **Styling:** Pure CSS (ICQ Windows 98 theme)
- **Backend:** Supabase (PostgreSQL + Realtime)
- **Desktop:** Electron
- **AI:** Anthropic Claude API
- **Sounds:** Web Audio API

## 📝 Development Tips

### Testing the UI
Open http://localhost:5173/ and click the sound buttons to test audio.

### Hot Reload
The dev server supports hot module replacement - changes appear instantly.

### Building for Different Platforms
```bash
# macOS only
npm run electron:build

# All platforms (requires build tools for each platform)
npm run electron:build:all
```

## 🎨 Customization

### Colors
Edit `src/index.css` to change the color scheme.

### Window Size
Edit `electron/main.js` to adjust default window dimensions.

### Sounds
Edit `src/lib/sounds.ts` to customize notification sounds.

## 🌐 Deployment

### Vercel (Recommended for Web)
```bash
npm run build
# Connect to Vercel and deploy dist/
```

### Electron Distribution
macOS apps can be distributed via:
- Direct `.dmg` download
- Mac App Store (requires developer account)
- Homebrew cask

## 📄 License

MIT - This is a spiritual successor inspired by ICQ, not affiliated with ICQ LLC or AOL.

## 🎉 Enjoy!

You've got a fully working ICQ-style messenger ready to go!
