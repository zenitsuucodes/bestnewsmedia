import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getArticle, getArticles } from '../api';
import { formatDate, categoryLabel, categorySlug } from '../utils/format';
import { articlePath } from '../utils/slug';
import ArticleCard from '../components/ArticleCard';
import ArticleImage from '../components/ArticleImage';

export default function Article({ categories }) {
  const { slug: articleSlug } = useParams();
  const [article, setArticle] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(false);

    async function load() {
      try {
        const data = await getArticle(articleSlug);
        if (!active) return;
        setArticle(data);
        const all = await getArticles(data.category);
        if (!active) return;
        setRelated(all.filter((a) => a.id !== data.id).slice(0, 3));
      } catch {
        if (active) setError(true);
      } finally {
        if (active) setLoading(false);
      }
    }

    load();

    return () => {
      active = false;
    };
  }, [articleSlug]);

  if (loading) return <div className="loading-state">Loading article…</div>;
  if (error || !article) return <div className="error-state">Story not found.</div>;

  const label = categoryLabel(article.category, categories);
  const categoryPath = categorySlug(article.category, categories);

  return (
    <article className="article-page">
      <div className="article-page__header">
        <Link to={`/category/${categoryPath}`} className="article-page__category">{label}</Link>
        <h1>{article.title}</h1>
        <div className="article-meta article-meta--large">
          <span>By {article.author}</span>
          <span>{formatDate(article.publishedAt)}</span>
          <span>{article.readTime} min read</span>
        </div>
      </div>

      <figure className="article-page__hero">
        <ArticleImage article={article} />
      </figure>

      <div className="article-page__body">
        {article.body.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>

      <div className="article-page__footer">
        <p className="article-page__dateline">
          Reporting from the Best News Media newsroom · Published {formatDate(article.publishedAt)}
        </p>
      </div>

      {related.length > 0 && (
        <section className="related-stories">
          <h2>Related Coverage</h2>
          <div className="related-grid">
            {related.map((item) => (
              <ArticleCard key={item.id} article={item} categories={categories} variant="compact" />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
