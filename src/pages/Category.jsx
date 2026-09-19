import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getArticles } from '../api';
import { categoryFromSlug, categoryLabel } from '../utils/format';
import ArticleCard from '../components/ArticleCard';

export default function Category({ categories }) {
  const { slug } = useParams();
  const categoryId = categoryFromSlug(slug, categories);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!categoryId) return;

    let active = true;
    setLoading(true);

    getArticles(categoryId)
      .then((data) => { if (active) setArticles(data); })
      .catch(() => { if (active) setArticles([]); })
      .finally(() => { if (active) setLoading(false); });

    const poll = setInterval(() => {
      getArticles(categoryId)
        .then((data) => { if (active) setArticles(data); })
        .catch(() => {});
    }, 4000);

    const stop = setTimeout(() => clearInterval(poll), 90000);

    return () => {
      active = false;
      clearInterval(poll);
      clearTimeout(stop);
    };
  }, [categoryId]);

  const label = categoryLabel(categoryId, categories);

  if (!categoryId) {
    return <div className="error-state">Section not found.</div>;
  }

  return (
    <div className="category-page">
      <header className="page-header">
        <span className="section-label">Section</span>
        <h1>{label}</h1>
        <p>Complete coverage and analysis from the Best News Media {label.toLowerCase()} desk.</p>
      </header>

      {loading ? (
        <div className="loading-state">Loading {label.toLowerCase()} stories…</div>
      ) : (
        <div className="article-grid">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} categories={categories} />
          ))}
        </div>
      )}
    </div>
  );
}
