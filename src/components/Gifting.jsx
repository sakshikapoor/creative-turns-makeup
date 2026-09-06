import { gifting } from '../data/catalog.js';
import { CategoryIcon, CheckIcon } from './Icons.jsx';

export default function Gifting() {
  return (
    <section className="section" id="gifting">
      <div className="section-head">
        <span className="kicker">{gifting.kicker}</span>
        <h2>{gifting.title}</h2>
        <p>{gifting.blurb}</p>
      </div>
      <div className="gifting-split">
        {gifting.columns.map((col) => (
          <div className="gift-col" key={col.title}>
            <div className="icon-badge">
              <CategoryIcon name={col.icon} width="24" height="24" />
            </div>
            <h3>{col.title}</h3>
            <p>{col.blurb}</p>
            <ul>
              {col.points.map((point) => (
                <li key={point}>
                  <CheckIcon />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
