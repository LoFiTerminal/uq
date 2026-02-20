// Simple sound manager for UQ
// Using real ICQ "Uh-oh!" sound

let messageAudio: HTMLAudioElement | null = null;

function getMessageAudio(): HTMLAudioElement {
  if (!messageAudio) {
    messageAudio = new Audio('/sounds/icq.mp3');
    messageAudio.volume = 0.5;
  }
  return messageAudio;
}

export function playMessageSound() {
  try {
    const audio = getMessageAudio();
    audio.currentTime = 0; // Reset to start if already playing
    audio.play().catch(err => {
      console.log('Could not play sound:', err);
    });
  } catch (err) {
    console.log('Error playing message sound:', err);
  }
}

export function playOnlineSound() {
  // Can use the same sound or add another one later
  playMessageSound();
}
