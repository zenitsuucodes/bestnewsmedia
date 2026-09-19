import { Link, NavLink } from 'react-router-dom';
import LogoPlaceholder from './LogoPlaceholder';

export default function Header({ categories = [] }) {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <header className="site-header">
      <div className="site-header__utility">
        <div className="container site-header__utility-inner">
          <span>{today}</span>
          <div className="site-header__utility-links">
            <Link to="/about">About Us</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/archives">Archives</Link>
          </div>
        </div>
      </div>

      <div className="container site-header__masthead">
        <Link to="/" className="site-header__logo-link">
          <LogoPlaceholder />
        </Link>
      </div>

      <nav className="site-nav">
        <div className="container site-nav__inner">
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
            Home
          </NavLink>
          {categories.map((cat) => (
            <NavLink
              key={cat.id}
              to={`/category/${cat.slug}`}
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              {cat.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </header>
  );
}
