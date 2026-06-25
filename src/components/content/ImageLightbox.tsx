import { useEffect } from "react";
import { X } from "@phosphor-icons/react";

interface ImageLightboxProps {
  open: boolean;
  src: string;
  alt: string;
  title?: string;
  caption?: string;
  onClose: () => void;
}

export function ImageLightbox({ open, src, alt, title, caption, onClose }: ImageLightboxProps) {
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose, open]);

  if (!open) return null;

  return <div className="image-lightbox-backdrop" role="dialog" aria-modal="true" aria-label={title ?? alt} onClick={onClose}>
    <div className="image-lightbox-dialog" onClick={(event) => event.stopPropagation()}>
      <button className="image-lightbox-close" onClick={onClose} aria-label="Sluiten"><X size={18} weight="bold" /></button>
      {title && <h3>{title}</h3>}
      <img src={src} alt={alt} />
      {caption && <p>{caption}</p>}
    </div>
  </div>;
}
