
import { BaseModal } from './BaseModal'

type Props = {
  isOpen: boolean
  handleClose: () => void
}

export const InfoModal = ({ isOpen, handleClose }: Props) => {
  return (
    <BaseModal title="How to play" isOpen={isOpen} handleClose={handleClose} cancelIcon={true}>
      <p className="text-sm text-gray-500 dark:text-gray-300">
        Guess the movie in 6 tries. After each guess, the screenshot will change.
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-300">
        Everyday a new movie to guess !
      </p>

      {/* <p className="mt-6 text-sm italic text-gray-500 dark:text-gray-300">
        This is an open source version of the word guessing game we all know and
        love -{' '}
        <a
          href="https://github.com/cwackerfuss/react-wordle"
          className="font-bold underline"
        >
          check out the code here
        </a>{' '}
      </p> */}
    </BaseModal>
  )
}
