import { useEffect } from 'react';

type Props = {
  name: String
  // year: Date
  // solYear: Date
}

export const Guess = ({
  name,
  // year,
  // solYear
}: Props) => {

  return (
    <div className="flex items-stretch p-2 w-100 g-8">
      <div className='guess-text-container'>
        <div className='guess-text-wrapper'>
          <span className='guess-name'>{name}</span>
        </div>
        {/* <span className='year'>{'1988'}{'>'}</span> */}

      </div>

      {/* <span className="text-slate-500">{year}</span>
      <span className="text-slate-500">{solYear > year ? '>' : '<'}</span> */}
    </div>
  )
}
