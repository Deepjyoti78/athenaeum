import React from 'react';

export function AthenaeumLogo({ className = "w-9 h-9" }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer circle */}
      <circle cx="50" cy="50" r="46" stroke="#AAA99B" strokeWidth="1.75" />
      {/* Inner thin circle */}
      <circle cx="50" cy="50" r="38" stroke="#77766B" strokeWidth="0.75" strokeDasharray="1.5 1.5" />
      {/* Inscribed Equilateral Triangle */}
      <polygon points="50,15 82,73 18,73" stroke="#AAA99B" strokeWidth="1.75" fill="none" />
      {/* Central vertical meridian line */}
      <line x1="50" y1="12" x2="50" y2="88" stroke="#AAA99B" strokeWidth="1.5" />
      {/* Horizontal chord line */}
      <line x1="28" y1="52" x2="72" y2="52" stroke="#77766B" strokeWidth="1" />
      {/* Center circle focal point */}
      <circle cx="50" cy="52" r="5" stroke="#AAA99B" strokeWidth="1.2" fill="#11130F" />
      <circle cx="50" cy="52" r="1.5" fill="#AAA99B" />
    </svg>
  );
}

