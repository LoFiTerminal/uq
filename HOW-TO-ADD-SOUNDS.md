# 🔊 How to Add Original ICQ Sounds

## Legal Notice
Original ICQ sounds are copyrighted by AOL/ICQ LLC. I cannot download or provide them. However, if you have legal access to them, here's how to add them to UQ:

## Step 1: Obtain Sound Files
If you have legal access to ICQ sound files (e.g., from an old ICQ installation), copy them to:
```
public/sounds/
```

Recommended files:
- `uh-oh.wav` or `uh-oh.mp3` - Message received
- `online.wav` or `online.mp3` - Contact comes online
- `message.wav` or `message.mp3` - New message

## Step 2: Update the Sound Library

Edit `src/lib/sounds.ts` and replace the Web Audio API code with:

```typescript
// Play audio files instead of generating sounds
export function playMessageSound() {
  const audio = new Audio('/sounds/uh-oh.mp3');
  audio.volume = 0.5;
  audio.play().catch(err => console.log('Sound play failed:', err));
}

export function playOnlineSound() {
  const audio = new Audio('/sounds/online.mp3');
  audio.volume = 0.5;
  audio.play().catch(err => console.log('Sound play failed:', err));
}

export function playMessage() {
  const audio = new Audio('/sounds/message.mp3');
  audio.volume = 0.5;
  audio.play().catch(err => console.log('Sound play failed:', err));
}
```

## Alternative: Free Sound Resources

If you want retro sounds, you can:
1. Create your own using audio software
2. Use royalty-free sounds from:
   - Freesound.org
   - Zapsplat.com
   - YouTube Audio Library

## Testing

After adding sounds, test them:
1. Open http://localhost:5173/index.html
2. Click the sound buttons
3. Sounds should play!

The demo app will also use these sounds when sending messages.
