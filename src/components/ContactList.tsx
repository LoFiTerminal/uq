import type { Contact } from '../types';

interface ContactListProps {
  contacts: Contact[];
  selectedContactId: string | null;
  onSelectContact: (contactId: string) => void;
}

export default function ContactList({ contacts, selectedContactId, onSelectContact }: ContactListProps) {
  return (
    <div style={{ background: 'white', height: '100%' }}>
      {contacts.length === 0 ? (
        <div style={{
          padding: '20px',
          textAlign: 'center',
          fontSize: '11px',
          color: '#666'
        }}>
          <p>No contacts yet</p>
          <p style={{ marginTop: '8px', fontSize: '10px' }}>
            Add friends to start chatting!
          </p>
        </div>
      ) : (
        <div>
          {contacts.map((contact) => {
            const user = contact.contact_user;
            if (!user) return null;

            const isSelected = selectedContactId === contact.contact_id;
            const statusColor = {
              online: '#00ff00',
              away: '#ffff00',
              busy: '#ff0000',
              invisible: '#c0c0c0'
            }[user.status];

            return (
              <div
                key={contact.id}
                onClick={() => onSelectContact(contact.contact_id)}
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
                  background: statusColor,
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
                  👤
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: '11px',
                    fontWeight: 'bold',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {contact.nickname || user.username}
                  </div>
                  <div style={{
                    fontSize: '9px',
                    fontFamily: 'Courier New, monospace',
                    color: isSelected ? '#ffff99' : '#0054e3',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    #{user.uq_number}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
