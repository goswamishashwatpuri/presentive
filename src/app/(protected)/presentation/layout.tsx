import { redirect } from 'next/navigation'
import React from 'react'

type Props = {
  children: React.ReactNode
}

function Layout({ children }: Props) {
  // redirect('/dashboard');
  return (
    <div>
      {children}
    </div>
  )
}

export default Layout