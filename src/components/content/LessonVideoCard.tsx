import { ArrowSquareOut, PlayCircle } from "@phosphor-icons/react";
import type { LessonVideo } from "../../data/lessonVideoRegistry";

import { usePrivacy } from "../PrivacyConsent";

export function LessonVideoCard({ video, scopeNote }: { video: LessonVideo; scopeNote?: string }) {
  const { media, openSettings } = usePrivacy();
  const linkHref = video.source === "exact-wat-je-zoekt" ? video.exactUrl : video.youtubeUrl ?? video.exactUrl;
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
          <p className="lesson-video-lead">Korte video ter aanvulling.</p>
          <h3>{video.title}</h3>
          <p>{video.summary}</p>
          <p className="lesson-video-match"><strong>Waarom deze?</strong> {video.whyThisVideo}</p>
          {scopeNote && <p className="lesson-video-scope">{scopeNote}</p>}
          <span>{video.providerName}</span>
        </div>
      </div>

      {video.youtubeId && media && (
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

      {video.youtubeId && !media && <div className="video-consent"><p>Deze video wordt pas geladen als je externe video’s toestaat.</p><button className="secondary-button" onClick={openSettings}>Video-instellingen</button></div>}
      <a className="lesson-video-link" href={linkHref} target="_blank" rel="noreferrer">
        {linkLabel} <ArrowSquareOut size={16} />
      </a>
    </aside>
  );
}
