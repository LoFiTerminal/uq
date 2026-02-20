# UQ Messenger - Technical Architecture

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    UQ Messenger                         │
│                                                         │
│  ┌──────────────┐      ┌──────────────┐               │
│  │   Web App    │      │ Desktop App  │               │
│  │  (Vite SPA)  │      │  (Electron)  │               │
│  └──────┬───────┘      └──────┬───────┘               │
│         │                     │                        │
│         └──────────┬──────────┘                        │
│                    │                                   │
│         ┌──────────▼───────────┐                      │
│         │   React Frontend     │                      │
│         │  - React Router      │                      │
│         │  - TypeScript        │                      │
│         │  - Pure CSS          │                      │
│         └──────────┬───────────┘                      │
│                    │                                   │
│         ┌──────────▼───────────┐                      │
│         │   Supabase Client    │                      │
│         │  - Auth              │                      │
│         │  - Realtime (WS)     │                      │
│         │  - Database (REST)   │                      │
│         └──────────┬───────────┘                      │
│                    │                                   │
└────────────────────┼───────────────────────────────────┘
                     │
                     │ HTTPS/WSS
                     │
         ┌───────────▼────────────┐
         │    Supabase Cloud      │
         │                        │
         │  ┌──────────────────┐ │
         │  │  PostgreSQL DB   │ │
         │  │  - users         │ │
         │  │  - contacts      │ │
         │  │  │  - messages      │ │
         │  │  - rooms         │ │
         │  └──────────────────┘ │
         │                        │
         │  ┌──────────────────┐ │
         │  │  Auth Service    │ │
         │  │  - Magic Links   │ │
         │  └──────────────────┘ │
         │                        │
         │  ┌──────────────────┐ │
         │  │  Realtime Engine │ │
         │  │  - WebSocket     │ │
         │  │  - Broadcast     │ │
         │  └──────────────────┘ │
         └────────────────────────┘
```

---

## Data Flow

### 1. User Authentication Flow
```
User enters email
    ↓
Supabase.auth.signInWithOtp()
    ↓
Email sent with magic link
    ↓
User clicks link
    ↓
Supabase redirects to /app
    ↓
Trigger: on_auth_user_created
    ↓
Function: handle_new_user()
    ↓
Insert into users table with:
  - id (from auth.users)
  - username (from email)
  - uq_number (random 5-digit)
  - status = 'online'
    ↓
User sees main app
```

### 2. Message Sending Flow
```
User types message → clicks Send
    ↓
Insert into messages table:
  - sender_id: current_user.id
  - recipient_id: selected_contact.id
  - content: message text
  - created_at: now()
    ↓
Database INSERT completes
    ↓
Recipient's Realtime subscription fires
    ↓
New message appended to chat
    ↓
playMessageSound() → plays icq.mp3
```

### 3. Real-Time Subscription Flow
```
Component mounts with selected contact
    ↓
Create Supabase channel
    ↓
Subscribe to postgres_changes:
  - event: 'INSERT'
  - table: 'messages'
  - filter: recipient_id=eq.{current_user_id}
    ↓
Server sends updates via WebSocket
    ↓
Callback receives payload
    ↓
Check if sender_id matches selected contact
    ↓
If yes: add to messages array + play sound
```

### 4. Status Update Flow
```
User changes status dropdown
    ↓
handleStatusChange(newStatus)
    ↓
Update users table:
  - SET status = newStatus
  - WHERE id = current_user.id
    ↓
Local state updated
    ↓
FlowerLogo re-renders with new color
    ↓
Other users see updated status in contact list
```

---

## Component Hierarchy

```
App.tsx (BrowserRouter)
│
├── Route: /
│   └── Landing.tsx
│       ├── FlowerLogo (animated)
│       ├── Hero Section (chat demo)
│       ├── Features Grid
│       └── Download Buttons
│
├── Route: /login
│   └── Login.tsx
│       ├── FlowerLogo
│       ├── Email Input Form
│       └── Magic Link Handler
│
└── Route: /app (protected)
    └── Home-ICQ-Style.tsx
        │
        ├── Left Panel (Quick Menu)
        │   ├── Find Users Button
        │   ├── Add Contact Button
        │   └── FlowerLogo (with status)
        │
        ├── Center Panel (Contact List)
        │   ├── User Info Bar
        │   │   ├── Status Dot
        │   │   ├── Username
        │   │   ├── UQ Number
        │   │   └── Status Dropdown
        │   │
        │   ├── Tabs (Online/All)
        │   │
        │   └── Contact Items
        │       ├── Status Dot
        │       ├── Username
        │       └── UQ Number
        │
        └── Right Panel (Chat Window)
            ├── Title Bar (contact info)
            ├── Message List
            │   └── Message Items
            │       ├── Sender Name
            │       ├── Content
            │       └── Timestamp
            │
            └── Input Area
                ├── Textarea
                └── Send Button

        Modals (conditionally rendered):
        │
        ├── UserRegistry.tsx
        │   ├── Search Input
        │   └── User List
        │       └── User Items (with Add button)
        │
        └── AddContactModal.tsx
            └── UQ Number Input
```

---

## State Management

### App-Level State (App.tsx)
```typescript
const [session, setSession] = useState<any>(null);
const [loading, setLoading] = useState(true);
```

### Home-ICQ-Style State
```typescript
const [currentUser, setCurrentUser] = useState<User | null>(null);
const [contacts, setContacts] = useState<Contact[]>([]);
const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
const [messages, setMessages] = useState<Message[]>([]);
const [messageInput, setMessageInput] = useState('');
const [showOnlineOnly, setShowOnlineOnly] = useState(true);
const [showAddContact, setShowAddContact] = useState(false);
const [showUserRegistry, setShowUserRegistry] = useState(false);
```

### No Global State Management
- No Redux, Zustand, or Context API
- State is local to components
- Supabase handles data persistence
- Realtime handles sync between clients

---

## Database Queries

### Load User Data
```typescript
const { data: { user } } = await supabase.auth.getUser();
const { data } = await supabase
  .from('users')
  .select('*')
  .eq('id', user.id)
  .single();
```

### Load Contacts
```typescript
const { data } = await supabase
  .from('contacts')
  .select(`
    *,
    contact_user:users!contacts_contact_id_fkey(*)
  `)
  .eq('user_id', currentUser.id);
```

### Load Messages
```typescript
const { data } = await supabase
  .from('messages')
  .select(`
    *,
    sender:users!messages_sender_id_fkey(*)
  `)
  .or(`
    and(sender_id.eq.${userId},recipient_id.eq.${contactId}),
    and(sender_id.eq.${contactId},recipient_id.eq.${userId})
  `)
  .order('created_at', { ascending: true });
```

### Send Message
```typescript
await supabase
  .from('messages')
  .insert({
    sender_id: currentUser.id,
    recipient_id: selectedContactId,
    content: messageInput.trim(),
    created_at: new Date().toISOString(),
  });
```

### Add Contact
```typescript
await supabase
  .from('contacts')
  .insert({
    user_id: currentUser.id,
    contact_id: userId,
  });
```

### Update Status
```typescript
await supabase
  .from('users')
  .update({ status: newStatus })
  .eq('id', currentUser.id);
```

---

## Security (Row Level Security)

All tables have RLS policies defined in `supabase-schema.sql`:

### users table
- **SELECT:** Public (anyone can see user profiles)
- **INSERT:** Triggered only (via handle_new_user function)
- **UPDATE:** Own record only (user can update their own profile)

### contacts table
- **SELECT:** Own contacts only
- **INSERT:** Own contacts only
- **DELETE:** Own contacts only

### messages table
- **SELECT:** Messages where user is sender OR recipient
- **INSERT:** Any authenticated user can send
- **UPDATE:** None (messages are immutable)
- **DELETE:** None (messages are permanent)

---

## Performance Considerations

### Optimizations
1. **Limit queries:** UserRegistry fetches only 50 users
2. **Index on foreign keys:** sender_id, recipient_id indexed
3. **Client-side search:** User registry filters in JavaScript
4. **Single audio instance:** Reuses same Audio element
5. **HMR enabled:** Fast development iteration

### Potential Issues
1. **Large message history:** No pagination yet
2. **All contacts loaded:** Could be slow with 1000+ contacts
3. **No message batching:** Each message is separate INSERT
4. **Realtime channel per contact:** Should pool channels

### Future Optimizations
- Add pagination for messages (load last 50, then scroll to load more)
- Virtual scrolling for contact list
- Debounce status updates
- Batch message sending
- Connection pooling for Realtime

---

## Build System

### Development Build
```bash
vite dev
# Hot Module Replacement (HMR)
# Fast refresh
# TypeScript checking
# No minification
```

### Production Build
```bash
vite build
# TypeScript compilation
# Minification
# Tree shaking
# Asset optimization
# Output: dist/
```

### Electron Build
```bash
electron-builder
# Bundles React app
# Packages Electron
# Creates installers:
#   - macOS: .dmg, .zip
#   - Windows: .exe, portable
#   - Linux: .AppImage, .deb
```

---

## File Size Analysis

### Web Build (dist/)
- Total: ~408 KB
- index.html: ~1 KB
- CSS: ~20 KB
- JS bundles: ~350 KB
- Assets: ~37 KB

### Desktop Build (dist-electron/)
- Total: ~115 MB
- Electron framework: ~100 MB
- React app: ~408 KB
- Node modules: ~14 MB

---

## Environment Variables

```bash
# .env file
VITE_SUPABASE_URL=https://wjzgbedvltnlzjataavt.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Note:** All env vars must be prefixed with `VITE_` to be accessible in React.

---

## TypeScript Types

### Key Interfaces (in src/types.ts or inline)

```typescript
interface User {
  id: string;
  username: string;
  email: string;
  uq_number: string;
  status: 'online' | 'away' | 'busy' | 'invisible';
  created_at: string;
}

interface Contact {
  id: string;
  user_id: string;
  contact_id: string;
  contact_user?: User; // Joined data
  created_at: string;
}

interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  sender?: User; // Joined data
  created_at: string;
}
```

---

## Browser Compatibility

### Tested On
- Chrome/Edge (Chromium)
- Safari
- Firefox

### Requirements
- ES6+ support
- WebSocket support
- Audio API support
- localStorage support

### Known Issues
- Safari may block Audio playback without user interaction
- Some CSS features may need prefixes for older browsers

---

## Deployment Options

### Web App
1. **Vercel/Netlify:** Zero config deployment
2. **Cloudflare Pages:** Fast CDN
3. **Traditional hosting:** Upload dist/ folder

### Desktop App
1. **GitHub Releases:** Distribute .dmg, .exe, .AppImage
2. **Direct download:** Host files on website
3. **Auto-updater:** electron-updater (not configured yet)

---

## Testing Strategy (Not Implemented Yet)

### Recommended Testing
- [ ] Unit tests for components (Vitest)
- [ ] E2E tests for auth flow (Playwright)
- [ ] Integration tests for Supabase queries
- [ ] Manual testing for Realtime functionality

---

This architecture is **production-ready** for small-to-medium scale (< 10k users). For larger scale, consider:
- Message pagination
- CDN for static assets
- Redis for presence tracking
- Message queue for notifications
