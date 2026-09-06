import { useState } from 'react';
import { site, navLinks } from '../data/site.js';
import { WhatsAppIcon, MenuIcon } from './Icons.jsx';

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="nav">
      <div className="nav-inner">
        <div className="logo">
          <img src={site.logo} alt={`${site.name} logo`} />
          {site.name}
        </div>
        <nav className={open ? 'nav-links open' : 'nav-links'}>
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
              {link.label}
            </a>
          ))}
        </nav>
        <a href={site.whatsapp} className="nav-cta">
          <WhatsAppIcon />
          Order on WhatsApp
        </a>
        <button
          className="nav-toggle"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <MenuIcon />
        </button>
      </div>
    </header>
  );
}
