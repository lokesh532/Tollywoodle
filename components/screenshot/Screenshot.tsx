import axios from 'axios';
import { useEffect, useState } from 'react';
import Image from 'next/image'
const BASE_URL = 'http://localhost:3001/';

type Props = {
  solution: string,
  solutionIndex: number,
  currentImage: number
}



export const ScreenShot = ({
  solution, solutionIndex, currentImage
}: Props) => {

  const myLoader = ({ src, width, height }: any) => {
    return src
  }

  const cloudflareImageLoader = ({ src, width, height, quality }: any) => {
    if (!quality) {
      quality = 75
    }
    return `https://posterly.pages.dev` + src
    //return `https://posterly.pages.dev/api/image-resizer?width=${width}&height=${height}&quality=${quality}`
    //https://posterly.pages.dev/?url=%2Fimages%2F8%2F3.jpg&w=640&q=75
    //https://posterly.pages.dev/api/image-resizer?width=640&height=undefined&quality=75&image=https://posterly.pages.dev/images/8/2.jpg
  }

  return (
    <div className='flex justify-center'>
      <div className='img-wrapper'>
        {process.env.NODE_ENV === 'development' &&
          <Image
            loader={myLoader}
            src={`/images/` + solutionIndex + `/` + currentImage + `.jpg`}
            alt="Picture of the author"
            width={500}
            height={500}
          />}
        {process.env.NODE_ENV != 'development' &&
          <Image
            src={`/images/` + solutionIndex + `/` + currentImage + `.jpg`}
            alt="Picture of the author"
            width={500}
            height={500}
            loader={myLoader}
          />
        }
      </div>
    </div>
  )
}
