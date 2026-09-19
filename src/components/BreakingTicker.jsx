import { Link } from 'react-router-dom';

export default function BreakingTicker({ items = [] }) {
  if (!items.length) return null;

  const doubled = [...items, ...items];

  return (
    <div className="breaking-ticker">
      <span className="breaking-ticker__label">Breaking</span>
      <div className="breaking-ticker__track">
        <div className="breaking-ticker__content">
          {doubled.map((item, i) => (
            <Link key={`${item.id}-${i}`} to={`/article/${item.id}`} className="breaking-ticker__item">
              {item.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
