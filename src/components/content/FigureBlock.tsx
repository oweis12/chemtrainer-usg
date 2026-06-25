import { ImageSquare } from "@phosphor-icons/react";
import { useState } from "react";
import type { VisualAssetRecord } from "../../types";
import { ImageLightbox } from "./ImageLightbox";

interface FigureBlockProps {
  src?: string;
  alt: string;
  title: string;
  caption?: string;
  figureNumber?: string;
  status?: VisualAssetRecord["status"] | "done";
  fallback?: React.ReactNode;
  className?: string;
}

export function FigureBlock({ src, alt, title, caption, figureNumber, status, fallback, className = "" }: FigureBlockProps) {
  const [missing, setMissing] = useState(!src);
  const [open, setOpen] = useState(false);
  const canTryImage = Boolean(src) && !missing && (status === "done" || status === undefined);
  const label = figureNumber ? `Figuur ${figureNumber}. ${title}` : title;
  const zoomable = Boolean(canTryImage);

  return (
    <figure className={`figure-block ${className} ${canTryImage || fallback ? "figure-ready" : "figure-placeholder"}`}>
      <div className={`figure-media ${zoomable ? "figure-zoomable" : ""}`} onClick={() => zoomable && setOpen(true)} role={zoomable ? "button" : undefined} tabIndex={zoomable ? 0 : undefined} onKeyDown={(event) => { if (zoomable && (event.key === "Enter" || event.key === " ")) { event.preventDefault(); setOpen(true); } }}>
        {canTryImage && src ? (
          <img src={src} alt={alt} onError={() => setMissing(true)} />
        ) : fallback ? (
          fallback
        ) : (
          <div className="figure-placeholder-box" role="img" aria-label={alt}>
            <ImageSquare size={30} weight="duotone" />
            <span>Illustratie volgt</span>
          </div>
        )}
        {zoomable && <span className="figure-hover-overlay">Klik om te vergroten</span>}
      </div>
      <figcaption>
        <strong>{label}</strong>
        {caption && <span>{caption}</span>}
      </figcaption>
      {zoomable && src && <ImageLightbox open={open} src={src} alt={alt} title={label} caption={caption} onClose={() => setOpen(false)} />}
    </figure>
  );
}
