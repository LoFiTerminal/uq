import { useState, useEffect, useRef } from 'react';
import type { Message, User } from '../types';
import MessageBubble from './MessageBubble';

interface ChatWindowProps {
  selectedContact: User | null;
  messages: Message[];
  currentUserId: string;
  onSendMessage: (content: string) => void;
}

export default function ChatWindow({ selectedContact, messages, currentUserId, onSendMessage }: ChatWindowProps) {
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageInput.trim() && selectedContact) {
      onSendMessage(messageInput.trim());
      setMessageInput('');
    }
  };

  if (!selectedContact) {
    return (
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'white',
        flexDirection: 'column',
        gap: '15px'
      }}>
        <div style={{ fontSize: '64px' }}>💬</div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '5px' }}>
            Welcome to UQ Messenger
          </div>
          <div style={{ fontSize: '11px', color: '#666' }}>
            Select a contact to start chatting
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      {/* Messages Area */}
      <div style={{
        flex: 1,
        overflow: 'auto',
        padding: '10px',
        background: 'white'
      }}>
        {messages.length === 0 ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            fontSize: '11px',
            color: '#666'
          }}>
            No messages yet. Say hi! 👋
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                isOwn={message.sender_id === currentUserId}
              />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Message Input */}
      <div style={{
        padding: '8px',
        background: '#ece9d8',
        borderTop: '2px solid #808080'
      }}>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder="Enter message here..."
            className="icq-input"
            style={{ marginBottom: '6px' }}
          />
          <button
            type="submit"
            disabled={!messageInput.trim()}
            className="icq-btn"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
