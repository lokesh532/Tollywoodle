import { useEffect, useState } from 'react'
import { localeAwareUpperCase, getUpdatedKeywords } from '../../utils/movies'

type Props = {
  onChange: (value: string) => void
  // onEnter: () => void
}

export const Autocomplete = ({
  onChange,
  // onEnter
}: Props) => {
  // const charStatuses = getStatuses(solution, guesses)
  const [value, setValue] = useState('');
  const [suggestion, setSuggestion] = useState<string[]>([]);
  // const onSubmit = (value: string) => {
  //   if (value === 'ENTER') {
  //     onEnter()
  //   } else {
  //     onChange(value)
  //   }
  // }

  // useEffect(() => {
  //   const listener = (e: KeyboardEvent) => {
  //     if (e.code === 'Enter') {
  //       onEnter()
  //     } else {
  //       const key = localeAwareUpperCase(e.key)
  //       // TODO: check this test if the range works with non-english letters
  //       if (key.length === 1 && key >= 'A' && key <= 'Z') {
  //         onChange(key)
  //       }
  //     }
  //   }
  //   window.addEventListener('keyup', listener)
  //   return () => {
  //     window.removeEventListener('keyup', listener)
  //   }
  // }, [onEnter, onChange])

  return (
    <div className='flex w-full flex-col'>
      <form className="relative w-full px-2 mb-1">
        <div className='flex flex-row '>
          <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
            <svg width="24" height="24" fill="none" aria-hidden="true" className="mr-3 flex-none">
              <path d="m19 19-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <input type="text" className="w-full py-1 pl-8 pr-2 text-sm rounded-md sm:text-base" placeholder="Search for a movie or press enter to skip" value={value}
            onChange={(event) => {
              setValue(event.target.value);
              setSuggestion(getUpdatedKeywords(event.target.value));
            }}
            onKeyPress={(e) => {
              if (e.charCode === 13) {
                e.preventDefault();
                if (value != '')
                  onChange(value);
                else
                  onChange('Skipped');
                setValue('');
                setSuggestion([]);
              }
            }} />
          <button type="button" className="text-white font-medium bg-red-600 rounded-md border w-28 text-center px-4" onClick={(e) => {
            onChange('Skipped');
            setValue('');
            setSuggestion([]);
          }}>Skip</button>
        </div>
        {suggestion.length > 0 &&
          <>
            <ul className="w-full bg-white border-[1px] rounded-lg shadow-lg p-4 absolute max-h-[200px] overflow-y-auto text-lg">
              <div className="px-1 mx-1 mb-2">Select one movie from this list:</div>
              {suggestion.map((key) => (
                <li key={key} className="px-1 mx-1 mb-2 cursor-pointer hover:bg-slate-200" onClick={(event) => {
                  setValue('');
                  onChange(key);
                  setSuggestion([]);
                }}>{key}</li>
              ))}
            </ul>
          </>}


      </form>
    </div>
  )
}
