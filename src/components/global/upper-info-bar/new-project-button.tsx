'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { User } from '@prisma/client'
import { useRouter } from 'next/navigation'

type Props = {
  user: User
}

function NewProjectButton({user}: Props) {
  const router = useRouter()
  return (
    <Button 
    className='rounded-lg font-semibold'  
    disabled={!user.subscription}
    onClick={() => {
      router.push('/create-page')
    }}
    >
      <Plus className='w-4 h-4' /> New Project
    </Button>
  )
}

export default NewProjectButton