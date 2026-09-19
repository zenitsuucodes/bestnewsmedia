export default function StaticPage({ title, children }) {
  return (
    <div className="static-page">
      <header className="page-header">
        <h1>{title}</h1>
      </header>
      <div className="static-page__content">{children}</div>
    </div>
  );
}
