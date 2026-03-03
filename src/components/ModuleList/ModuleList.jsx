import { useState, useMemo } from 'react'
import s from './ModuleList.module.css'

function IconChevron() {
  return (
    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

function IconCheck() {
  return (
    <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}

function IconPlay() {
  return (
    <svg width="8" height="8" fill="currentColor" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z" />
    </svg>
  )
}

export default function ModuleList({ modules, activeEpisodeId, onSelect }) {
  const [openModules, setOpenModules] = useState(() => {
    const initial = {}
    modules.forEach(m => { initial[m.id] = true })
    return initial
  })
  function toggleModule(id) {
    setOpenModules(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const { filtered, totalEpisodes, doneEpisodes } = useMemo(() => {
    let total = 0
    let done = 0
    const filtered = modules.map(m => {
      const episodes = m.episodes.filter(ep => {
        total++
        if (ep.done) done++
        return true
      })
      return { ...m, episodes }
    })
    return { filtered, totalEpisodes: total, doneEpisodes: done }
  }, [modules])

  const progressPct = totalEpisodes ? Math.round((doneEpisodes / totalEpisodes) * 100) : 0

  return (
    <aside className={s.sidebar}>
      <div className={s.header}>
        <div className={s.headerTitle}>Kurs dasturi</div>
      </div>


      <div className={s.list}>
        {filtered.map((module, mi) => {
          const isOpen = !!openModules[module.id]
          const hasActive = module.episodes.some(ep => ep.id === activeEpisodeId)
          const doneCnt = module.episodes.filter(ep => ep.done).length

          return (
            <div key={module.id} className={`${s.module} ${hasActive ? s.hasActive : ''}`}>
              <div className={s.moduleHeader} onClick={() => toggleModule(module.id)}>
                <div className={s.moduleNum}>{mi + 1}</div>
                <div className={s.moduleInfo}>
                  <div className={s.moduleName}>{module.name}</div>
                  <div className={s.moduleMeta}>
                    {doneCnt}/{module.episodes.length} dars
                  </div>
                </div>
                <span className={`${s.chevron} ${isOpen ? s.open : ''}`}>
                  <IconChevron />
                </span>
              </div>

              <div className={s.episodes} style={{ maxHeight: isOpen ? '1000px' : '0' }}>
                {module.episodes.map(ep => {
                  const isActive = ep.id === activeEpisodeId
                  return (
                    <div
                      key={ep.id}
                      className={`${s.episode} ${isActive ? s.active : ''}`}
                      onClick={() => onSelect(ep)}
                    >
                      <div className={`${s.episodeStatus} ${
                        ep.done ? s.statusDone :
                        isActive ? s.statusActive :
                        s.statusPending
                      }`}>
                        {ep.done ? <IconCheck /> : isActive ? <IconPlay /> : null}
                      </div>
                      <div className={s.episodeInfo}>
                        <div className={s.episodeName}>{ep.title}</div>
                      </div>
                      {ep.duration && (
                        <span className={s.episodeDur}>{ep.duration}</span>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </aside>
  )
}
