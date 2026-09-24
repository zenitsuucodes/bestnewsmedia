import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getArticles } from '../api';
import { articlePath } from '../utils/slug';
import ArticleCard from '../components/ArticleCard';
import ArticleImage from '../components/ArticleImage';

export default function Home({ categories }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    getArticles()
      .then((data) => { if (active) setArticles(data); })
      .catch(() => { if (active) setArticles([]); })
      .finally(() => { if (active) setLoading(false); });

    return () => {
      active = false;
    };
  }, []);

  const lead = articles[0];
  const secondary = articles.slice(1, 4);
  const latest = articles.slice(4, 16);
  const sidebar = articles.slice(16, 24);

  if (loading) {
    return <div className="loading-state">Loading today&apos;s headlines…</div>;
  }

  return (
    <div className="home-page">
      {lead && (
        <section className="lead-story">
          <div className="lead-story__grid">
            <Link to={articlePath(lead)} className="lead-story__image">
              <ArticleImage article={lead} />
            </Link>
            <div className="lead-story__content">
              <span className="section-label">Top Story</span>
              <h1><Link to={articlePath(lead)}>{lead.title}</Link></h1>
              <p>{lead.excerpt}</p>
              <div className="article-meta">
                <span>By {lead.author}</span>
                <span>{lead.readTime} min read</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {secondary.length > 0 && (
        <section className="secondary-grid">
          {secondary.map((article) => (
            <ArticleCard key={article.id} article={article} categories={categories} variant="compact" />
          ))}
        </section>
      )}

      <div className="content-with-sidebar">
        <section>
          <h2 className="section-heading">Latest Headlines</h2>
          <div className="article-list">
            {latest.map((article) => (
              <ArticleCard key={article.id} article={article} categories={categories} />
            ))}
          </div>
        </section>

        <aside className="sidebar">
          <div className="sidebar-box">
            <h3>In the Newsroom</h3>
            <p>
              Best News Media has published daily since 2009. Our editors review hundreds
              of stories each morning to bring you balanced coverage across every major beat.
            </p>
          </div>

          <div className="sidebar-box">
            <h3>Most Recent</h3>
            <ul className="sidebar-list">
              {sidebar.map((article) => (
                <li key={article.id}>
                  <Link to={articlePath(article)}>{article.title}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="sidebar-box sidebar-box--accent">
            <h3>Since 2009</h3>
            <p>
              Over 15 years of trusted reporting. Thank you for making
              bestnewsmedia.com part of your daily routine.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
