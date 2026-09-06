import { categories } from '../data/catalog.js';
import { CategoryIcon } from './Icons.jsx';

export default function Quilt() {
  return (
    <section className="section alt" id="more">
      <div className="section-head">
        <span className="kicker">{categories.kicker}</span>
        <h2>{categories.title}</h2>
        <p>{categories.blurb}</p>
      </div>
      <div className="quilt">
        {categories.tiles.map((tile) => (
          <div className="quilt-tile" key={tile.label}>
            <CategoryIcon name={tile.icon} />
            <span>{tile.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
