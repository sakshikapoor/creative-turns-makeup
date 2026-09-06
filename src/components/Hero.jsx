import { site } from '../data/site.js';
import hero from '../../content/hero.json';
import emphasis from '../lib/emphasis.jsx';
import { WhatsAppIcon, YarnIcon } from './Icons.jsx';

export default function Hero() {
  return (
    <section className="hero">
      <div>
        <div className="eyebrow-line">
          <YarnIcon />
          {hero.eyebrow}
        </div>
        <h1>{emphasis(hero.heading)}</h1>
        <p className="lede">{hero.lede}</p>
        <div className="hero-actions">
          <a href={site.whatsapp} className="btn-primary">
            <WhatsAppIcon />
            {hero.primaryLabel}
          </a>
          <a href="#hair" className="btn-secondary">
            {hero.secondaryLabel}
          </a>
        </div>
      </div>
      <div className="hero-art">
        <div className="frame">
          <img src={hero.image} alt={hero.imageAlt} />
        </div>
        <div className="sticker">{hero.sticker}</div>
      </div>
    </section>
  );
}
