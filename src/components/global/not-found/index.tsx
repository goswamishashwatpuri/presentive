'use client'

import React from 'react'
import { FolderPlus, Plus } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'

function NotFound() {
  return (
    <motion.div 
      className='relative w-full flex flex-col items-center justify-center py-10 px-4'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
    >
      {/* Decorative elements */}
      <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl" />
      
      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="relative max-w-lg w-full text-center"
      >
        <div className="mb-6 p-4 rounded-full bg-orange-500/10 inline-block backdrop-blur-sm">
          <FolderPlus className="h-8 w-8 text-orange-400" />
        </div>
        
        <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">
          No Projects Yet
        </h1>
        
        <p className="text-gray-400 text-lg mb-8">
          Start creating amazing presentations with Presentive&apos;s AI-powered platform
        </p>

        <Link 
          href="/create-page" 
          className="inline-flex items-center px-6 py-3 rounded-lg relative group"
        >
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-orange-500/50 to-pink-500/50 blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-orange-500 to-pink-500 opacity-20" />
          <div className="absolute inset-[1px] rounded-lg bg-black" />
          <span className="relative z-10 text-white group-hover:text-orange-400 transition-colors flex items-center">
            <Plus className="mr-2 h-5 w-5" />
            Create Your First Project
          </span>
        </Link>
      </motion.div>
    </motion.div>
  )
}

export default NotFound