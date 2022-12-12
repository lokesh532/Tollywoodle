import { GameStats } from '../../utils/localStorage'
import { Progress } from './Progress'

type Props = {
  gameStats: GameStats
  isLatestGame: boolean
  isGameWon: boolean
  numberOfGuessesMade: number
}

const isCurrentDayStatRow = (
  isLatestGame: boolean,
  isGameWon: boolean,
  numberOfGuessesMade: number,
  i: number
) => {
  //console.log((i + 1) + "," + numberOfGuessesMade);
  return isLatestGame && isGameWon && numberOfGuessesMade === i
}

export const Histogram = ({
  gameStats,
  isLatestGame,
  isGameWon,
  numberOfGuessesMade,
}: Props) => {
  const winDistribution = gameStats.winDistribution
  const maxValue = Math.max(...winDistribution, 1)

  return (
    <div className="justify-left m-2 columns-1 text-sm dark:text-white">
      {winDistribution.map((value, i) => (
        <Progress
          key={i}
          index={i}
          isCurrentDayStatRow={isCurrentDayStatRow(
            isLatestGame,
            isGameWon,
            numberOfGuessesMade,
            i
          )}
          size={90 * (value / maxValue)}
          label={String(value)}
        />
      ))}
    </div>
  )
}
