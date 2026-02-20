import { useState } from 'react';
import type { UserStatus } from '../types';

interface StatusSelectorProps {
  currentStatus: UserStatus;
  onStatusChange: (status: UserStatus) => void;
}

const statusOptions: { status: UserStatus; label: string; color: string }[] = [
  { status: 'online', label: 'Online', color: '#00ff00' },
  { status: 'away', label: 'Away', color: '#ffff00' },
  { status: 'busy', label: 'Do Not Disturb', color: '#ff0000' },
  { status: 'invisible', label: 'Invisible', color: '#c0c0c0' },
];

export default function StatusSelector({ currentStatus, onStatusChange }: StatusSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const currentOption = statusOptions.find((opt) => opt.status === currentStatus);

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="icq-btn"
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '10px',
          padding: '4px 8px'
        }}
      >
        <div style={{
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          background: currentOption?.color,
          border: '1px solid #000'
        }} />
        <span style={{ flex: 1, textAlign: 'left' }}>{currentOption?.label}</span>
        <span>▼</span>
      </button>

      {isOpen && (
        <>
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 10
            }}
            onClick={() => setIsOpen(false)}
          />
          <div style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: '2px',
            background: '#ece9d8',
            border: '2px solid',
            borderColor: '#ffffff #808080 #808080 #ffffff',
            zIndex: 20,
            boxShadow: '2px 2px 4px rgba(0,0,0,0.3)'
          }}>
            {statusOptions.map((option) => (
              <button
                key={option.status}
                onClick={() => {
                  onStatusChange(option.status);
                  setIsOpen(false);
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 8px',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '10px',
                  fontFamily: 'Tahoma, Arial, sans-serif',
                  textAlign: 'left'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = '#0054e3';
                  e.currentTarget.style.color = 'white';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'black';
                }}
              >
                <div style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: option.color,
                  border: '1px solid #000'
                }} />
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
