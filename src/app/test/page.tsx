'use client'
import React, { useState } from 'react'
import { generateImagesTemp } from '@/actions/aiModel'
type Props = {}

function page({}: Props) {
  const [image, setImage] = useState<string | null>(null)
  return (
    <div>
      <button onClick={() => {
        generateImagesTemp().then((res) => {
          // setImage(res)
          if (res) {
            const blob = new Blob([res.buffer], { type: 'image/png' });
            setImage(URL.createObjectURL(blob))
          }
        })
      }}>
        Generate Images
      </button>
      {image && <img src={image} alt="image" />}
      
    </div>
  )
}

export default page