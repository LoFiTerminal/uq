import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, isConfigured } from '../lib/supabase';
import FlowerLogo from '../components/FlowerLogo';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isConfigured) {
      setMessage({
        type: 'error',
        text: 'Supabase is not configured. Check your .env file.',
      });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/app`,
        },
      });

      if (error) throw error;

      setMessage({
        type: 'success',
        text: 'Check your email for the magic link!',
      });
      setEmail('');
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.message || 'Something went wrong',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      background: '#c0c0c0',
      padding: '20px'
    }}>
      <div className="icq-window" style={{ width: '100%', maxWidth: '450px' }}>
        <div className="icq-title-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={() => navigate('/')}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              fontSize: '14px',
              padding: '0 10px'
            }}
          >
            ← Back
          </button>
          <span>🌺 UQ Messenger - Login</span>
          <div style={{ width: '60px' }} />
        </div>

        <div style={{ padding: '30px', background: 'white' }}>
          {/* Flower Logo */}
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <FlowerLogo status="online" size={80} />
          </div>

          <h2 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '10px',
            color: '#000'
          }}>
            Welcome to UQ
          </h2>

          <p style={{
            fontSize: '12px',
            textAlign: 'center',
            marginBottom: '20px',
            color: '#666'
          }}>
            {isConfigured ?
              'Enter your email to receive a magic link' :
              'Demo Mode - Supabase not configured'}
          </p>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '10px' }}>
              <label style={{ fontSize: '11px', fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>
                Email Address:
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="icq-input"
                disabled={!isConfigured}
              />
            </div>

            <button
              type="submit"
              disabled={loading || !isConfigured}
              className="icq-btn"
              style={{ width: '100%', marginTop: '10px' }}
            >
              {loading ? 'Sending...' : 'Send Magic Link'}
            </button>
          </form>

          {message && (
            <div style={{
              marginTop: '15px',
              padding: '10px',
              background: message.type === 'success' ? '#e0ffe0' : '#ffe0e0',
              border: '1px solid ' + (message.type === 'success' ? '#00cc00' : '#cc0000'),
              fontSize: '11px',
              borderRadius: '2px'
            }}>
              {message.text}
            </div>
          )}

          <div style={{
            marginTop: '20px',
            paddingTop: '15px',
            borderTop: '1px solid #ccc',
            fontSize: '10px',
            color: '#666',
            textAlign: 'center'
          }}>
            <p>✨ No passwords needed</p>
            <p style={{ marginTop: '5px' }}>New? You'll get your UQ number on first sign-in!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
