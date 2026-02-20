import { useState } from 'react';
import { supabase } from '../lib/supabase';

interface AddContactModalProps {
  userId: string;
  onClose: () => void;
  onContactAdded: () => void;
}

export default function AddContactModal({ userId, onClose, onContactAdded }: AddContactModalProps) {
  const [uqNumber, setUqNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // Find user by UQ number
      const { data: contactUser, error: findError } = await supabase
        .from('users')
        .select('*')
        .eq('uq_number', parseInt(uqNumber))
        .single();

      if (findError || !contactUser) {
        setMessage({ type: 'error', text: 'User not found with that UQ number' });
        setLoading(false);
        return;
      }

      if (contactUser.id === userId) {
        setMessage({ type: 'error', text: "You can't add yourself!" });
        setLoading(false);
        return;
      }

      // Check if already a contact
      const { data: existing } = await supabase
        .from('contacts')
        .select('*')
        .eq('user_id', userId)
        .eq('contact_id', contactUser.id)
        .single();

      if (existing) {
        setMessage({ type: 'error', text: 'Already in your contacts!' });
        setLoading(false);
        return;
      }

      // Add contact
      const { error: addError } = await supabase
        .from('contacts')
        .insert({
          user_id: userId,
          contact_id: contactUser.id,
        });

      if (addError) throw addError;

      setMessage({ type: 'success', text: `Added ${contactUser.username}!` });
      setTimeout(() => {
        onContactAdded();
        onClose();
      }, 1000);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to add contact' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onClick={onClose}
      >
        {/* Modal */}
        <div
          className="icq-window"
          style={{ width: '400px', maxWidth: '90%' }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="icq-title-bar">
            <span>➕ Add Contact</span>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                fontSize: '16px',
                padding: '0 5px',
              }}
            >
              ×
            </button>
          </div>

          <div style={{ padding: '20px', background: 'white' }}>
            <p style={{ fontSize: '11px', marginBottom: '15px', color: '#666' }}>
              Enter the UQ number of the person you want to add:
            </p>

            <form onSubmit={handleAddContact}>
              <div style={{ marginBottom: '10px' }}>
                <label style={{ fontSize: '11px', fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>
                  UQ Number:
                </label>
                <input
                  type="number"
                  value={uqNumber}
                  onChange={(e) => setUqNumber(e.target.value)}
                  placeholder="12345"
                  required
                  className="icq-input"
                  disabled={loading}
                  style={{ fontFamily: 'Courier New, monospace' }}
                />
              </div>

              {message && (
                <div
                  style={{
                    marginBottom: '10px',
                    padding: '8px',
                    background: message.type === 'success' ? '#e0ffe0' : '#ffe0e0',
                    border: '1px solid ' + (message.type === 'success' ? '#00cc00' : '#cc0000'),
                    fontSize: '11px',
                  }}
                >
                  {message.text}
                </div>
              )}

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="submit"
                  disabled={loading || !uqNumber}
                  className="icq-btn"
                  style={{ flex: 1 }}
                >
                  {loading ? 'Adding...' : 'Add Contact'}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="icq-btn"
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
