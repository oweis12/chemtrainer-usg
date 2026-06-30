import { ArrowSquareOut, PlayCircle } from "@phosphor-icons/react";
import type { LessonVideo } from "../../data/lessonVideoRegistry";

export function LessonVideoCard({ video }: { video: LessonVideo }) {
  const linkHref = video.youtubeUrl ?? video.exactUrl;
  const linkLabel = video.source === "youtube"
    ? "Open op YouTube"
    : video.source === "exact-wat-je-zoekt"
      ? "Open bij Exact wat je zoekt"
      : "Open bronvideo";

  return (
    <aside className="lesson-video-card" aria-label={`Uitlegvideo: ${video.title}`}>
      <div className="lesson-video-copy">
        <div className="lesson-video-icon"><PlayCircle size={24} weight="duotone" /></div>
        <div>
          <p className="lesson-video-lead">Liever een korte uitlegvideo? Deze video sluit aan bij dit onderwerp.</p>
          <h3>{video.title}</h3>
          <p>{video.summary}</p>
          <p className="lesson-video-match"><strong>Waarom deze?</strong> {video.whyThisVideo}</p>
          <span>{video.providerName}</span>
        </div>
      </div>

      {video.youtubeId && (
        <div className="lesson-video-frame">
          <iframe
            title={video.title}
            src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}`}
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      )}

      <a className="lesson-video-link" href={linkHref} target="_blank" rel="noreferrer">
        {linkLabel} <ArrowSquareOut size={16} />
      </a>
    </aside>
  );
}
