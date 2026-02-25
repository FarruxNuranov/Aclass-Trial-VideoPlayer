import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { authService } from '../../api/services/auth'
import AmeenLogo from '../../assets/Ameen.svg'
import s from './LoginPage.module.css'


function IconPhone() {
  return (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
}

function IconLock() {
  return (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  )
}

function IconEye({ open }) {
  return open ? (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61M2 2l20 20" />
    </svg>
  )
}

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  function validate() {
    const errs = {}
    if (!phone.trim()) errs.phone = 'Telefon raqam kiriting'
    if (!password) errs.password = 'Parol kiriting'
    else if (password.length < 6) errs.password = 'Kamida 6 ta belgi'
    return errs
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) {
      setErrors(errs)
      return
    }
    setErrors({})
    setLoading(true)

    try {
      const data = await authService.login(phone, password)
      login({
        name: data.first_name,
        studentId: data.student_id,
        token: data.token,
      })
      navigate('/courses')
    } catch (err) {
      setErrors({ general: err.message || 'Telefon yoki parol noto\'g\'ri' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={s.page}>
      <div className={s.card}>
        <div className={s.logo}>
          <img src={AmeenLogo} alt="Aclass.uz" className={s.logoImg} />
        </div>

        <h1 className={s.title}>Xush kelibsiz</h1>
        <p className={s.subtitle}>O'qishni davom ettirish uchun kiring</p>

        <form className={s.form} onSubmit={handleSubmit}>
          <div className={s.field}>
            <label className={s.label}>Telefon raqam</label>
            <div className={s.inputWrap}>
              <span className={s.inputIcon}><IconPhone /></span>
              <input
                className={`${s.input} ${errors.phone ? s.error : ''}`}
                type="tel"
                placeholder="+998901234567"
                value={phone}
                onChange={e => setPhone(e.target.value)}
              />
            </div>
            {errors.phone && <span className={s.errorMsg}>{errors.phone}</span>}
          </div>

          <div className={s.field}>
            <label className={s.label}>Parol</label>
            <div className={s.inputWrap}>
              <span className={s.inputIcon}><IconLock /></span>
              <input
                className={`${s.input} ${errors.password ? s.error : ''}`}
                type={showPass ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <button
                type="button"
                className={s.eyeBtn}
                onClick={() => setShowPass(v => !v)}
              >
                <IconEye open={showPass} />
              </button>
            </div>
            {errors.password && <span className={s.errorMsg}>{errors.password}</span>}
          </div>

          {/* <span className={s.forgot}>Parolni unutdingizmi?</span> */}

          {errors.general && (
            <span className={s.errorMsg} style={{ textAlign: 'center' }}>
              {errors.general}
            </span>
          )}

          <button className={s.submitBtn} type="submit" disabled={loading}>
            {loading ? 'Kirmoqda...' : 'Kirish'}
          </button>
        </form>
      </div>
    </div>
  )
}
