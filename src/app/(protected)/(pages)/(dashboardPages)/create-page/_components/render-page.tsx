'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import usePromptStore from '@/store/usePromptStore'
import CreatePage from './create-page'
import CreativeAi from './creative-ai'
import CreateScratchPage from './create-scratch'


type Props = {}

function RenderPage({ }: Props) {
  const router = useRouter()
  const { page, setPage } = usePromptStore()

  function handleSelectOption(option: string) {
    if (option === 'template') {
      router.push('/templates')
    } else if (option === 'create-scratch') {
      setPage('create-scratch')
    } else {
      setPage('creative-ai')
    }
  }
  function handleBack() {
    setPage('create')
  }

  const renderStep = () => {
    switch (page) {
      case 'create':
        return <CreatePage onSelectOption={handleSelectOption} />
      case 'creative-ai':
        return <CreativeAi onBack={handleBack} />
      case 'create-scratch':
        return <CreateScratchPage onBack={handleBack} />
      default:
        return null
    }
  }

  return (
    <AnimatePresence>
      <motion.div key={page}
        initial={{ opacity: 0, x: 200 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}

      >
        {renderStep()}
      </motion.div>
    </AnimatePresence>
  )
}

export default RenderPage