const WA_PATH =
  'M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.85.5 3.58 1.36 5.07L2 22l5.19-1.44a9.9 9.9 0 0 0 4.85 1.24h.01c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm5.78 14.02c-.24.68-1.4 1.3-1.94 1.38-.5.08-1.12.11-1.8-.11-.42-.13-.96-.31-1.65-.6-2.9-1.25-4.8-4.16-4.94-4.35-.14-.19-1.18-1.57-1.18-3 0-1.42.75-2.12 1.02-2.41.27-.29.58-.36.78-.36l.56.01c.18.01.42-.07.65.5.24.58.82 2 .89 2.14.07.14.12.31.02.5-.09.19-.14.31-.28.48-.14.17-.29.37-.42.5-.14.14-.29.29-.12.57.17.28.75 1.24 1.62 2 1.11.99 2.05 1.3 2.33 1.44.28.14.45.12.62-.07.17-.19.71-.83.9-1.11.19-.28.38-.24.63-.14.26.09 1.65.78 1.93.92.28.14.47.21.53.33.07.13.07.71-.17 1.39z';

// Simplified glyph used in the footer contact lines.
const WA_PATH_SIMPLE =
  'M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.85.5 3.58 1.36 5.07L2 22l5.19-1.44a9.9 9.9 0 0 0 4.85 1.24h.01c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2z';

export function WhatsAppIcon({ simple = false, ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d={simple ? WA_PATH_SIMPLE : WA_PATH} />
    </svg>
  );
}

export function InstagramIcon({ simple = false, ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      {!simple && <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />}
    </svg>
  );
}

export function YarnIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" {...props}>
      <path d="M4 12c0-4 3-7 7-7s7 3 7 7-3 7-7 7" />
      <circle cx="4" cy="12" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function MenuIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...props}>
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

export function CheckIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...props}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

const outline = {
  home: (
    <>
      <rect x="4" y="10" width="16" height="10" rx="1" />
      <path d="M4 10l8-6 8 6" />
    </>
  ),
  lamp: <path d="M12 3v4M8 5h8M6 21h12l-1-9H7l-1 9z" />,
  gift: (
    <>
      <rect x="4" y="8" width="16" height="12" rx="1" />
      <path d="M4 8h16M12 8v12M8 8c0-2 1-3 2-3M16 8c0-2-1-3-2-3" />
    </>
  ),
  building: (
    <>
      <path d="M4 20V10l8-4 8 4v10" />
      <path d="M9 20v-6h6v6" />
    </>
  ),
};

export function CategoryIcon({ name, ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" {...props}>
      {outline[name]}
    </svg>
  );
}

export function StitchDivider() {
  const points = Array.from({ length: 28 }, (_, i) => `T ${(i + 2) * 40} 10`).join(' ');
  return (
    <svg className="stitch-divider" viewBox="0 0 1160 20" preserveAspectRatio="none" aria-hidden="true">
      <path d={`M0 10 Q 20 0, 40 10 ${points}`} stroke="#C97A93" strokeWidth="2.5" fill="none" />
    </svg>
  );
}
