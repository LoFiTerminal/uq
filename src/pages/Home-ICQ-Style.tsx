import { useState, useEffect } from 'react';
import { supabase, isConfigured } from '../lib/supabase';
import { playMessageSound } from '../lib/sounds';
import type { User, Contact, Message } from '../types';
import AddContactModal from '../components/AddContactModal';
import UserRegistry from '../components/UserRegistry';
import FlowerLogo from '../components/FlowerLogo';

export default function HomeICQStyle() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showAddContact, setShowAddContact] = useState(false);
  const [showUserRegistry, setShowUserRegistry] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const [showOnlineOnly, setShowOnlineOnly] = useState(true);
  const [hasMoreMessages, setHasMoreMessages] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const MESSAGE_PAGE_SIZE = 50;

  useEffect(() => {
    if (isConfigured) {
      loadUserData();
      loadContacts();
    }
  }, []);

  useEffect(() => {
    if (selectedContactId && currentUser && isConfigured) {
      loadMessages(selectedContactId);
      return subscribeToMessages(selectedContactId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedContactId, currentUser]);

  const loadUserData = async () => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;

      if (user) {
        const { data, error } = await supabase.from('users').select('*').eq('id', user.id).single();
        if (error) throw error;
        if (data) setCurrentUser(data);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const loadContacts = async () => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;
      if (!user) return;

      const { data, error } = await supabase
        .from('contacts')
        .select(`*, contact_user:users!contacts_contact_id_fkey(*)`)
        .eq('user_id', user.id);

      if (error) throw error;
      if (data) setContacts(data as Contact[]);
    } catch (error) {
      console.error('Error loading contacts:', error);
    }
  };

  const loadMessages = async (contactId: string, limit: number = MESSAGE_PAGE_SIZE) => {
    if (!currentUser) return;

    try {
      // Load one extra to check if there are more messages
      const { data, error } = await supabase
        .from('messages')
        .select(`*, sender:users!messages_sender_id_fkey(*)`)
        .or(`and(sender_id.eq.${currentUser.id},recipient_id.eq.${contactId}),and(sender_id.eq.${contactId},recipient_id.eq.${currentUser.id})`)
        .order('created_at', { ascending: false })
        .limit(limit + 1);

      if (error) throw error;

      if (data) {
        const hasMore = data.length > limit;
        const messagesToShow = hasMore ? data.slice(0, limit) : data;

        setHasMoreMessages(hasMore);
        // Reverse to show oldest first
        setMessages((messagesToShow as Message[]).reverse());
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const loadMoreMessages = async () => {
    if (!currentUser || !selectedContactId || isLoadingMore) return;

    setIsLoadingMore(true);
    try {
      const oldestMessage = messages[0];
      if (!oldestMessage) return;

      // Load messages older than the oldest current message
      const { data, error } = await supabase
        .from('messages')
        .select(`*, sender:users!messages_sender_id_fkey(*)`)
        .or(`and(sender_id.eq.${currentUser.id},recipient_id.eq.${selectedContactId}),and(sender_id.eq.${selectedContactId},recipient_id.eq.${currentUser.id})`)
        .lt('created_at', oldestMessage.created_at)
        .order('created_at', { ascending: false })
        .limit(MESSAGE_PAGE_SIZE + 1);

      if (error) throw error;

      if (data) {
        const hasMore = data.length > MESSAGE_PAGE_SIZE;
        const messagesToAdd = hasMore ? data.slice(0, MESSAGE_PAGE_SIZE) : data;

        setHasMoreMessages(hasMore);
        // Prepend older messages (reversed to maintain chronological order)
        setMessages((prev) => [...(messagesToAdd as Message[]).reverse(), ...prev]);
      }
    } catch (error) {
      console.error('Error loading more messages:', error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const subscribeToMessages = (contactId: string) => {
    if (!currentUser) return;
    const channel = supabase.channel('messages').on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'messages', filter: `recipient_id=eq.${currentUser.id}` },
      async (payload) => {
        const newMessage = payload.new as Message;
        if (newMessage.sender_id === contactId) {
          // Fetch the complete message with sender data
          const { data } = await supabase
            .from('messages')
            .select(`*, sender:users!messages_sender_id_fkey(*)`)
            .eq('id', newMessage.id)
            .single();

          if (data) {
            setMessages((prev) => [...prev, data as Message]);
            playMessageSound();
          }
        }
      }
    ).subscribe();
    return () => { supabase.removeChannel(channel); };
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !selectedContactId || !messageInput.trim()) return;

    try {
      const { data, error } = await supabase.from('messages').insert({
        sender_id: currentUser.id,
        recipient_id: selectedContactId,
        content: messageInput.trim(),
        created_at: new Date().toISOString(),
      }).select(`*, sender:users!messages_sender_id_fkey(*)`).single();

      if (error) throw error;

      if (data) {
        // Optimistically add the sent message to state
        setMessages((prev) => [...prev, data as Message]);
        setMessageInput('');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    }
  };

  const handleAddUserFromRegistry = async (userId: string) => {
    if (!currentUser) return;

    try {
      const { error } = await supabase.from('contacts').insert({
        user_id: currentUser.id,
        contact_id: userId,
      });

      if (error) throw error;

      loadContacts();
      setShowUserRegistry(false);
    } catch (error) {
      console.error('Error adding contact:', error);
      alert('Failed to add contact. They may already be in your list.');
    }
  };

  const handleStatusChange = async (newStatus: User['status']) => {
    if (!currentUser) return;

    try {
      const { error } = await supabase.from('users').update({ status: newStatus }).eq('id', currentUser.id);

      if (error) throw error;

      setCurrentUser({ ...currentUser, status: newStatus });
    } catch (error) {
      console.error('Error changing status:', error);
      alert('Failed to change status. Please try again.');
    }
  };

  const selectedContact = contacts.find((c) => c.contact_id === selectedContactId)?.contact_user || null;
  const filteredContacts = showOnlineOnly ? contacts.filter(c => c.contact_user?.status === 'online') : contacts;

  return (
    <>
    <div style={{ display: 'flex', height: '100vh', background: '#c0c0c0', fontFamily: 'Tahoma, Arial, sans-serif', fontSize: '16px' }}>

      {/* Left Panel - Quick Actions */}
      <div style={{ width: '140px', background: '#ece9d8', borderRight: '2px solid #808080', display: 'flex', flexDirection: 'column', padding: '10px 6px' }}>
        <div style={{ textAlign: 'center', marginBottom: '10px', fontSize: '14px', fontWeight: 'bold', padding: '6px', background: '#0054e3', color: 'white' }}>
          🌺 Quick Menu
        </div>

        <button onClick={() => setShowUserRegistry(true)} className="icq-btn" style={{
          width: '100%',
          marginBottom: '8px',
          padding: '10px',
          fontSize: '14px',
        }}>
          👥 Find Users
        </button>

        <button onClick={() => setShowAddContact(true)} className="icq-btn" style={{
          width: '100%',
          marginBottom: '8px',
          padding: '10px',
          fontSize: '14px',
        }}>
          ➕ Add Contact
        </button>

        <button className="icq-btn" style={{
          width: '100%',
          marginBottom: '8px',
          padding: '10px',
          fontSize: '14px',
        }}>
          💬 Messages
        </button>

        <div style={{ flex: 1 }} />

        {/* Dynamic Flower Logo */}
        <div style={{ textAlign: 'center', padding: '15px' }}>
          <FlowerLogo status={currentUser?.status || 'online'} size={70} />
          <div style={{ fontSize: '11px', marginTop: '8px', color: '#666', textTransform: 'capitalize' }}>
            {currentUser?.status || 'offline'}
          </div>
        </div>
      </div>

      {/* Main Contact List Window */}
      <div style={{ width: '280px', display: 'flex', flexDirection: 'column' }} className="icq-window">
        <div className="icq-title-bar" style={{ fontSize: '14px', padding: '6px' }}>
          <span>UQ Contact List</span>
        </div>

        {/* User Info Bar */}
        {currentUser && (
          <div style={{ background: '#d4d0c8', padding: '10px', borderBottom: '1px solid #808080' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <div style={{ width: '14px', height: '14px', borderRadius: '50%',
                background: { online: '#00ff00', away: '#ffff00', busy: '#ff0000', invisible: '#c0c0c0' }[currentUser.status],
                border: '2px solid #000' }} />
              <div style={{ flex: 1, fontSize: '14px' }}>
                <div style={{ fontWeight: 'bold' }}>{currentUser.username}</div>
                <div style={{ color: '#0054e3', fontFamily: 'monospace', fontSize: '13px' }}>#{currentUser.uq_number}</div>
              </div>
            </div>

            {/* Status Selector */}
            <select
              value={currentUser.status}
              onChange={(e) => handleStatusChange(e.target.value as User['status'])}
              className="icq-input"
              style={{ width: '100%', fontSize: '13px', padding: '6px' }}
            >
              <option value="online">🟢 Online</option>
              <option value="away">🌙 Away</option>
              <option value="busy">🔴 Busy</option>
              <option value="invisible">👻 Invisible</option>
            </select>
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: 'flex', background: '#d4d0c8', borderBottom: '1px solid #808080' }}>
          <button className="icq-btn" onClick={() => setShowOnlineOnly(true)} style={{
            flex: 1,
            fontSize: '14px',
            padding: '8px',
            background: showOnlineOnly ? '#fff' : '#d4d0c8',
            borderBottom: showOnlineOnly ? 'none' : '1px solid #808080'
          }}>
            Online ({contacts.filter(c => c.contact_user?.status === 'online').length})
          </button>
          <button className="icq-btn" onClick={() => setShowOnlineOnly(false)} style={{
            flex: 1,
            fontSize: '14px',
            padding: '8px',
            background: !showOnlineOnly ? '#fff' : '#d4d0c8',
            borderBottom: !showOnlineOnly ? 'none' : '1px solid #808080'
          }}>
            All ({contacts.length})
          </button>
        </div>

        {/* Contact List */}
        <div style={{ flex: 1, overflow: 'auto', background: 'white' }}>
          {filteredContacts.length === 0 ? (
            <div style={{ padding: '30px 15px', textAlign: 'center', color: '#666' }}>
              <div style={{ fontSize: '14px', marginBottom: '12px' }}>No contacts yet</div>
              <button onClick={() => setShowUserRegistry(true)} className="icq-btn" style={{ fontSize: '13px' }}>
                Find Users
              </button>
            </div>
          ) : (
            filteredContacts.map(contact => {
              const user = contact.contact_user;
              if (!user) return null;
              const isSelected = selectedContactId === contact.contact_id;
              const statusColor = { online: '#00ff00', away: '#ffff00', busy: '#ff0000', invisible: '#c0c0c0' }[user.status];

              return (
                <div
                  key={contact.id}
                  onClick={() => setSelectedContactId(contact.contact_id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 12px',
                    cursor: 'pointer',
                    background: isSelected ? '#0054e3' : 'white',
                    color: isSelected ? 'white' : 'black',
                    fontSize: '14px',
                    borderBottom: '1px solid #f0f0f0'
                  }}
                >
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: statusColor, border: '2px solid #000' }} />
                  <div style={{ flex: 1, fontWeight: 'bold' }}>{user.username}</div>
                  <div style={{ fontSize: '12px', fontFamily: 'monospace', color: isSelected ? '#ffff99' : '#0054e3' }}>
                    {user.uq_number}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Bottom Actions */}
        <div style={{ background: '#d4d0c8', padding: '8px', borderTop: '1px solid #808080' }}>
          <button onClick={() => setShowAddContact(true)} className="icq-btn" style={{ width: '100%', fontSize: '13px', marginBottom: '6px', padding: '8px' }}>
            ➕ Add/Invite Users
          </button>
          <button onClick={() => supabase.auth.signOut()} className="icq-btn" style={{ width: '100%', fontSize: '13px', padding: '8px' }}>
            Sign Out
          </button>
        </div>
      </div>

      {/* Message Window */}
      {selectedContact ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', margin: '10px' }} className="icq-window">
          <div className="icq-title-bar" style={{ fontSize: '14px', padding: '6px' }}>
            <span>💬 Message Session - {selectedContact.username} #{selectedContact.uq_number}</span>
          </div>

          <div style={{ flex: 1, overflow: 'auto', padding: '15px', background: 'white' }}>
            {hasMoreMessages && (
              <div style={{ textAlign: 'center', marginBottom: '15px' }}>
                <button
                  onClick={loadMoreMessages}
                  disabled={isLoadingMore}
                  className="icq-btn"
                  style={{ fontSize: '13px', padding: '8px 15px' }}
                >
                  {isLoadingMore ? 'Loading...' : '⬆️ Load Older Messages'}
                </button>
              </div>
            )}
            {messages.map(msg => (
              <div key={msg.id} style={{ marginBottom: '12px' }}>
                <div style={{ color: msg.sender_id === currentUser?.id ? '#0054e3' : '#666', fontWeight: 'bold', fontSize: '14px' }}>
                  {msg.sender_id === currentUser?.id ? 'You' : selectedContact.username}:
                </div>
                <div style={{ fontSize: '15px', marginTop: '4px', lineHeight: '1.4' }}>{msg.content}</div>
                <div style={{ fontSize: '11px', color: '#999', marginTop: '4px' }}>
                  {new Date(msg.created_at).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>

          <div style={{ padding: '10px', background: '#ece9d8', borderTop: '2px solid #808080' }}>
            <form onSubmit={handleSendMessage}>
              <textarea
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Enter message here..."
                className="icq-input"
                style={{ width: '100%', height: '80px', marginBottom: '8px', resize: 'none', fontSize: '14px' }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }}
              />
              <button type="submit" disabled={!messageInput.trim()} className="icq-btn" style={{ fontSize: '14px', padding: '8px 20px' }}>
                Send
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '15px' }}>
          <div style={{ fontSize: '64px' }}>💬</div>
          <div style={{ fontSize: '18px', fontWeight: 'bold' }}>Welcome to UQ Messenger</div>
          <div style={{ fontSize: '14px', color: '#666' }}>Select a contact to start messaging</div>
        </div>
      )}
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

    {showUserRegistry && currentUser && (
      <UserRegistry
        currentUserId={currentUser.id}
        onClose={() => setShowUserRegistry(false)}
        onAddUser={handleAddUserFromRegistry}
      />
    )}
    </>
  );
}
