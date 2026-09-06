import Gallery from './Gallery.jsx';

export default function Section({ section }) {
  const { id, alt, kicker, title, blurb, subsections, items, cols } = section;

  return (
    <section className={alt ? 'section alt' : 'section'} id={id}>
      <div className="section-head">
        <span className="kicker">{kicker}</span>
        <h2>{title}</h2>
        <p>{blurb}</p>
      </div>

      {subsections
        ? subsections.map((sub) => (
            <div className="subsection" key={sub.title}>
              <div className="subsection-head">
                <h3>{sub.title}</h3>
                <p>{sub.blurb}</p>
              </div>
              <Gallery items={sub.items} cols={sub.cols} />
            </div>
          ))
        : <Gallery items={items} cols={cols} />}
    </section>
  );
}
