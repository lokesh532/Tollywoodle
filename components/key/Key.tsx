import classnames from 'classnames'
import { ReactNode } from 'react'

type Props = {
  value: string
  width?: number
  currentImage: number
  onClick: (value: string) => void
}

export const Key = ({
  width = 40,
  value,
  currentImage,
  onClick,
}: Props) => {



  const classes = classnames(
    'xxshort:h-8 xxshort:w-8 xxshort:text-xxs xshort:w-10 xshort:h-10 flex short:h-12 h-14 items-center justify-center rounded mx-0.5 text-xs font-bold cursor-pointer select-none dark:text-white',
    {
      'bg-slate-200 dark:bg-slate-600 hover:bg-slate-400':
        currentImage.toString() != value,
      'bg-slate-400 dark:bg-slate-600 hover:bg-slate-400':
        currentImage.toString() === value
    }
  )

  const styles = {
    width: `${width}px`
  }

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    onClick(value)
    event.currentTarget.blur()
  }

  return (
    <button
      style={styles}
      className={classes}
      onClick={handleClick}
    >
      {value}
    </button>
  )
}
