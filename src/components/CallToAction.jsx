import { site } from '../data/site.js';
import cta from '../../content/cta.json';
import { WhatsAppIcon, InstagramIcon } from './Icons.jsx';

export default function CallToAction() {
  return (
    <div className="cta" id="contact">
      <h2>{cta.heading}</h2>
      <p>{cta.blurb}</p>
      <div className="cta-actions">
        <a href={site.whatsapp} className="btn-primary">
          <WhatsAppIcon />
          {site.phoneDisplay}
        </a>
        <a href={site.instagram} className="btn-secondary">
          <InstagramIcon />
          {site.instagramHandle}
        </a>
      </div>
    </div>
  );
}
