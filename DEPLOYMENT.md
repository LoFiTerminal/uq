# 🚀 UQ Messenger - Deployment Guide

## ✅ What's Been Built

### 📦 Desktop App (macOS)
**Location:** `dist-electron/`

**Files created:**
- ✅ `UQ Messenger-0.0.0-arm64.dmg` (115 MB) - **macOS installer**
- ✅ `UQ Messenger-0.0.0-arm64-mac.zip` (111 MB) - Portable version

**To install:**
1. Open `dist-electron/UQ Messenger-0.0.0-arm64.dmg`
2. Drag "UQ Messenger" to Applications folder
3. Launch from Applications

**Note:** Built for Apple Silicon (M1/M2/M3 Macs). For Intel Macs, run:
```bash
electron-builder --mac --x64
```

### 🌐 Web App
**Location:** `dist/`
**Size:** 232 KB (lightning fast!)

**Files:**
- `index.html` - ICQ-style homepage
- `app.html` - Working messenger app
- `landing.html` - Alternative landing page
- `assets/` - Optimized JS and CSS
- `icon.svg` - Flower logo

## 🌍 Deploy Web App

### Option 1: Vercel (Recommended)
```bash
npm install -g vercel
cd dist
vercel
```

### Option 2: Netlify
```bash
npm install -g netlify-cli
cd dist
netlify deploy --prod
```

### Option 3: GitHub Pages
```bash
# Push dist/ folder to gh-pages branch
git subtree push --prefix dist origin gh-pages
```

### Option 4: Any Static Host
Upload the `dist/` folder to:
- AWS S3 + CloudFront
- Google Cloud Storage
- Azure Static Web Apps
- Cloudflare Pages

## 🖥️ Distribute Desktop App

### macOS
**Option A: Direct Download**
- Host the `.dmg` file on your website
- Users download and install

**Option B: GitHub Releases**
```bash
gh release create v0.0.1 \
  "dist-electron/UQ Messenger-0.0.0-arm64.dmg" \
  "dist-electron/UQ Messenger-0.0.0-arm64-mac.zip"
```

**Option C: Homebrew Cask** (for wider distribution)
1. Create a tap repository
2. Submit cask formula

### Windows (to build)
```bash
npm run build && electron-builder --win
```
Creates `.exe` installer in `dist-electron/`

### Linux (to build)
```bash
npm run build && electron-builder --linux
```
Creates `.AppImage` and `.deb` in `dist-electron/`

## 📱 Test Before Deploying

### Test Web Build Locally
```bash
cd dist
python3 -m http.server 8000
# Open http://localhost:8000
```

### Test Desktop App
Just double-click the `.dmg` and install!

## 🔧 Environment Variables for Production

If you want to enable Supabase backend:

1. Create `.env` file:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_key
VITE_ANTHROPIC_API_KEY=your_key
```

2. Rebuild:
```bash
npm run build
npm run electron:build
```

## 📊 What Works Now

**✅ Without Backend (Demo Mode):**
- Full ICQ-style UI
- Contact list interface
- Message window
- Send/receive demo messages
- Status selector
- Sound notifications
- Desktop app
- Web app

**🔧 With Supabase (Full Version):**
- Real user authentication
- Real-time messaging
- Contact management
- Presence system
- Message history
- AI features (translation, summaries)

## 🎯 URLs After Deployment

Assume you deploy to `uqmessenger.com`:

- Homepage: `https://uqmessenger.com/`
- Web App: `https://uqmessenger.com/app.html`
- Landing: `https://uqmessenger.com/landing.html`

## 📦 File Sizes

- Web App: 232 KB (compressed)
- macOS App: 115 MB (includes Electron runtime)
- Windows App: ~120 MB (when built)
- Linux App: ~115 MB (when built)

## 🔐 Code Signing (Optional)

For production macOS distribution:

1. Get Apple Developer account ($99/year)
2. Create signing certificate
3. Update `package.json`:
```json
"build": {
  "mac": {
    "identity": "Developer ID Application: Your Name"
  }
}
```
4. Rebuild with signing

## 🎉 You're Ready!

Everything is built and ready to deploy. The demo works immediately without any backend setup!

To go live with full features, just set up Supabase following `supabase-schema.sql`.

---

**Built with:** React 19 + Vite + Electron + TypeScript
**Theme:** Classic ICQ Windows 98 style
**Size:** Optimized for fast loading
