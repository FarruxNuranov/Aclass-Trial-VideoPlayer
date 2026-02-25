import s from './VideoPlayer.module.css'

function IconPrev() {
  return (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M19 20L9 12l10-8v16z" /><line x1="5" y1="4" x2="5" y2="20" />
    </svg>
  )
}

function IconNext() {
  return (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M5 4l10 8-10 8V4z" /><line x1="19" y1="4" x2="19" y2="20" />
    </svg>
  )
}

function IconVideoEmpty() {
  return (
    <svg width="36" height="36" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path d="m22 8-6 4 6 4V8z" /><rect x="2" y="6" width="14" height="12" rx="2" />
    </svg>
  )
}

export default function VideoPlayer({ episode, onPrev, onNext, hasPrev, hasNext }) {
  if (!episode) {
    return (
      <div className={s.wrapper}>
        <div className={s.playerBox}>
          <div className={s.placeholder}>
            <div className={s.placeholderIcon}><IconVideoEmpty /></div>
            <span className={s.placeholderText}>Ko'rish uchun darsni tanlang</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={s.wrapper}>
      {/* Vimeo player */}
      <div className={s.playerBox}>
        {episode.videoUrl ? (
          <iframe
            key={episode.videoUrl}
            src={`https://player.vimeo.com/video/${episode.videoUrl}?title=0&byline=0&portrait=0&color=1e3a8a`}
            className={s.vimeoFrame}
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            title={episode.title}
          />
        ) : (
          <div className={s.placeholder}>
            <div className={s.placeholderIcon}><IconVideoEmpty /></div>
            <span className={s.placeholderText}>Video mavjud emas</span>
          </div>
        )}
      </div>

      {/* Meta */}
      <div className={s.meta}>
        <div className={s.episodeTitle}>{episode.title}</div>
        <div className={s.episodeMeta}>
          {episode.moduleName && (
            <span className={s.badgeModule}>{episode.moduleName}</span>
          )}
        </div>
        {episode.description && (
          <div className={s.description}>{episode.description}</div>
        )}
      </div>

      {/* Prev / Next */}
      <div className={s.navButtons}>
        <button className={s.navBtn} onClick={onPrev} disabled={!hasPrev}>
          <IconPrev /> Oldingi dars
        </button>
        <button className={s.navBtn} onClick={onNext} disabled={!hasNext}>
          Keyingi dars <IconNext />
        </button>
      </div>
    </div>
  )
}
