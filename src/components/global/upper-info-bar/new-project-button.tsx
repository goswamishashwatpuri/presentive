'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Plus, Sparkles } from 'lucide-react'
import { User } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

type Props = {
  user: User
}

function NewProjectButton({user}: Props) {
  const router = useRouter()
  return (
    <Button 
      className="group relative px-6 py-2 h-9 bg-transparent hover:bg-transparent border-0"
      disabled={!user.subscription}
      onClick={() => {
        router.push('/create-page')
      }}
    >
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-orange-500/50 to-pink-500/50 blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-orange-500 to-pink-500 opacity-20" />
      <div className="absolute inset-[1px] rounded-lg bg-black" />
      <motion.span 
        className="relative z-10 text-white group-hover:text-orange-400 transition-colors flex items-center gap-2"
        initial={false}
        animate={{ x: [0, 2, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
      >
        <Plus className="w-4 h-4" />
        New Project
        <Sparkles className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </motion.span>
    </Button>
  )
}

export default NewProjectButton