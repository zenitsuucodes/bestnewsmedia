export default function LogoPlaceholder({ size = 'large' }) {
  return (
    <div className={`site-logo site-logo--${size}`} aria-label="Best News Media">
      <img src="/logo.png" alt="Best News Media" className="site-logo__image" />
    </div>
  );
}
