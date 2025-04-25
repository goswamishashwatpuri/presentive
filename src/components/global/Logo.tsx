import { ComponentIcon } from 'lucide-react'
import React from 'react'

type Props = {}

function Logo({ }: Props) {
  return (
    <section className='flex items-center gap-2'>
      <div className='text-orange-400'>
        <ComponentIcon className='size-6' />
      </div>
      <p className='font-medium text-orange-400 text-xl'>
        Presentive
      </p>
    </section>
  )
}

export default Logo