export function ProductCard({ item }) {
  return (
    <div className="g-card">
      <img
        src={item.src}
        alt={item.alt}
        style={item.objectPosition ? { objectPosition: item.objectPosition } : undefined}
      />
      <div className="g-label">{item.label}</div>
    </div>
  );
}

export default function Gallery({ items = [], cols }) {
  // The CMS saves `cols` as a string, the checked-in JSON may hold a number, so
  // coerce. Only 2 and 3 have modifier classes; anything else keeps the 4-up default.
  const n = Number(cols);
  const className = n === 2 || n === 3 ? `gallery cols-${n}` : 'gallery';

  return (
    <div className={className}>
      {items.map((item) => (
        <ProductCard key={item.label} item={item} />
      ))}
    </div>
  );
}
