import { Link } from 'react-router-dom';
import { formatShortDate, categoryLabel } from '../utils/format';
import ArticleImage from './ArticleImage';

export default function ArticleCard({ article, categories, variant = 'default' }) {
  const label = categoryLabel(article.category, categories);

  return (
    <article className={`article-card article-card--${variant}`}>
      <Link to={`/article/${article.id}`} className="article-card__image-wrap">
        <ArticleImage article={article} />
      </Link>
      <div className="article-card__body">
        <Link to={`/category/${categories.find((c) => c.id === article.category)?.slug}`} className="article-card__category">
          {label}
        </Link>
        <h3>
          <Link to={`/article/${article.id}`}>{article.title}</Link>
        </h3>
        <p className="article-card__excerpt">{article.excerpt}</p>
        <div className="article-card__meta">
          <span>{formatShortDate(article.publishedAt)}</span>
          <span>{article.readTime} min read</span>
        </div>
      </div>
    </article>
  );
}
