import { useEffect, useState } from "react";
import {
  adminDeleteLookbookImage,
  adminGetLookbookImages,
  adminGetPages,
  adminUpdatePage,
  adminUploadLookbookImage,
} from "../../api/adminClient";
import ConfirmDialog from "../components/ConfirmDialog";
import Toast from "../../components/Toast";
import MarkdownContent from "../../components/MarkdownContent";

const PAGE_TABS = [
  { slug: "about", label: "About" },
  { slug: "contact", label: "Contact" },
  { slug: "how-to-buy", label: "How to Buy" },
  { slug: "lookbook", label: "Lookbook intro" },
];

/**
 * CMS page editor with Markdown preview and lookbook image management.
 */
export default function PagesEditorPage() {
  const [activeSlug, setActiveSlug] = useState("about");
  const [pages, setPages] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [preview, setPreview] = useState(false);
  const [lookbookImages, setLookbookImages] = useState([]);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [error, setError] = useState("");
  const [pendingLookbookDelete, setPendingLookbookDelete] = useState(null);
  const [deletingLookbook, setDeletingLookbook] = useState(false);

  const loadPages = () => {
    adminGetPages()
      .then((response) => setPages(response.items))
      .catch((loadError) => setError(loadError.message || "Could not load pages"));
  };

  const loadLookbook = () => {
    adminGetLookbookImages()
      .then((response) => setLookbookImages(response.items))
      .catch((loadError) => setError(loadError.message || "Could not load lookbook images"));
  };

  useEffect(() => {
    loadPages();
    loadLookbook();
  }, []);

  useEffect(() => {
    const page = pages.find((item) => item.slug === activeSlug);
    setTitle(page?.title || "");
    setContent(page?.content || "");
    setPreview(false);
  }, [activeSlug, pages]);

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      await adminUpdatePage(activeSlug, { title, content });
      setToast("Saved");
      loadPages();
    } catch (saveError) {
      setError(saveError.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleLookbookUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    setError("");
    const formData = new FormData();
    formData.append("image", file);
    try {
      await adminUploadLookbookImage(formData);
      loadLookbook();
      event.target.value = "";
    } catch (uploadError) {
      setError(uploadError.message || "Upload failed");
    }
  };

  const confirmLookbookDelete = async () => {
    if (!pendingLookbookDelete) {
      return;
    }

    setDeletingLookbook(true);
    setError("");
    try {
      await adminDeleteLookbookImage(pendingLookbookDelete.id);
      setPendingLookbookDelete(null);
      loadLookbook();
    } catch (deleteError) {
      setError(deleteError.message || "Delete failed");
    } finally {
      setDeletingLookbook(false);
    }
  };

  return (
    <div>
      <h1 className="admin-page-title">Pages</h1>
      {error && <p className="admin-error">{error}</p>}

      <div className="admin-tabs">
        {PAGE_TABS.map((tab) => (
          <button
            key={tab.slug}
            type="button"
            className={activeSlug === tab.slug ? "active" : undefined}
            onClick={() => setActiveSlug(tab.slug)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="admin-form">
        <label>
          Title
          <input value={title} onChange={(event) => setTitle(event.target.value)} />
        </label>

        <div className="admin-page-toolbar">
          <button type="button" className="btn btn-secondary" onClick={() => setPreview((value) => !value)}>
            {preview ? "Edit" : "Preview"}
          </button>
          <button type="button" className="btn btn-primary" disabled={saving} onClick={handleSave}>
            {saving ? "Saving…" : "Save"}
          </button>
        </div>

        {preview ? (
          <div className="cms-content">
            <MarkdownContent content={content} />
          </div>
        ) : (
          <textarea
            className="admin-textarea"
            rows={16}
            value={content}
            onChange={(event) => setContent(event.target.value)}
          />
        )}
      </div>

      <section className="admin-lookbook-section">
        <h2 className="admin-section-title">Lookbook images</h2>
        <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleLookbookUpload} />
        <div className="admin-lookbook-grid">
          {lookbookImages.map((image) => (
            <div key={image.id} className="admin-lookbook-item">
              <img src={image.url} alt="" />
              <button
                type="button"
                className="btn btn-secondary btn-sm btn-danger"
                disabled={deletingLookbook && pendingLookbookDelete?.id === image.id}
                onClick={() => setPendingLookbookDelete({ id: image.id })}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </section>

      {toast && <Toast message={toast} onDismiss={() => setToast(null)} />}

      <ConfirmDialog
        open={Boolean(pendingLookbookDelete)}
        title="Delete lookbook image?"
        message="Remove this image from the lookbook? This can't be undone."
        loading={deletingLookbook}
        onCancel={() => {
          if (!deletingLookbook) {
            setPendingLookbookDelete(null);
          }
        }}
        onConfirm={confirmLookbookDelete}
      />
    </div>
  );
}
