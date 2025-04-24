'use client'
// import { generateImageWithGeimini } from '@/actions/aiModel'
import { generateImageWithGeimini } from '@/actions/imageGenModel'
import { uploadFile } from '@uploadcare/upload-client'
import React, { useState } from 'react'
type Props = {}

function page({ }: Props) {
  const [image, setImage] = useState<string | null>(null)
  // const [fileName, setFileName] = useState<string | null>(null)

  return (
    <div>
      <button onClick={async () => {
        const imageUrl = await generateImageWithGeimini("A beautiful sunset over a calm ocean")

        setImage(imageUrl)
      }}>
        Generate Images
      </button>
      {/* {image && <img src={"https://ucarecdn.com/3c7fba82-ae7c-4825-aaef-4e3f42034a98/"} className='w-1/2 h-1/2' alt="image" />} */}
      <img src={"https://ucarecdn.com/3c7fba82-ae7c-4825-aaef-4e3f42034a98/-/preview/"} className='w alt="image"' />

    </div>
  )
}

export default page