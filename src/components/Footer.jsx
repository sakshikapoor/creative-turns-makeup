import { site, footerLinks } from '../data/site.js';
import { WhatsAppIcon, InstagramIcon } from './Icons.jsx';

export default function Footer() {
  return (
    <footer>
      <div className="footer-inner">
        <div>
          <div className="logo">
            <img src={site.logo} alt={`${site.name} logo`} />
            {site.name}
          </div>
          <p style={{ color: 'var(--ink-soft)', fontSize: '0.92rem', maxWidth: '32ch' }}>
            {site.tagline}
          </p>
          <div className="contact-line">
            <WhatsAppIcon simple />
            {site.phoneDisplay}
          </div>
          <div className="contact-line">
            <InstagramIcon simple />
            {site.instagramHandle}
          </div>
        </div>
        <div className="footer-links">
          {footerLinks.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
