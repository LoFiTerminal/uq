import { useState } from 'react';
import { playMessageSound } from './lib/sounds';

// Demo data
const DEMO_USER = {
  id: '1',
  username: 'demo_user',
  uq_number: 482916734,
  status: 'online' as const,
};

const DEMO_CONTACTS = [
  { id: '1', name: 'Mike Anderson', uq_number: 123456789, status: 'online' as const, avatar: '👨' },
  { id: '2', name: 'Sarah Chen', uq_number: 987654321, status: 'online' as const, avatar: '👩' },
  { id: '3', name: 'David Kim', uq_number: 555123789, status: 'away' as const, avatar: '👨' },
  { id: '4', name: 'Emma Wilson', uq_number: 777888999, status: 'busy' as const, avatar: '👩' },
  { id: '5', name: 'James Taylor', uq_number: 111222333, status: 'invisible' as const, avatar: '👨' },
];

type Message = {
  id: string;
  from: string;
  content: string;
  time: string;
  isOwn: boolean;
};

export default function AppDemo() {
  const [selectedContact, setSelectedContact] = useState<typeof DEMO_CONTACTS[0] | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [userStatus, setUserStatus] = useState<'online' | 'away' | 'busy' | 'invisible'>('online');

  const handleSelectContact = (contact: typeof DEMO_CONTACTS[0]) => {
    setSelectedContact(contact);
    // Load demo messages
    setMessages([
      { id: '1', from: contact.name, content: 'Hey! How are you?', time: '10:30', isOwn: false },
      { id: '2', from: 'You', content: 'Hi! I\'m great, thanks!', time: '10:31', isOwn: true },
      { id: '3', from: contact.name, content: 'Cool! Want to grab lunch?', time: '10:32', isOwn: false },
    ]);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedContact) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      from: 'You',
      content: messageInput,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      isOwn: true,
    };

    setMessages([...messages, newMessage]);
    setMessageInput('');
    playMessageSound();

    // Simulate reply after 2 seconds
    setTimeout(() => {
      const reply: Message = {
        id: (Date.now() + 1).toString(),
        from: selectedContact.name,
        content: 'Got it! 👍',
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        isOwn: false,
      };
      setMessages(prev => [...prev, reply]);
      playMessageSound();
    }, 2000);
  };

  const statusColors = {
    online: '#00ff00',
    away: '#ffff00',
    busy: '#ff0000',
    invisible: '#c0c0c0',
  };

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      background: '#c0c0c0',
      padding: '10px',
      gap: '10px'
    }}>
      {/* Contact List Window */}
      <div className="icq-window" style={{ width: '280px', display: 'flex', flexDirection: 'column' }}>
        <div className="icq-title-bar">
          <span>🌺 Contact List</span>
        </div>

        <div style={{ padding: '8px', background: '#ece9d8', borderBottom: '1px solid #808080' }}>
          <div style={{ fontSize: '11px' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
              {DEMO_USER.username}
            </div>
            <div style={{ fontFamily: 'Courier New, monospace', color: '#0054e3', fontSize: '10px' }}>
              #{DEMO_USER.uq_number}
            </div>
            <div style={{ marginTop: '8px' }}>
              <select
                value={userStatus}
                onChange={(e) => setUserStatus(e.target.value as any)}
                style={{
                  width: '100%',
                  padding: '4px',
                  border: '2px solid',
                  borderColor: '#808080 #ffffff #ffffff #808080',
                  fontSize: '10px',
                  fontFamily: 'Tahoma, Arial, sans-serif',
                  background: 'white',
                }}
              >
                <option value="online">🟢 Online</option>
                <option value="away">🌙 Away</option>
                <option value="busy">🔴 Do Not Disturb</option>
                <option value="invisible">👻 Invisible</option>
              </select>
            </div>
          </div>
        </div>

        <div style={{ flex: 1, overflow: 'auto', background: 'white' }}>
          {DEMO_CONTACTS.map((contact) => {
            const isSelected = selectedContact?.id === contact.id;
            return (
              <div
                key={contact.id}
                onClick={() => handleSelectContact(contact)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 8px',
                  cursor: 'pointer',
                  background: isSelected ? '#0054e3' : 'transparent',
                  color: isSelected ? 'white' : 'black',
                  borderBottom: '1px solid #f0f0f0'
                }}
                onMouseOver={(e) => {
                  if (!isSelected) e.currentTarget.style.background = '#e0e0e0';
                }}
                onMouseOut={(e) => {
                  if (!isSelected) e.currentTarget.style.background = 'transparent';
                }}
              >
                <div style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: statusColors[contact.status],
                  border: '1px solid #000',
                  flexShrink: 0
                }} />

                <div style={{
                  width: '24px',
                  height: '24px',
                  background: '#c0c0c0',
                  border: '1px solid #808080',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                  flexShrink: 0
                }}>
                  {contact.avatar}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: '11px',
                    fontWeight: 'bold',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {contact.name}
                  </div>
                  <div style={{
                    fontSize: '9px',
                    fontFamily: 'Courier New, monospace',
                    color: isSelected ? '#ffff99' : '#0054e3',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    #{contact.uq_number}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ padding: '6px', background: '#ece9d8', borderTop: '1px solid #808080', textAlign: 'center', fontSize: '10px', color: '#666' }}>
          Demo Mode - No Backend
        </div>
      </div>

      {/* Chat Window */}
      <div className="icq-window" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div className="icq-title-bar">
          <span>
            💬 {selectedContact ? `${selectedContact.name} #${selectedContact.uq_number}` : 'UQ Messenger Demo'}
          </span>
        </div>

        {!selectedContact ? (
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
                UQ Messenger Demo
              </div>
              <div style={{ fontSize: '11px', color: '#666' }}>
                Select a contact to start chatting
              </div>
            </div>
          </div>
        ) : (
          <>
            <div style={{
              flex: 1,
              overflow: 'auto',
              padding: '10px',
              background: 'white'
            }}>
              {messages.map((msg) => (
                <div key={msg.id} style={{ marginBottom: '10px', fontSize: '11px' }}>
                  <div style={{
                    color: msg.isOwn ? '#0054e3' : '#666',
                    fontWeight: 'bold',
                    marginBottom: '2px'
                  }}>
                    {msg.from}:
                  </div>
                  <div style={{ color: '#000', lineHeight: '1.4', whiteSpace: 'pre-wrap' }}>
                    {msg.content}
                  </div>
                  <div style={{ fontSize: '9px', color: '#999', marginTop: '2px' }}>
                    {msg.time}
                  </div>
                </div>
              ))}
            </div>

            <div style={{
              padding: '8px',
              background: '#ece9d8',
              borderTop: '2px solid #808080'
            }}>
              <form onSubmit={handleSendMessage}>
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
          </>
        )}
      </div>
    </div>
  );
}
