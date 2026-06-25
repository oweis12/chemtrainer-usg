import { ImageSquare } from "@phosphor-icons/react";
import { useState } from "react";
import { ImageLightbox } from "./content/ImageLightbox";

interface ImageSlotProps {
  src?: string;
  alt: string;
  caption?: string;
  fallback?: React.ReactNode;
  className?: string;
}

export function ImageSlot({ src, alt, caption, fallback, className = "" }: ImageSlotProps) {
  const [missing, setMissing] = useState(!src);
  const [open, setOpen] = useState(false);
  const canOpen = Boolean(src) && !missing;
  return <figure className={`image-slot ${className}`}>
    <div className={`image-slot-media ${canOpen ? "figure-zoomable" : ""}`} onClick={() => canOpen && setOpen(true)} role={canOpen ? "button" : undefined} tabIndex={canOpen ? 0 : undefined} onKeyDown={(event) => { if (canOpen && (event.key === "Enter" || event.key === " ")) { event.preventDefault(); setOpen(true); } }}>
      {!missing && src ? <img src={src} alt={alt} onError={() => setMissing(true)} /> : fallback ?? <div className="image-slot-placeholder" role="img" aria-label={alt}><ImageSquare size={30} weight="duotone" /><span>Illustratie volgt</span></div>}
      {canOpen && <span className="figure-hover-overlay">Klik om te vergroten</span>}
    </div>
    {caption && <figcaption>{caption}</figcaption>}
    {canOpen && src && <ImageLightbox open={open} src={src} alt={alt} caption={caption} onClose={() => setOpen(false)} />}
  </figure>;
}
