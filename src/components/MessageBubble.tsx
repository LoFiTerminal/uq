import type { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
}

export default function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div style={{
      marginBottom: '10px',
      fontSize: '11px',
      wordWrap: 'break-word'
    }}>
      <div style={{
        color: isOwn ? '#0054e3' : '#666',
        fontWeight: 'bold',
        marginBottom: '2px'
      }}>
        {isOwn ? 'You' : (message.sender?.username || 'User')}:
      </div>
      <div style={{
        color: '#000',
        lineHeight: '1.4',
        whiteSpace: 'pre-wrap'
      }}>
        {message.content}
      </div>
      <div style={{
        fontSize: '9px',
        color: '#999',
        marginTop: '2px'
      }}>
        {formatTime(message.created_at)}
      </div>
    </div>
  );
}
