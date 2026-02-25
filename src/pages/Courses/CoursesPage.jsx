import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { enrollmentsService } from '../../api/services/enrollments'
import AmeenLogo from '../../assets/Ameen.svg'
import s from './CoursesPage.module.css'

const IMG_BASE = import.meta.env.VITE_IMG_BASE_URL

function IconLogout() {
  return (
    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
    </svg>
  )
}

function IconBook() {
  return (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  )
}

function IconPlay() {
  return (
    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z" />
    </svg>
  )
}

function IconUser() {
  return (
    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  )
}

function IconLessons() {
  return (
    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="m22 8-6 4 6 4V8z" /><rect x="2" y="6" width="14" height="12" rx="2" />
    </svg>
  )
}

export default function CoursesPage() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    enrollmentsService.getMyCourses()
      .then(res => setCourses((res?.data ?? []).filter(e => e.course)))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : 'U'

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div className={s.page}>
      {/* Navbar */}
      <nav className={s.navbar}>
        <div className={s.navLogo}>
          <img src={AmeenLogo} alt="Aclass.uz" className={s.navLogoImg} />
          <h2
          style={ {
            marginLeft: '8px',
            fontSize: '25px',
            color: '#333',
          }}
          >Aclass.uz</h2>
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

      {/* Content */}
      <div className={s.content}>
        <div className={s.pageHeader}>
          <h1 className={s.pageTitle}>Mening kurslarim</h1>
          <p className={s.pageSubtitle}>Ro'yxatdan o'tgan kurslaringizni davom ettiring</p>
        </div>

        {loading && (
          <div className={s.center}>
            <div className={s.spinner} />
          </div>
        )}

        {error && (
          <div className={s.errorBanner}>{error}</div>
        )}

        {!loading && !error && courses.length === 0 && (
          <div className={s.empty}>
            <div className={s.emptyIcon}><IconBook /></div>
            <div className={s.emptyTitle}>Kurslar topilmadi</div>
            <p className={s.emptyText}>Hozirda birorta kursga yozilmagansiz</p>
          </div>
        )}

        {!loading && courses.length > 0 && (
          <div className={s.grid}>
            {courses.map(enrollment => {
              const course = enrollment.course
              const teacher = enrollment.teacher
              const progress = Math.round(enrollment.progress ?? 0)
              const imgUrl = course.image_url ? IMG_BASE + course.image_url : null

              return (
                <div
                  key={enrollment._id}
                  className={s.card}
                  onClick={() => navigate(`/player/${enrollment._id}`)}
                >
                  <div className={s.cardThumb}>
                    {imgUrl
                      ? <img src={imgUrl} alt={course.title} className={s.cardImg} />
                      : <div className={s.cardThumbPlaceholder}><IconBook /></div>
                    }
                    <div className={s.cardBadge}>{course.type === 'free' ? 'Bepul' : 'Premium'}</div>
                  </div>

                  <div className={s.cardBody}>
                    <div className={s.cardTitle}>{course.title}</div>

                    {teacher && (
                      <div className={s.cardMeta}>
                        <IconUser />
                        {teacher.first_name} {teacher.last_name}
                      </div>
                    )}

                    <div className={s.cardMeta}>
                      <IconLessons />
                      {course.lessons_quantity} ta dars · {course.duration} oy
                    </div>

                    {/* Progress */}
                    <div className={s.progressWrap}>
                      <div className={s.progressBar}>
                        <div className={s.progressFill} style={{ width: `${progress}%` }} />
                      </div>
                      <span className={s.progressText}>{progress}%</span>
                    </div>
                  </div>

                  <div className={s.cardFooter}>
                    <button className={s.startBtn}>
                      <IconPlay />
                      {progress > 0 ? 'Davom etish' : 'Boshlash'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
