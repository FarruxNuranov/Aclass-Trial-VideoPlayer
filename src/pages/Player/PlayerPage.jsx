import { useState, useEffect, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { enrollmentsService } from '../../api/services/enrollments'
import ModuleList from '../../components/ModuleList/ModuleList'
import VideoPlayer from '../../components/VideoPlayer/VideoPlayer'
import Quiz from '../../components/Quiz/Quiz'
import AmeenLogo from '../../assets/Ameen.svg'
import s from './PlayerPage.module.css'

// Transform API module/lesson → component format
function transformModules(apiModules) {
  return (apiModules ?? []).map(mod => ({
    id: mod._id,
    name: mod.title,
    episodes: (mod.lessons ?? []).map(lesson => ({
      id: lesson._id,
      title: lesson.title,
      description: lesson.description ?? '',
      videoUrl: lesson.video_url ?? '',
      done: lesson.is_completed ?? false,
      duration: '',
      quiz: [],
    })),
  }))
}

function flatEpisodes(modules) {
  return modules.flatMap(m =>
    m.episodes.map(ep => ({ ...ep, moduleName: m.name }))
  )
}

function IconLogout() {
  return (
    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
    </svg>
  )
}

function IconBack() {
  return (
    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M19 12H5M12 5l-7 7 7 7" />
    </svg>
  )
}

function IconPlayOutline() {
  return (
    <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
      <path d="M10 8l6 4-6 4V8z" fill="currentColor" stroke="none" />
    </svg>
  )
}

function IconVideo() {
  return (
    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="m22 8-6 4 6 4V8z" /><rect x="2" y="6" width="14" height="12" rx="2" />
    </svg>
  )
}

function IconQuiz() {
  return (
    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  )
}

export default function PlayerPage() {
  const { enrollmentId } = useParams()
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [modules, setModules] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [activeId, setActiveId] = useState(null)
  const [activeTab, setActiveTab] = useState('dars')
  const [doneSet, setDoneSet] = useState(new Set())

  useEffect(() => {
    setLoading(true)
    enrollmentsService.getEnrollmentById(enrollmentId)
      .then(data => {
        const mods = transformModules(data.modules)
        setModules(mods)
// pre-populate done set from API
        const done = new Set()
        mods.forEach(m => m.episodes.forEach(ep => { if (ep.done) done.add(ep.id) }))
        setDoneSet(done)
        // auto-select first episode
        if (mods.length > 0 && mods[0].episodes.length > 0) {
          setActiveId(mods[0].episodes[0].id)
        }
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [enrollmentId])

  const allEpisodes = useMemo(() => flatEpisodes(modules), [modules])

  const modulesWithDone = useMemo(() =>
    modules.map(m => ({
      ...m,
      episodes: m.episodes.map(ep => ({ ...ep, done: doneSet.has(ep.id) })),
    })),
  [modules, doneSet])

  const activeEpisode = useMemo(() => {
    const ep = allEpisodes.find(ep => ep.id === activeId) ?? null
    if (!ep) return null
    return { ...ep, done: doneSet.has(ep.id) }
  }, [allEpisodes, activeId, doneSet])

  const activeIndex = activeEpisode ? allEpisodes.findIndex(ep => ep.id === activeId) : -1
  const hasPrev = activeIndex > 0
  const hasNext = activeIndex >= 0 && activeIndex < allEpisodes.length - 1

  function handleSelect(ep) {
    setActiveId(ep.id)
    setActiveTab('dars')
  }

  function handlePrev() {
    if (hasPrev) { setActiveId(allEpisodes[activeIndex - 1].id); setActiveTab('dars') }
  }

  function handleNext() {
    if (hasNext) { setActiveId(allEpisodes[activeIndex + 1].id); setActiveTab('dars') }
  }

  function handleQuizPass() {
    if (activeId) setDoneSet(prev => new Set([...prev, activeId]))
  }

  function handleLogout() {
    logout()
    navigate('/login')
  }

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : 'U'

  if (loading) {
    return (
      <div className={s.loadingScreen}>
        <div className={s.spinner} />
      </div>
    )
  }

  if (error) {
    return (
      <div className={s.loadingScreen}>
        <div className={s.errorMsg}>{error}</div>
        <button className={s.backLink} onClick={() => navigate('/courses')}>
          <IconBack /> Kurslarga qaytish
        </button>
      </div>
    )
  }

  return (
    <div className={s.layout}>
      {/* Left sidebar */}
      <div className={s.sidebar}>
        <ModuleList
          modules={modulesWithDone}
          activeEpisodeId={activeId}
          onSelect={handleSelect}
        />
      </div>

      {/* Right — player area */}
      <div className={s.main}>
        <nav className={s.navbar}>
          <div className={s.navLeft}>
            <button className={s.backBtn} onClick={() => navigate('/courses')}>
              <IconBack />
            </button>
            <div className={s.navLogo}>
              <img src={AmeenLogo} alt="Aclass.uz" className={s.navLogoImg} />
              <h2
                style={ {
            marginLeft: '8px',
            fontSize: '25px',
            color: '#333',
          }}>Aclass.uz</h2>
            </div>
          </div>
          <div className={s.navRight}>
            <div className={s.navUser}>
              <div className={s.navAvatar}>{initials}</div>
              <span>{user?.name}</span>
            </div>
            <button className={s.logoutBtn} onClick={handleLogout}>
              <IconLogout /> Chiqish
            </button>
          </div>
        </nav>

        <div className={s.content}>
          {activeEpisode ? (
            <>
              <div className={s.tabs}>
                <button
                  className={`${s.tab} ${activeTab === 'dars' ? s.tabActive : ''}`}
                  onClick={() => setActiveTab('dars')}
                >
                  <IconVideo /> Dars
                </button>
                <button
                  className={`${s.tab} ${activeTab === 'test' ? s.tabActive : ''}`}
                  onClick={() => setActiveTab('test')}
                >
                  <IconQuiz />
                  Test
                  {activeEpisode.done && <span className={s.tabDoneDot} />}
                </button>
              </div>

              {activeTab === 'dars' ? (
                <VideoPlayer
                  episode={activeEpisode}
                  onPrev={handlePrev}
                  onNext={handleNext}
                  hasPrev={hasPrev}
                  hasNext={hasNext}
                />
              ) : (
                <Quiz
                  key={activeId}
                  episode={activeEpisode}
                  onPass={handleQuizPass}
                />
              )}
            </>
          ) : (
            <div className={s.empty}>
              <div className={s.emptyIcon}><IconPlayOutline /></div>
              <div className={s.emptyTitle}>Darsni tanlang</div>
              <p className={s.emptyText}>
                Chap tomondagi modulni oching va o'qishni boshlash uchun darsni tanlang
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
