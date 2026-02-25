import { useState } from 'react'
import s from './Quiz.module.css'

const PASS_THRESHOLD = 0.7 // 70%

function IconCheck() {
  return (
    <svg width="14" height="14" fill="none" stroke="#22c55e" strokeWidth="2.5" viewBox="0 0 24 24">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}

function IconX() {
  return (
    <svg width="14" height="14" fill="none" stroke="#f87171" strokeWidth="2.5" viewBox="0 0 24 24">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  )
}

function IconTrophy() {
  return (
    <svg fill="#22c55e" viewBox="0 0 24 24">
      <path d="M19 5h-2V3H7v2H5C3.9 5 3 5.9 3 7v1c0 2.55 1.92 4.63 4.39 4.94A5.01 5.01 0 0 0 11 15.9V18H8v2h8v-2h-3v-2.1a5.01 5.01 0 0 0 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z" />
    </svg>
  )
}

function IconRepeat() {
  return (
    <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M17 2l4 4-4 4M3 11V9a4 4 0 0 1 4-4h14M7 22l-4-4 4-4M21 13v2a4 4 0 0 1-4 4H3" />
    </svg>
  )
}

export default function Quiz({ episode, onPass }) {
  const quiz = episode?.quiz
  const [answers, setAnswers] = useState({})   // { qIndex: optionIndex }
  const [submitted, setSubmitted] = useState(false)
  const [result, setResult] = useState(null)   // { score, passed, correct }

  if (!quiz || quiz.length === 0) {
    return (
      <div className={s.wrap}>
        <div className={s.header}>
          <div className={s.headerLeft}>
            <div className={s.title}>Test mavjud emas</div>
            <div className={s.subtitle}>Bu dars uchun test hali tayyorlanmagan</div>
          </div>
        </div>
      </div>
    )
  }

  const answeredCount = Object.keys(answers).length
  const allAnswered = answeredCount === quiz.length

  function select(qIdx, optIdx) {
    if (submitted) return
    setAnswers(prev => ({ ...prev, [qIdx]: optIdx }))
  }

  function handleSubmit() {
    if (!allAnswered) return
    let correct = 0
    quiz.forEach((q, i) => {
      if (answers[i] === q.correct) correct++
    })
    const score = correct / quiz.length
    const passed = score >= PASS_THRESHOLD
    setResult({ score, passed, correct, total: quiz.length })
    setSubmitted(true)
    if (passed) onPass?.()
  }

  function handleRetry() {
    setAnswers({})
    setSubmitted(false)
    setResult(null)
  }

  const progressPct = (answeredCount / quiz.length) * 100

  return (
    <div className={s.wrap}>
      {/* Header */}
      <div className={s.header}>
        <div className={s.headerLeft}>
          <div className={s.title}>Dars testi</div>
          <div className={s.subtitle}>{quiz.length} ta savol · O'tish uchun 70% to'g\'ri javob kerak</div>
        </div>
        {result && (
          <div className={`${s.scoreBadge} ${result.passed ? s.scorePassed : s.scoreFailed}`}>
            {result.passed ? <IconCheck /> : <IconX />}
            {result.correct}/{result.total} to'g\'ri
          </div>
        )}
      </div>

      {/* Progress */}
      {!submitted && (
        <div className={s.quizProgress}>
          <div className={s.quizProgressBar}>
            <div className={s.quizProgressFill} style={{ width: `${progressPct}%` }} />
          </div>
          <span className={s.quizProgressText}>{answeredCount}/{quiz.length}</span>
        </div>
      )}

      {/* Result banner */}
      {result && (
        <div className={`${s.resultBanner} ${result.passed ? s.resultBannerPass : s.resultBannerFail}`}>
          <div className={`${s.resultIcon} ${result.passed ? s.resultIconPass : s.resultIconFail}`}>
            {result.passed ? <IconTrophy /> : <IconX />}
          </div>
          <div className={s.resultText}>
            <div className={`${s.resultTitle} ${result.passed ? s.resultTitlePass : s.resultTitleFail}`}>
              {result.passed ? 'Tabriklaymiz! Test muvaffaqiyatli o\'tildi' : 'Testdan o\'ta olmadingiz'}
            </div>
            <div className={s.resultDesc}>
              {result.passed
                ? 'Dars bajarilgan deb belgilandi. Keyingi darsga o\'tishingiz mumkin.'
                : `${result.correct} ta to'g\'ri javob. Kamida ${Math.ceil(quiz.length * PASS_THRESHOLD)} ta kerak edi. Qaytadan urinib ko'ring.`}
            </div>
          </div>
          <div className={`${s.resultScore} ${result.passed ? s.resultScorePass : s.resultScoreFail}`}>
            {Math.round(result.score * 100)}%
          </div>
        </div>
      )}

      {/* Questions */}
      <div className={s.questions}>
        {quiz.map((q, qi) => {
          const chosen = answers[qi] ?? null
          const isCorrect = submitted && chosen === q.correct
          const isIncorrect = submitted && chosen !== null && chosen !== q.correct

          return (
            <div
              key={qi}
              className={`${s.question} ${
                submitted
                  ? isCorrect ? s.correct : isIncorrect ? s.incorrect : s.answered
                  : ''
              }`}
            >
              <div className={s.questionHeader}>
                <div className={`${s.questionNum} ${
                  submitted
                    ? isCorrect ? s.numCorrect : s.numIncorrect
                    : ''
                }`}>
                  {submitted
                    ? isCorrect ? '✓' : '✗'
                    : qi + 1}
                </div>
                <div className={s.questionText}>{q.question}</div>
              </div>

              <div className={s.options}>
                {q.options.map((opt, oi) => {
                  const isChosen = chosen === oi
                  const isRightAnswer = submitted && oi === q.correct
                  const isWrongChosen = submitted && isChosen && oi !== q.correct

                  return (
                    <div
                      key={oi}
                      className={`${s.option} ${
                        isChosen && !submitted ? s.optionSelected : ''
                      } ${isRightAnswer ? s.optionCorrect : ''} ${
                        isWrongChosen ? s.optionWrong : ''
                      } ${submitted ? s.optionDisabled : ''}`}
                      onClick={() => select(qi, oi)}
                    >
                      <div className={s.optionCircle}>
                        {(isChosen || isRightAnswer) && <div className={s.optionDot} />}
                      </div>
                      <span className={s.optionLabel}>{opt}</span>
                    </div>
                  )
                })}

                {/* Show correct answer if user got it wrong */}
                {submitted && isIncorrect && (
                  <div className={s.correctHint}>
                    <IconCheck />
                    To'g'ri javob: {q.options[q.correct]}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Actions */}
      <div className={s.actions}>
        {!submitted ? (
          <>
            <button
              className={s.submitBtn}
              onClick={handleSubmit}
              disabled={!allAnswered}
            >
              Javoblarni tekshirish
            </button>
            {!allAnswered && (
              <span className={s.unansweredNote}>
                {quiz.length - answeredCount} ta savolga javob berilmadi
              </span>
            )}
          </>
        ) : (
          <>
            {!result?.passed && (
              <button className={s.retryBtn} onClick={handleRetry}>
                <IconRepeat /> Qaytadan urinish
              </button>
            )}
          </>
        )}
      </div>
    </div>
  )
}
