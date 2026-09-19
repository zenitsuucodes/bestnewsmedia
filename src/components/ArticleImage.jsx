import { useEffect, useRef, useState } from 'react';

export default function ArticleImage({ article, className = '' }) {
  const imgRef = useRef(null);
  const [src, setSrc] = useState(article.image);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setSrc(article.image);
    setFailed(false);
  }, [article.image]);

  useEffect(() => {
    if (imgRef.current?.complete && imgRef.current.naturalWidth > 0) {
      setFailed(false);
    }
  }, [src]);

  if (!src || failed) {
    return (
      <div className={`article-image-placeholder ${className}`} aria-hidden="true">
        <span>{article.category?.replace(/^\w/, (c) => c.toUpperCase())}</span>
      </div>
    );
  }

  return (
    <img
      ref={imgRef}
      src={src}
      alt=""
      className={className}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
    />
  );
}
