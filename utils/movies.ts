import {
  addDays,
  differenceInDays,
  formatISO,
  parseISO,
  startOfDay,
} from 'date-fns'
import { default as GraphemeSplitter } from 'grapheme-splitter'
import queryString from 'query-string'

import { ENABLE_ARCHIVED_GAMES } from './settings'
import { NOT_CONTAINED_MESSAGE, WRONG_SPOT_MESSAGE } from './strings'
import { MOVIES } from './movielist'
import { KEYWORDS } from './movielist'
import { getToday } from './dateutils'

// 1 January 2022 Game Epoch
export let firstGameDate = new Date()
firstGameDate.setDate(8)
firstGameDate.setMonth(11);
firstGameDate.setFullYear(2022)

export const periodInDays = 1

// export const isWordInWordList = (word: string) => {
//   return (
//     WORDS.includes(localeAwareLowerCase(word)) ||
//     VALID_GUESSES.includes(localeAwareLowerCase(word))
//   )
// }


export const isWinningMovie = (movie: string) => {
  return solution === MOVIES.find(unit => localeAwareUpperCase(unit.Title) === localeAwareUpperCase(movie))?.id;
}

// build a set of previously revealed letters - present and correct
// guess must use correct letters in that space and any other revealed letters
// also check if all revealed instances of a letter are used (i.e. two C's)
export const findFirstUnusedReveal = (word: string, guesses: string[]) => {
  if (guesses.length === 0) {
    return false
  }

  const lettersLeftArray = new Array<string>()
  const guess = guesses[guesses.length - 1]
  const splitWord = unicodeSplit(word)



  // check for the first unused letter, taking duplicate letters
  // into account - see issue #198
  let n
  for (const letter of splitWord) {
    n = lettersLeftArray.indexOf(letter)
    if (n !== -1) {
      lettersLeftArray.splice(n, 1)
    }
  }

  if (lettersLeftArray.length > 0) {
    return NOT_CONTAINED_MESSAGE(lettersLeftArray[0])
  }
  return false
}

export const unicodeSplit = (word: string) => {
  return new GraphemeSplitter().splitGraphemes(word)
}

export const unicodeLength = (word: string) => {
  return unicodeSplit(word).length
}

export const localeAwareLowerCase = (text: string) => {
  return process.env.REACT_APP_LOCALE_STRING
    ? text.toLocaleLowerCase(process.env.REACT_APP_LOCALE_STRING)
    : text.toLowerCase()
}

export const localeAwareUpperCase = (text: string) => {
  return process.env.REACT_APP_LOCALE_STRING
    ? text.toLocaleUpperCase(process.env.REACT_APP_LOCALE_STRING)
    : text.toUpperCase()
}

export const getLastGameDate = (today: Date) => {
  const t = startOfDay(today)
  let daysSinceLastGame = differenceInDays(firstGameDate, t) % periodInDays
  return addDays(t, -daysSinceLastGame)
}

export const getNextGameDate = (today: Date) => {
  return addDays(getLastGameDate(today), periodInDays)
}

export const isValidGameDate = (date: Date) => {
  if (date < firstGameDate || date > getToday()) {
    return false
  }

  return differenceInDays(firstGameDate, date) % periodInDays === 0
}

export const getIndex = (gameDate: Date) => {
  let start = firstGameDate
  let index = -1
  do {
    index++
    start = addDays(start, periodInDays)
  } while (start <= gameDate)

  return index
}

export const getMovieOfDay = (index: number) => {
  if (index < 0) {
    throw new Error('Invalid index')
  }
 // console.log(index % (MOVIES.length));
  return MOVIES[index % MOVIES.length].id
}

export const getUpdatedKeywords = (value: string) => {
  return KEYWORDS.filter(keyword => localeAwareLowerCase(keyword).includes(localeAwareLowerCase(value)));
}

export const getSolution = (gameDate: Date) => {
  const nextGameDate = getNextGameDate(gameDate)
  const index = getIndex(gameDate)
  const movieOfTheDay = getMovieOfDay(index)
  return {
    solution: movieOfTheDay,
    solutionGameDate: gameDate,
    solutionIndex: index % MOVIES.length,
    tomorrow: nextGameDate.valueOf(),
  }
}

export const getGameDate = () => {
  if ((typeof window !== 'undefined')) {
    if (getIsLatestGame()) {
      return getToday()
    }

    const parsed = queryString.parse(window.location.search)
    try {
      const d = startOfDay(parseISO(parsed.d!.toString()))
      if (d >= getToday() || d < firstGameDate) {
        setGameDate(getToday())
      }
      return d
    } catch (e) {
      //console.log(e)
      return getToday()
    }
  }
  else
    return new Date()
}

export const setGameDate = (d: Date) => {
  try {
    if (d < getToday()) {
      window.location.href = '/?d=' + formatISO(d, { representation: 'date' })
      return
    }
  } catch (e) {
   // console.log(e)
  }
  window.location.href = '/'
}

export const getIsLatestGame = () => {
  if (!ENABLE_ARCHIVED_GAMES) {
    return true
  }
  if ((typeof window !== 'undefined')) {
    const parsed = queryString.parse(window.location.search)
    return parsed === null || !('d' in parsed)
  }
  else
    return false
}

export const { solution, solutionGameDate, solutionIndex, tomorrow } =
  getSolution(getGameDate())
