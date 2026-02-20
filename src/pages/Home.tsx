import { useState, useEffect } from 'react';
import { supabase, isConfigured } from '../lib/supabase';
import { playMessageSound } from '../lib/sounds';
import type { User, Contact, Message } from '../types';
import ContactList from '../components/ContactList';
import ChatWindow from '../components/ChatWindow';
import StatusSelector from '../components/StatusSelector';
import AddContactModal from '../components/AddContactModal';

export default function Home() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showAddContact, setShowAddContact] = useState(false);

  useEffect(() => {
    if (isConfigured) {
      loadUserData();
      loadContacts();
    }
  }, []);

  useEffect(() => {
    if (selectedContactId && currentUser && isConfigured) {
      loadMessages(selectedContactId);
      subscribeToMessages(selectedContactId);
    }
  }, [selectedContactId, currentUser]);

  const loadUserData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (data) {
        setCurrentUser(data);
      }
    }
  };

  const loadContacts = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('contacts')
      .select(`
        *,
        contact_user:users!contacts_contact_id_fkey(*)
      `)
      .eq('user_id', user.id);

    if (data) {
      setContacts(data as Contact[]);
    }
  };

  const loadMessages = async (contactId: string) => {
    if (!currentUser) return;

    const { data } = await supabase
      .from('messages')
      .select(`
        *,
        sender:users!messages_sender_id_fkey(*)
      `)
      .or(`and(sender_id.eq.${currentUser.id},recipient_id.eq.${contactId}),and(sender_id.eq.${contactId},recipient_id.eq.${currentUser.id})`)
      .order('created_at', { ascending: true });

    if (data) {
      setMessages(data as Message[]);
    }
  };

  const subscribeToMessages = (contactId: string) => {
    if (!currentUser) return;

    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `recipient_id=eq.${currentUser.id}`,
        },
        (payload) => {
          const newMessage = payload.new as Message;
          if (newMessage.sender_id === contactId) {
            setMessages((prev) => [...prev, newMessage]);
            playMessageSound();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleSendMessage = async (content: string) => {
    if (!currentUser || !selectedContactId || !isConfigured) return;

    const { error } = await supabase.from('messages').insert({
      sender_id: currentUser.id,
      recipient_id: selectedContactId,
      content,
      created_at: new Date().toISOString(),
    });

    if (!error) {
      loadMessages(selectedContactId);
    }
  };

  const handleStatusChange = async (status: string) => {
    if (!currentUser || !isConfigured) return;

    await supabase
      .from('users')
      .update({ status })
      .eq('id', currentUser.id);

    setCurrentUser({ ...currentUser, status: status as any });
  };

  const handleSignOut = async () => {
    if (isConfigured) {
      await supabase.auth.signOut();
    }
    window.location.reload();
  };

  const selectedContact = contacts.find((c) => c.contact_id === selectedContactId)?.contact_user || null;

  return (
    <>
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
          {currentUser && (
            <div style={{ fontSize: '11px' }}>
              <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                {currentUser.username}
              </div>
              <div style={{ fontFamily: 'Courier New, monospace', color: '#0054e3', fontSize: '10px' }}>
                #{currentUser.uq_number}
              </div>
              <div style={{ marginTop: '8px' }}>
                <StatusSelector
                  currentStatus={currentUser.status}
                  onStatusChange={handleStatusChange}
                />
              </div>
            </div>
          )}
        </div>

        <div style={{ flex: 1, overflow: 'auto' }}>
          <ContactList
            contacts={contacts}
            selectedContactId={selectedContactId}
            onSelectContact={setSelectedContactId}
          />
        </div>

        <div style={{ padding: '6px', background: '#ece9d8', borderTop: '1px solid #808080' }}>
          <button
            onClick={() => setShowAddContact(true)}
            className="icq-btn"
            style={{ width: '100%', fontSize: '10px', marginBottom: '4px' }}
          >
            ➕ Add Contact
          </button>
          <button onClick={handleSignOut} className="icq-btn" style={{ width: '100%', fontSize: '10px' }}>
            Sign Out
          </button>
        </div>
      </div>

      {/* Chat Window */}
      <div className="icq-window" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div className="icq-title-bar">
          <span>
            💬 {selectedContact ? `${selectedContact.username} #${selectedContact.uq_number}` : 'UQ Messenger'}
          </span>
        </div>

        <ChatWindow
          selectedContact={selectedContact}
          messages={messages}
          currentUserId={currentUser?.id || ''}
          onSendMessage={handleSendMessage}
        />
      </div>
    </div>

    {showAddContact && currentUser && (
      <AddContactModal
        userId={currentUser.id}
        onClose={() => setShowAddContact(false)}
        onContactAdded={() => {
          loadContacts();
          setShowAddContact(false);
        }}
      />
    )}
    </>
  );
}
