import React from 'react'
import { SignIn } from '@clerk/nextjs'


const Signin = () => {
  return (
    <div className='flex h-screen w-full items-center justify-center'>
      <SignIn />
    </div>
  )
}

export default Signin