import React from 'react'
import { SearchX } from 'lucide-react'
type Props = {}

function NotFound({}: Props) {

  return (
    <div className='flex flex-col items-center justify-center h-full'>
      <SearchX className='mb-3 w-10 h-10' />
      <h1 className='text-2xl font-semibold'>Nothing To See Here</h1>
      <p className='text-sm text-muted-foreground'>Create a new project to get started.</p>
    </div>
  )
}

export default NotFound