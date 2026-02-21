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
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        if (data) {
          setCurrentUser(data);
        }
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
        .select(`
          *,
          contact_user:users!contacts_contact_id_fkey(*)
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      if (data) {
        setContacts(data as Contact[]);
      }
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
        .select(`
          *,
          sender:users!messages_sender_id_fkey(*)
        `)
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
        .select(`
          *,
          sender:users!messages_sender_id_fkey(*)
        `)
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
        async (payload) => {
          const newMessage = payload.new as Message;
          if (newMessage.sender_id === contactId) {
            // Fetch the complete message with sender data
            const { data } = await supabase
              .from('messages')
              .select(`
                *,
                sender:users!messages_sender_id_fkey(*)
              `)
              .eq('id', newMessage.id)
              .single();

            if (data) {
              setMessages((prev) => [...prev, data as Message]);
              playMessageSound();
            }
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

    try {
      const { data, error } = await supabase.from('messages').insert({
        sender_id: currentUser.id,
        recipient_id: selectedContactId,
        content,
        created_at: new Date().toISOString(),
      }).select(`
        *,
        sender:users!messages_sender_id_fkey(*)
      `).single();

      if (error) throw error;

      if (data) {
        // Optimistically add the sent message to state
        setMessages((prev) => [...prev, data as Message]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    }
  };

  const handleStatusChange = async (status: string) => {
    if (!currentUser || !isConfigured) return;

    try {
      const { error } = await supabase
        .from('users')
        .update({ status })
        .eq('id', currentUser.id);

      if (error) throw error;

      setCurrentUser({ ...currentUser, status: status as User['status'] });
    } catch (error) {
      console.error('Error changing status:', error);
      alert('Failed to change status. Please try again.');
    }
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
          hasMoreMessages={hasMoreMessages}
          onLoadMore={loadMoreMessages}
          isLoadingMore={isLoadingMore}
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
