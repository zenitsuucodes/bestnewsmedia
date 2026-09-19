import { Link } from 'react-router-dom';
import LogoPlaceholder from './LogoPlaceholder';

export default function Footer({ categories = [] }) {
  return (
    <footer className="site-footer">
      <div className="container site-footer__grid">
        <div>
          <LogoPlaceholder size="small" />
          <p className="site-footer__about">
            Best News Media has delivered independent journalism across technology,
            world affairs, science, health, and culture since 2009. Our reporters
            work around the clock to bring you clear, reliable coverage.
          </p>
        </div>

        <div>
          <h4>Sections</h4>
          <ul>
            {categories.slice(0, 6).map((cat) => (
              <li key={cat.id}>
                <Link to={`/category/${cat.slug}`}>{cat.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4>Company</h4>
          <ul>
            <li><Link to="/about">About Best News Media</Link></li>
            <li><Link to="/contact">Contact the Newsroom</Link></li>
            <li><Link to="/archives">Story Archives</Link></li>
            <li><Link to="/privacy">Privacy Policy</Link></li>
          </ul>
        </div>

        <div>
          <h4>Connect</h4>
          <ul>
            <li><a href="mailto:newsroom@bestnewsmedia.com">newsroom@bestnewsmedia.com</a></li>
            <li><a href="mailto:tips@bestnewsmedia.com">Send a News Tip</a></li>
          </ul>
        </div>
      </div>

      <div className="site-footer__bottom">
        <div className="container">
          <p>© 2009–{new Date().getFullYear()} Best News Media. All rights reserved.</p>
          <p className="site-footer__legal">
            bestnewsmedia.com · Independent journalism for a connected world
          </p>
        </div>
      </div>
    </footer>
  );
}
