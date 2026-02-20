import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FlowerLogo from '../components/FlowerLogo';

export default function Landing() {
  const navigate = useNavigate();
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  const demoMessages = [
    { user: 'Sarah #482-916-734', text: 'Hey! Remember ICQ? 🌺', time: '2:34 PM' },
    { user: 'Mike #571-829-401', text: 'OMG yes! The flower, the sounds!', time: '2:35 PM' },
    { user: 'Sarah #482-916-734', text: 'This is exactly like the old days', time: '2:35 PM' },
    { user: 'Mike #571-829-401', text: 'But modern and fast!', time: '2:36 PM' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % demoMessages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const visibleMessages = demoMessages.slice(0, currentMessageIndex + 1);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #d4d0c8 0%, #ece9d8 50%, #d4d0c8 100%)',
      fontFamily: 'Tahoma, Arial, sans-serif',
      overflowY: 'auto',
      overflowX: 'hidden'
    }}>
      {/* Hero Section */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '60px 30px',
        textAlign: 'center'
      }}>
        <div style={{
          marginBottom: '30px',
          animation: 'flowerFloat 3s ease-in-out infinite'
        }}>
          <FlowerLogo status="online" size={120} />
        </div>

        <h1 style={{
          fontSize: '56px',
          fontWeight: 'bold',
          color: '#0054e3',
          marginBottom: '20px',
          textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
        }}>
          The ICQ Spiritual Successor
        </h1>

        <p style={{
          fontSize: '24px',
          color: '#333',
          marginBottom: '40px',
          lineHeight: '1.5'
        }}>
          Remember the flower? The "Uh-oh!" sound? Your 9-digit number?<br />
          <strong style={{ color: '#0054e3' }}>It's all back. Reimagined for 2026.</strong>
        </p>

        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginBottom: '60px' }}>
          <button
            onClick={() => navigate('/login')}
            className="icq-btn"
            style={{
              padding: '20px 50px',
              fontSize: '20px',
              background: '#00ff00',
              color: '#000',
              fontWeight: 'bold',
              boxShadow: '0 4px 12px rgba(0,255,0,0.3)',
              border: '3px solid',
              borderColor: '#ffffff #404040 #404040 #ffffff'
            }}
          >
            🌺 START HERE
          </button>

          <button
            className="icq-btn"
            style={{
              padding: '20px 50px',
              fontSize: '20px',
              background: '#0054e3',
              color: 'white',
              fontWeight: 'bold'
            }}
          >
            📥 Download App
          </button>
        </div>

        {/* Live Chat Demo */}
        <div style={{
          maxWidth: '700px',
          margin: '0 auto',
          background: '#ece9d8',
          border: '3px solid',
          borderColor: '#ffffff #808080 #808080 #ffffff',
          boxShadow: '4px 4px 8px rgba(0,0,0,0.3)',
          overflow: 'hidden'
        }}>
          {/* Window Title Bar */}
          <div style={{
            background: 'linear-gradient(to bottom, #0054e3 0%, #0054e3 50%, #0041b8 50%, #0041b8 100%)',
            color: 'white',
            padding: '8px 12px',
            fontSize: '14px',
            fontWeight: 'bold',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>💬 Live Chat Demo</span>
            <div style={{ display: 'flex', gap: '5px' }}>
              <div style={{ width: '18px', height: '18px', background: '#d4d0c8', border: '1px solid #808080' }} />
              <div style={{ width: '18px', height: '18px', background: '#d4d0c8', border: '1px solid #808080' }} />
              <div style={{ width: '18px', height: '18px', background: '#d4d0c8', border: '1px solid #808080' }}>×</div>
            </div>
          </div>

          {/* Chat Messages */}
          <div style={{
            background: 'white',
            padding: '20px',
            minHeight: '300px',
            textAlign: 'left'
          }}>
            {visibleMessages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  marginBottom: '20px',
                  animation: 'fadeIn 0.5s ease-in',
                  opacity: 1
                }}
              >
                <div style={{
                  color: '#0054e3',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  marginBottom: '5px'
                }}>
                  {msg.user}:
                </div>
                <div style={{
                  fontSize: '16px',
                  color: '#000',
                  marginBottom: '3px'
                }}>
                  {msg.text}
                </div>
                <div style={{
                  fontSize: '11px',
                  color: '#999'
                }}>
                  {msg.time}
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div style={{
            background: '#ece9d8',
            padding: '15px',
            borderTop: '2px solid #808080'
          }}>
            <div className="icq-input" style={{
              width: '100%',
              padding: '10px',
              fontSize: '14px',
              color: '#999',
              marginBottom: '10px'
            }}>
              Type your message here...
            </div>
            <button className="icq-btn" style={{ fontSize: '14px', padding: '8px 20px' }}>
              Send
            </button>
          </div>
        </div>
      </div>

      {/* Features */}
      <div style={{
        background: 'rgba(255,255,255,0.5)',
        padding: '60px 30px',
        borderTop: '3px solid #808080',
        borderBottom: '3px solid #808080'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '30px'
          }}>
            {[
              { icon: '🌺', title: 'Your UQ Number', desc: 'Get your unique 9-digit ID. Just like ICQ.' },
              { icon: '🟢', title: 'Real Presence', desc: 'Online, Away, Busy, Invisible. Know before you message.' },
              { icon: '⚡', title: 'Instant Messaging', desc: 'Real-time delivery with "Uh-oh!" notifications.' },
              { icon: '🌍', title: 'Global Registry', desc: 'Browse and add users from around the world.' },
              { icon: '🔐', title: 'Magic Link Auth', desc: 'No passwords. Just email → click → you\'re in.' },
              { icon: '🤖', title: 'AI Translation', desc: 'Chat with anyone, anywhere. Powered by Claude.' },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="icq-window"
                style={{
                  padding: '25px',
                  textAlign: 'center',
                  background: '#fff'
                }}
              >
                <div style={{ fontSize: '48px', marginBottom: '15px' }}>{feature.icon}</div>
                <div style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: '#0054e3',
                  marginBottom: '10px'
                }}>
                  {feature.title}
                </div>
                <div style={{ fontSize: '14px', color: '#666', lineHeight: '1.5' }}>
                  {feature.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Downloads */}
      <div style={{
        padding: '60px 30px',
        textAlign: 'center',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <h2 style={{
          fontSize: '42px',
          color: '#0054e3',
          marginBottom: '20px'
        }}>
          Available Everywhere
        </h2>
        <p style={{ fontSize: '18px', color: '#666', marginBottom: '40px' }}>
          Web, macOS, Windows, and Linux
        </p>
        <div style={{
          display: 'flex',
          gap: '20px',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          {[
            { emoji: '🌐', label: 'Web App', link: '/login' },
            { emoji: '🍎', label: 'macOS' },
            { emoji: '🪟', label: 'Windows' },
            { emoji: '🐧', label: 'Linux' },
          ].map((platform, idx) => (
            <button
              key={idx}
              onClick={() => platform.link && navigate(platform.link)}
              className="icq-btn"
              style={{
                padding: '20px 40px',
                fontSize: '18px',
                background: 'white',
                fontWeight: 'bold'
              }}
            >
              {platform.emoji} {platform.label}
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{
        background: '#0054e3',
        color: 'white',
        padding: '30px',
        textAlign: 'center',
        borderTop: '3px solid #808080'
      }}>
        <div style={{ marginBottom: '15px' }}>
          <FlowerLogo status="online" size={50} />
        </div>
        <div style={{ fontSize: '14px', opacity: 0.9 }}>
          UQ Messenger © 2026 • Not affiliated with ICQ LLC<br />
          A spiritual successor for the nostalgic generation
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes flowerFloat {
          0%, 100% {
            transform: translateY(0px) rotate(0deg) scale(1);
          }
          25% {
            transform: translateY(-10px) rotate(5deg) scale(1.05);
          }
          50% {
            transform: translateY(-15px) rotate(0deg) scale(1.08);
          }
          75% {
            transform: translateY(-10px) rotate(-5deg) scale(1.05);
          }
        }
      `}</style>
    </div>
  );
}
