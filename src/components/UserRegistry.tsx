import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { User } from '../types';

interface UserRegistryProps {
  currentUserId: string;
  onClose: () => void;
  onAddUser: (userId: string) => void;
}

export default function UserRegistry({ currentUserId, onClose, onAddUser }: UserRegistryProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const { data } = await supabase
      .from('users')
      .select('*')
      .neq('id', currentUserId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (data) setUsers(data);
    setLoading(false);
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.uq_number.toString().includes(searchQuery)
  );

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }} onClick={onClose}>
      <div className="icq-window" style={{ width: '500px', maxWidth: '90%', maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}
        onClick={(e) => e.stopPropagation()}>
        <div className="icq-title-bar">
          <span>👥 Global User Registry</span>
          <button onClick={onClose} style={{
            background: 'none',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            fontSize: '20px',
            padding: '0 8px',
          }}>×</button>
        </div>

        <div style={{ padding: '15px', background: 'white' }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by username or UQ number..."
            className="icq-input"
            style={{ marginBottom: '10px', fontSize: '14px' }}
          />
        </div>

        <div style={{ flex: 1, overflow: 'auto', background: 'white', borderTop: '1px solid #ccc' }}>
          {loading ? (
            <div style={{ padding: '30px', textAlign: 'center', fontSize: '14px' }}>Loading users...</div>
          ) : filteredUsers.length === 0 ? (
            <div style={{ padding: '30px', textAlign: 'center', fontSize: '14px' }}>No users found</div>
          ) : (
            filteredUsers.map(user => (
              <div key={user.id} style={{
                padding: '12px',
                borderBottom: '1px solid #f0f0f0',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontSize: '14px'
              }}>
                <div style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: user.status === 'online' ? '#00ff00' : '#c0c0c0',
                  border: '1px solid #000',
                  flexShrink: 0
                }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 'bold' }}>{user.username}</div>
                  <div style={{ fontSize: '12px', color: '#0054e3', fontFamily: 'monospace' }}>
                    #{user.uq_number}
                  </div>
                </div>
                <button
                  onClick={() => onAddUser(user.id)}
                  className="icq-btn"
                  style={{ fontSize: '12px' }}
                >
                  Add
                </button>
              </div>
            ))
          )}
        </div>

        <div style={{ padding: '10px', background: '#ece9d8', borderTop: '1px solid #808080', textAlign: 'center', fontSize: '12px', color: '#666' }}>
          Showing {filteredUsers.length} of {users.length} users
        </div>
      </div>
    </div>
  );
}
