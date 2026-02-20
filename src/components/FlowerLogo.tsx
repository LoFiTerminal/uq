import type { UserStatus } from '../types';

interface FlowerLogoProps {
  status?: UserStatus;
  size?: number;
}

export default function FlowerLogo({ status = 'online', size = 50 }: FlowerLogoProps) {
  // Sophisticated color scheme based on status
  let petalColor: string;
  let centerColor: string;
  let innerCenterColor: string;

  switch (status) {
    case 'online':
      // All green
      petalColor = '#00ff00';
      centerColor = '#00cc00';
      innerCenterColor = '#00ff88';
      break;

    case 'away':
      // Yellow leaves, green center
      petalColor = '#ffff00';
      centerColor = '#00cc00';
      innerCenterColor = '#00ff88';
      break;

    case 'busy':
      // Green/yellow leaves, red center
      petalColor = '#ffff00';
      centerColor = '#ff0000';
      innerCenterColor = '#ff6666';
      break;

    case 'invisible':
      // All gray
      petalColor = '#999999';
      centerColor = '#666666';
      innerCenterColor = '#888888';
      break;

    default:
      petalColor = '#00ff00';
      centerColor = '#00cc00';
      innerCenterColor = '#00ff88';
  }

  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      {/* Outer petals/leaves */}
      <circle cx="50" cy="30" r="18" fill={petalColor} opacity="0.9"/>
      <circle cx="70" cy="50" r="18" fill={petalColor} opacity="0.9"/>
      <circle cx="50" cy="70" r="18" fill={petalColor} opacity="0.9"/>
      <circle cx="30" cy="50" r="18" fill={petalColor} opacity="0.9"/>

      {/* Inner petals */}
      <circle cx="62" cy="38" r="18" fill={petalColor} opacity="0.7"/>
      <circle cx="62" cy="62" r="18" fill={petalColor} opacity="0.7"/>
      <circle cx="38" cy="62" r="18" fill={petalColor} opacity="0.7"/>
      <circle cx="38" cy="38" r="18" fill={petalColor} opacity="0.7"/>

      {/* Center - large */}
      <circle cx="50" cy="50" r="20" fill={centerColor}/>

      {/* Center - inner */}
      <circle cx="50" cy="50" r="12" fill={innerCenterColor}/>
    </svg>
  );
}
