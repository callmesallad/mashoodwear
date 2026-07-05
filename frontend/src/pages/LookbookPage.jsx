import { useEffect, useState } from "react";
import { getPublicLookbook } from "../api/adminClient";
import StateMessage from "../components/StateMessage";
import MarkdownContent from "../components/MarkdownContent";
import ProductImage from "../components/ProductImage";

/**
 * Public lookbook with intro Markdown and image grid.
 */
export default function LookbookPage() {
  const [lookbook, setLookbook] = useState(null);
  const [error, setError] = useState(false);

  const load = () => {
    getPublicLookbook()
      .then((response) => setLookbook(response))
      .catch(() => setError(true));
  };

  useEffect(() => {
    load();
  }, []);

  if (error) {
    return (
      <div className="container cms-page">
        <StateMessage variant="error" message="Could not load lookbook" actionLabel="Try again" onAction={load} />
      </div>
    );
  }

  if (!lookbook) {
    return <div className="container cms-page"><p>Loading…</p></div>;
  }

  return (
    <div className="container cms-page">
      <h1 className="page-title">{lookbook.title}</h1>
      {lookbook.content && (
        <div className="cms-content">
          <MarkdownContent content={lookbook.content} />
        </div>
      )}
      <div className="lookbook-grid">
        {lookbook.images.map((image) => (
          <figure key={image.id} className="lookbook-item">
            <ProductImage src={image.url} alt={image.caption || ""} className="lookbook-item-img" />
            {image.caption && <figcaption>{image.caption}</figcaption>}
          </figure>
        ))}
      </div>
    </div>
  );
}
