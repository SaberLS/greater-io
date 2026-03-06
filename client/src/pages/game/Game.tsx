import { Button } from 'primereact/button'
import { FormEvent, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router'
import { protectedSocket } from '../../services'
import { lobbyClient, useGameState } from '../../services/sockets/LobbyClient'
import { selectAuth } from '../../store/slices'

function GamePage() {
  const { lobbyId } = useParams()
  const gameState = useGameState()
  const me = useSelector(selectAuth).user
  const navigate = useNavigate()

  const [index, setIndex] = useState(0)
  const [answer, setAnswer] = useState('')

  if (!gameState) return <div>Loading...</div>

  const total = gameState.questions.length
  const question = gameState.questions[index]

  const mePlayer = gameState.players[me!.id]

  const solved = useMemo(() => {
    if (!mePlayer) return new Set<number>()
    return new Set(
      Object.entries(mePlayer.score)
        .filter(([key, score]) => score.correct)
        .map(([key]) => Number(key))
    )
  }, [mePlayer])

  function next() {
    setIndex(i => (i + 1) % total)
    setAnswer('')
  }

  function prev() {
    setIndex(i => (i - 1 + total) % total)
    setAnswer('')
  }

  function goTo(i: number) {
    setIndex(i)
    setAnswer('')
  }

  function submit(e: FormEvent) {
    e.preventDefault()

    if (!answer) return

    lobbyClient.submitAnswer(index, answer)

    setAnswer('')
  }

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  useEffect(() => {
    const handleGameEnd = () => {
      console.log('navigating to `/game/${lobbyId}/result`')
      navigate(`/game/${lobbyId}/result`)
    }

    protectedSocket.instance.on('lobby:game-ended', handleGameEnd)

    return () => {
      protectedSocket.instance.off('lobby:game-ended', handleGameEnd)
    }
  }, [lobbyId, navigate])

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center gap-10">
      {/* Question Navigator */}
      <div className="flex gap-2">
        {gameState.questions.map((_, i) => {
          const isSolved = solved.has(i)
          const isCurrent = i === index

          return (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`w-10 h-10 rounded flex items-center justify-center border
                ${isCurrent ? 'border-blue-500' : 'border-gray-300'}
                ${isSolved ? 'bg-green-200' : ''}
              `}
            >
              {isSolved ? '✓' : i + 1}
            </button>
          )
        })}
      </div>

      {/* Question */}
      <div className="flex items-center gap-10">
        <button
          onClick={prev}
          className="text-5xl opacity-60 hover:opacity-100"
        >
          ←
        </button>

        <div className="text-7xl font-bold font-mono min-w-[300px] text-center">
          {question}
        </div>

        <button
          onClick={next}
          className="text-5xl opacity-60 hover:opacity-100"
        >
          →
        </button>
      </div>

      {/* Answer */}
      <form onSubmit={submit}>
        <input
          autoFocus
          value={answer}
          onChange={e => setAnswer(e.target.value)}
          className="text-4xl border-b text-center outline-none w-48"
          placeholder="?"
        />
        <Button
          label="submit"
          type="submit"
        />
      </form>
    </div>
  )
}

export { GamePage }
