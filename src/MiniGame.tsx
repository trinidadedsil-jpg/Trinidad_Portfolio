import { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import './MiniGame.css'

type Mode = 'grammar' | 'math'

type GrammarQ = {
  prompt: string
  choices: string[]
  correct: number
}

const GRAMMAR_BANK: GrammarQ[] = [
  {
    prompt: 'Which sentence uses “they’re / their / there” correctly?',
    choices: [
      'They’re presenting their capstone over there.',
      'Their presenting they’re capstone over they’re.',
      'There presenting there capstone over their.',
      'Theyre presenting there capstone over their.',
    ],
    correct: 0,
  },
  {
    prompt: 'Pick the grammatically correct line.',
    choices: [
      'You’re going to love what your team shipped.',
      'Your going to love what you’re team shipped.',
      'Youre going to love what your team shipped.',
      'You’re going to love what youre team shipped.',
    ],
    correct: 0,
  },
  {
    prompt: 'Choose the correct use of “it’s” vs “its”.',
    choices: [
      'The API has its own docs; it’s documented clearly.',
      'The API has it’s own docs; its documented clearly.',
      'The API has its own docs; its documented clearly.',
      'The API has it’s own docs; it’s documented clearly.',
    ],
    correct: 0,
  },
  {
    prompt: 'Which sentence is written correctly?',
    choices: [
      'We performed maintenance on the server.',
      'We perfomed maintenance on the server.',
      'We performed maintinance on the server.',
      'We preformed maintenance on the server.',
    ],
    correct: 0,
  },
  {
    prompt: 'Which comparison uses “than” correctly?',
    choices: [
      'Vue feels lighter than React for this prototype.',
      'Vue feels lighter then React for this prototype.',
      'Vue feels lighter than react for this prototype.',
      'Vue feels more lighter than React for this prototype.',
    ],
    correct: 0,
  },
]

function shuffleIndices(length: number): number[] {
  const arr = Array.from({ length }, (_, i) => i)
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

function pickGrammarRound(): GrammarQ[] {
  const ix = shuffleIndices(GRAMMAR_BANK.length).slice(0, 5)
  return ix.map((i) => GRAMMAR_BANK[i])
}

type MathQ = { prompt: string; choices: string[]; correct: number }

function buildMathRound(): MathQ[] {
  const out: MathQ[] = []
  for (let n = 0; n < 5; n++) {
    let a = Math.floor(Math.random() * 14) + 2
    let b = Math.floor(Math.random() * 14) + 2
    const useMul = Math.random() < 0.35
    let prompt: string
    let answer: number
    if (useMul) {
      a = Math.floor(Math.random() * 11) + 2
      b = Math.floor(Math.random() * 11) + 2
      prompt = `${a} × ${b} = ?`
      answer = a * b
    } else if (Math.random() < 0.5) {
      if (b > a) [a, b] = [b, a]
      prompt = `${a} − ${b} = ?`
      answer = a - b
    } else {
      prompt = `${a} + ${b} = ?`
      answer = a + b
    }

    const wrong = new Set<number>()
    while (wrong.size < 3) {
      const delta = Math.floor(Math.random() * 11) - 5
      const guess = answer + (delta === 0 ? 11 : delta)
      if (guess !== answer && guess >= 0 && guess < 500) wrong.add(guess)
    }
    const pool = [answer, ...wrong]
    const order = shuffleIndices(4)
    const choices = order.map((i) => String(pool[i]))
    const correct = choices.indexOf(String(answer))
    out.push({ prompt, choices, correct })
  }
  return out
}

type Props = { onClose: () => void }

export function MiniGame({ onClose }: Props) {
  const [screen, setScreen] = useState<'menu' | 'play' | 'result'>('menu')
  const [mode, setMode] = useState<Mode | null>(null)
  const [grammarRound, setGrammarRound] = useState<GrammarQ[]>(() => pickGrammarRound())
  const [mathRound, setMathRound] = useState<MathQ[]>([])
  const [qi, setQi] = useState(0)
  const [score, setScore] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)

  const resetPlay = useCallback(() => {
    setQi(0)
    setScore(0)
    setPicked(null)
    setRevealed(false)
  }, [])

  const closeAll = useCallback(() => {
    setScreen('menu')
    setMode(null)
    resetPlay()
    onClose()
  }, [onClose, resetPlay])

  const startMode = (m: Mode) => {
    if (m === 'grammar') setGrammarRound(pickGrammarRound())
    if (m === 'math') setMathRound(buildMathRound())
    setMode(m)
    resetPlay()
    setScreen('play')
  }

  const questions = mode === 'grammar' ? grammarRound : mode === 'math' ? mathRound : []
  const current = questions[qi]
  const total = questions.length
  const perfect = screen === 'result' && score === total && total > 0

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeAll()
    }
    window.addEventListener('keydown', key)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', key)
    }
  }, [closeAll])

  const onPick = (idx: number) => {
    if (revealed || !current) return
    setPicked(idx)
    setRevealed(true)
    const ok = idx === current.correct
    if (ok) setScore((s) => s + 1)

    window.setTimeout(() => {
      if (qi + 1 >= total) {
        setScreen('result')
      } else {
        setQi((q) => q + 1)
        setPicked(null)
        setRevealed(false)
      }
    }, 780)
  }

  const playAgain = () => {
    setScreen('menu')
    setMode(null)
    resetPlay()
  }

  return createPortal(
    <div className="mini-game-backdrop" role="presentation" onClick={closeAll}>
      <div
        className="mini-game"
        role="dialog"
        aria-modal="true"
        aria-labelledby="mini-game-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="mini-game__close" onClick={closeAll} aria-label="Close game">
          ×
        </button>

        {screen === 'menu' && (
          <div className="mini-game__panel">
            <p className="mini-game__eyebrow">Quick break</p>
            <h2 id="mini-game-title" className="mini-game__title">
              Mini challenge
            </h2>
            <p className="mini-game__lede">
              Five questions. Get all five right and collect a glowing{' '}
              <span className="mini-game__star-inline" aria-hidden="true">
                ★
              </span>{' '}
              STAR.
            </p>
            <div className="mini-game__modes">
              <button type="button" className="mini-game__mode" onClick={() => startMode('grammar')}>
                <span className="mini-game__mode-icon" aria-hidden="true">
                  ✎
                </span>
                Grammar
              </button>
              <button type="button" className="mini-game__mode" onClick={() => startMode('math')}>
                <span className="mini-game__mode-icon" aria-hidden="true">
                  ∑
                </span>
                Math
              </button>
            </div>
          </div>
        )}

        {screen === 'play' && current && (
          <div className="mini-game__panel">
            <p className="mini-game__progress">
              Question {qi + 1} / {total}
              <span className="mini-game__mode-pill">{mode === 'grammar' ? 'Grammar' : 'Math'}</span>
            </p>
            <p className="mini-game__prompt">{current.prompt}</p>
            <ul className="mini-game__choices">
              {current.choices.map((c, i) => {
                let cls = 'mini-game__choice'
                if (revealed) {
                  if (i === current.correct) cls += ' is-correct'
                  else if (i === picked && i !== current.correct) cls += ' is-wrong'
                }
                return (
                  <li key={`${qi}-${i}`}>
                    <button type="button" className={cls} onClick={() => onPick(i)} disabled={revealed}>
                      {c}
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        )}

        {screen === 'result' && (
          <div className="mini-game__panel mini-game__panel--result">
            {perfect ? (
              <>
                <div className="mini-game__star-burst" aria-hidden="true">
                  <span className="mini-game__star">★</span>
                </div>
                <h2 className="mini-game__title mini-game__title--win">Perfect run!</h2>
                <p className="mini-game__lede">
                  {score}/{total} correct — STAR unlocked. You crushed it.
                </p>
              </>
            ) : (
              <>
                <h2 className="mini-game__title">Round complete</h2>
                <p className="mini-game__lede">
                  Score: <strong>{score}</strong> / <strong>{total}</strong>. Perfect score earns the STAR — try again!
                </p>
              </>
            )}
            <div className="mini-game__actions">
              <button type="button" className="mini-game__btn mini-game__btn--primary" onClick={playAgain}>
                Play again
              </button>
              <button type="button" className="mini-game__btn mini-game__btn--ghost" onClick={closeAll}>
                Back to portfolio
              </button>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body,
  )
}
