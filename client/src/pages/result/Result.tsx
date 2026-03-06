import { useSelector } from 'react-redux'
import { useGameState } from '../../services/sockets/LobbyClient'
import { selectAuth } from '../../store/slices'

function ResultsPage() {
  const gameState = useGameState()
  const me = useSelector(selectAuth).user

  if (!gameState) return <div>Loading results...</div>

  const { leaderboard, players } = gameState
  const questionCount =
    gameState.questions?.length ??
    Math.max(...Object.values(players).map(p => Object.keys(p.score).length))

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Results</h1>

      <table className="table-auto border-collapse border border-gray-300 w-full text-center">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Place</th>
            <th className="border p-2">Player</th>
            {Array.from({ length: questionCount }).map((_, qIndex) => (
              <th
                key={qIndex}
                className="border p-2 text-center"
              >
                Q{qIndex + 1}
              </th>
            ))}
            <th className="border p-2 text-center">Total Correct</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((playerId, rankIndex) => {
            const player = players[playerId]
            const totalCorrect = Object.values(player.score).filter(
              s => s.correct
            ).length

            return (
              <tr
                key={playerId}
                className={
                  playerId === me?.id ? 'bg-green-100 font-semibold' : ''
                }
              >
                <td className="border p-2 text-center">{rankIndex + 1}</td>
                <td className="border p-2">{player.user.username}</td>
                {Array.from({ length: questionCount }).map((_, qIndex) => {
                  const answer = player.score[qIndex]
                  return (
                    <td
                      key={qIndex}
                      className="border p-2 text-center"
                      title={answer ? `Time: ${answer.time}ms` : undefined}
                    >
                      {answer ?
                        answer.correct ?
                          '✅'
                        : '❌'
                      : '-'}
                    </td>
                  )
                })}
                <td className="border p-2 text-center">{totalCorrect}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export { ResultsPage }
