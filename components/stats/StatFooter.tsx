import { ClockIcon, ShareIcon } from '@heroicons/react/outline'
import { format } from 'date-fns'
import Countdown from 'react-countdown'
import {
    DATE_LOCALE,
    ENABLE_ARCHIVED_GAMES,
} from '../../utils/settings'
import {
    ARCHIVE_GAMEDATE_TEXT,
    NEW_WORD_TEXT,
    SHARE_TEXT,
} from '../../utils/strings'
import { shareStatus } from '../../utils/share'
import { solutionGameDate, tomorrow } from '../../utils/movies'

type Props = {
    isLatestGame: boolean
    solution: string
    guesses: string[]
    isGameLost: boolean
    isDarkMode: boolean
    isHighContrastMode: boolean
    handleShareToClipboard: () => void
    handleShareFailure: () => void
}
export const StatFooter = ({ isLatestGame, solution, guesses, isGameLost, isDarkMode, isHighContrastMode, handleShareToClipboard, handleShareFailure }: Props) => {
    return (
        <div className="mt-5 columns-2 items-center items-stretch justify-center text-center dark:text-white sm:mt-6">
            <div className="inline-block w-full text-left">
                {(!ENABLE_ARCHIVED_GAMES || isLatestGame) && (
                    <div>
                        <h5>{NEW_WORD_TEXT}</h5>
                        <Countdown
                            className="text-lg font-medium text-gray-900 dark:text-gray-100"
                            date={tomorrow}
                            daysInHours={true}
                        />
                    </div>
                )}
                {ENABLE_ARCHIVED_GAMES && !isLatestGame && (
                    <div className="mt-2 inline-flex">
                        <ClockIcon className="mr-1 mt-2 mt-1 h-5 w-5 stroke-black dark:stroke-white" />
                        <div className="mt-1 ml-1 text-center text-sm sm:text-base">
                            <strong>{ARCHIVE_GAMEDATE_TEXT}:</strong>
                            <br />
                            {format(solutionGameDate, 'd MMMM yyyy', {
                                locale: DATE_LOCALE,
                            })}
                        </div>
                    </div>
                )}
            </div>
            <div>
                <button
                    type="button"
                    className="mt-2 inline-flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-center text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-base"
                    onClick={() => {
                        shareStatus(
                            solution,
                            guesses,
                            isGameLost,
                            isDarkMode,
                            isHighContrastMode,
                            handleShareToClipboard,
                            handleShareFailure
                        )
                    }}
                >
                    <ShareIcon className="mr-2 h-6 w-6 cursor-pointer dark:stroke-white" />
                    {SHARE_TEXT}
                </button>
            </div>
        </div>
    )
}
