
import { useEffect, useState } from "react";
import { ClockIcon } from '@heroicons/react/outline'
import { format } from 'date-fns'
import { ScreenShot } from "../screenshot/Screenshot";
import { AlertContainer } from '../alerts/AlertContainer'
import { DatePickerModal } from '../modals/DatePickerModal'
import { InfoModal } from '../modals/InfoModal'
import { MigrateStatsModal } from '../modals/MigrateStatsModal'
import { SettingsModal } from '../modals/SettingsModal'
import { StatsModal } from '../modals/StatsModal'
import { Key } from '../key/Key';
import {
  DATE_LOCALE,
  DISCOURAGE_INAPP_BROWSERS,
  LONG_ALERT_TIME_MS,
  MAX_CHALLENGES,
  REVEAL_TIME_MS,
  WELCOME_INFO_MODAL_MS,
} from '../../utils/settings'
import {
  CORRECT_WORD_MESSAGE,
  DISCOURAGE_INAPP_BROWSER_TEXT,
  GAME_COPIED_MESSAGE,
  SHARE_FAILURE_TEXT,
  SUCCESS_WORD_MESSAGE,
  WIN_MESSAGES,
} from '../../utils/strings'
import {
  getGameDate,
  getIsLatestGame,
  isWinningMovie,
  setGameDate,
  solution,
  solutionIndex,
  solutionGameDate
} from '../../utils/movies';
import { addStatsForCompletedGame, loadStats } from '../../utils/stats'
import {
  getStoredIsHighContrastMode,
  loadDateFromLocalStorage,
  saveDateToLocalStorage,
  loadGameStateFromLocalStorage,
  saveGameStateToLocalStorage,
  setStoredIsHighContrastMode,
} from '../../utils/localStorage'
import { useAlert } from '../context/AlertContext'
import { Autocomplete } from "../autocomplete/Autocomplete";
import { Guess } from "../guess/Guess";
import { StatFooter } from "../stats/StatFooter";
import Navbar from "../navbar/Navbar";
const Game: React.FC = () => {
  const [isLatestGame, setisLatestGame] = useState<boolean>(getIsLatestGame());
  const gameDate = getGameDate()
  const { showError: showErrorAlert, showSuccess: showSuccessAlert } =
    useAlert()
  const [currentImage, setCurrentImage] = useState(1);
  const [isGameWon, setIsGameWon] = useState(false)
  const [isGameLost, setIsGameLost] = useState(false)
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false)
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false)
  const [isDatePickerModalOpen, setIsDatePickerModalOpen] = useState(false)
  const [isMigrateStatsModalOpen, setIsMigrateStatsModalOpen] = useState(false)
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const storageDate = new Date(2022, 11, 28);
  const [guesses, setGuesses] = useState<string[]>(() => {
    let loaded = loadGameStateFromLocalStorage(isLatestGame)
    if (loaded?.solution !== solution) {
      return []
    }
    const gameWasWon = loaded.guesses.map(guess => guess.toUpperCase()).includes(solution)
    if (gameWasWon) {
      setIsGameWon(true)
    }
    if (loaded.guesses.length + 1 === MAX_CHALLENGES && !gameWasWon) {
      setIsGameLost(true)
      // showErrorAlert(CORRECT_WORD_MESSAGE(solution), {
      //   persist: true,
      // })
    }
    return loaded.guesses
  })
  const [stats, setStats] = useState(() => loadStats())
  useEffect(() => {
    // if no game state on load,
    // show the user the how-to info modal   
    const dateState = loadDateFromLocalStorage();
    if (dateState != '') {
      const cacheDate = new Date(JSON.parse(dateState).date);
      if (cacheDate < storageDate) {
        localStorage.clear();
        setGuesses([]);
        saveDateToLocalStorage({ 'date': storageDate })
      }
    }
    else {
      saveDateToLocalStorage({ 'date': storageDate })
    }
    if (!loadGameStateFromLocalStorage(true)) {
      setTimeout(() => {
        setIsInfoModalOpen(true)
      }, WELCOME_INFO_MODAL_MS)
    }
  })

  useEffect(() => {
    if (isGameWon) {
      const winMessage =
        WIN_MESSAGES[Math.floor(Math.random() * WIN_MESSAGES.length)]
      const delayMs = REVEAL_TIME_MS * solution.length

      showSuccessAlert(winMessage, {
        delayMs,
        onClose: () => setIsStatsModalOpen(true),
      })
    }
  }, [isGameWon, isGameLost, showSuccessAlert])

  useEffect(() => {
    saveGameStateToLocalStorage(getIsLatestGame(), { guesses, solution })
  }, [guesses,storageDate])

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  const handleDarkMode = (isDark: boolean) => {
    setIsDarkMode(isDark)
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  }
  const onChange = (value: string) => {
    const winningWord = isWinningMovie(value)
    if (
      guesses.length < MAX_CHALLENGES &&
      !isGameWon
    ) {
      if (guesses.length < 5)
        setGuesses([...guesses, value])

      if (winningWord) {
        if (isLatestGame) {
          setStats(addStatsForCompletedGame(stats, guesses.length))
        }
        return setIsGameWon(true)
      }
      if (guesses.length === MAX_CHALLENGES - 1) {
        if (isLatestGame) {
          setStats(addStatsForCompletedGame(stats, guesses.length + 1))
        }
        setIsGameLost(true)
      }
      if (guesses.length < 5)
        setCurrentImage(guesses.length + 2)
    }
  }

  return (
    <div className="flex h-full flex-col">
      <Navbar
        setIsInfoModalOpen={setIsInfoModalOpen}
        setIsStatsModalOpen={setIsStatsModalOpen}
        setIsDatePickerModalOpen={setIsDatePickerModalOpen}
        setIsSettingsModalOpen={setIsSettingsModalOpen}
      />

      {!isLatestGame && <div className="flex items-center justify-center">
        <ClockIcon className="h-6 w-6 stroke-gray-600 dark:stroke-gray-300"></ClockIcon>
        <p className="text-base text-gray-600 dark:text-gray-300">
          {format(gameDate, 'd MMMM yyyy', { locale: DATE_LOCALE })}
        </p>
      </div>}

      <div className="mx-auto flex w-full flex-col px-1 pt-2 pb-8 sm:px-6 md:max-w-2xl lg:px-8 short:pb-2 short:pt-2">
        <div className="flex grow flex-col justify-center pb-6 short:pb-2 gap-2">
          <div className='relative sm:h-64 mb-4'>
            <ScreenShot
              solution={solution} solutionIndex={solutionIndex + 1} currentImage={currentImage}
            />
          </div>
          <div className="mb-1 flex justify-center">
            {[...Array(isGameWon ? guesses.length : guesses.length + 1)].map((key, index) => {
              return (<Key
                value={(index + 1).toString()}
                key={index + 1}
                onClick={() => setCurrentImage(index + 1)} currentImage={currentImage}
              />

              )
            })}
          </div>
          {(!isGameLost && !isGameWon) &&
            <>
              <div className="flex flex-col">
                <Autocomplete onChange={onChange} />
              </div>
              <div className="flex flex-col">
                {guesses.map((key) => (<Guess name={key} key={key} />))}
              </div>
              <div className="flex justify-center">
                <div className="dark:text-white">
                  <p className="mt-1">{MAX_CHALLENGES - guesses.length} GUESSES OF 6 REMAINING</p>
                </div>
              </div>
            </>
          }
          {(isGameLost || isGameWon) &&
            <div className="flex flex-col justify-center text-center dark:text-white mb-1">
              {isGameWon && <div className="font-medium">
                {SUCCESS_WORD_MESSAGE}
              </div>}
              {isGameLost && <div className="font-medium">
                {CORRECT_WORD_MESSAGE}
              </div>}
              {isGameLost && <div className="font-bold ">
                {solution}
              </div>}
              <div className="mb-1 flex justify-center">
                <StatFooter isLatestGame={isLatestGame} solution={solution} guesses={guesses}
                  isGameLost={isGameLost}
                  handleShareToClipboard={() => showSuccessAlert(GAME_COPIED_MESSAGE)}
                  handleShareFailure={() => showErrorAlert(SHARE_FAILURE_TEXT, {
                    durationMs: LONG_ALERT_TIME_MS,
                  })} isDarkMode={false} isHighContrastMode={false} />
              </div>
            </div>
          }
        </div>
        <InfoModal
          isOpen={isInfoModalOpen}
          handleClose={() => setIsInfoModalOpen(false)}
        />
        <StatsModal
          isOpen={isStatsModalOpen}
          handleClose={() => setIsStatsModalOpen(false)}
          solution={solution}
          guesses={guesses}
          gameStats={stats}
          isLatestGame={isLatestGame}
          isGameLost={isGameLost}
          isGameWon={isGameWon}
          handleShareToClipboard={() => showSuccessAlert(GAME_COPIED_MESSAGE)}
          handleShareFailure={() => showErrorAlert(SHARE_FAILURE_TEXT, {
            durationMs: LONG_ALERT_TIME_MS,
          })}
          // handleMigrateStatsButton={() => {
          //   setIsStatsModalOpen(false)
          //   setIsMigrateStatsModalOpen(true)
          // }}          
          numberOfGuessesMade={guesses.length}
          handleMigrateStatsButton={function (): void {
            throw new Error('Function not implemented.');
          }} isDarkMode={false} isHighContrastMode={false} />
        <DatePickerModal
          isOpen={isDatePickerModalOpen}
          initialDate={solutionGameDate}
          handleSelectDate={(d) => {
            setIsDatePickerModalOpen(false)
            setGameDate(d)
          }}
          handleClose={() => setIsDatePickerModalOpen(false)}
        />
        <MigrateStatsModal
          isOpen={isMigrateStatsModalOpen}
          handleClose={() => setIsMigrateStatsModalOpen(false)}
        />
        <SettingsModal
          isOpen={isSettingsModalOpen}
          handleClose={() => setIsSettingsModalOpen(false)}
          isDarkMode={isDarkMode}
          handleDarkMode={handleDarkMode}
          isHighContrastMode={false}
          handleHighContrastMode={() => null} />
        <AlertContainer />
      </div>
    </div>
  );
};

export default Game;
