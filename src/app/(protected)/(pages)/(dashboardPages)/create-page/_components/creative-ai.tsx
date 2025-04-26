"use client"

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { containerVariants, itemVariants } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import { ChevronLeft, Loader2, RotateCcw } from 'lucide-react'
import { Input } from '@/components/ui/input'
import useCreativeAiStore from '@/store/useCreativeAiStore'
import CardList from './card-list'
import usePromptStore from '@/store/usePromptStore'
import RecentPrompts from './recent-prompts'
import { toast } from 'sonner'
import { generateCreativePrompt } from '@/actions/ai'
import { OutlineCard } from '@/lib/types'
import { v4 as uuidv4 } from 'uuid'
import { createProject } from '@/actions/project'
import { useSlideStore } from '@/store/useSlideStore'

type Props = {
  onBack: () => void
}

function CreativeAi({ onBack }: Props) {
  const router = useRouter()
  const {
    currentAiPrompt,
    setCurrentAiPrompt,
    outlines,
    addOutline,
    addMultipleOutlines,
    resetOutlines
  } = useCreativeAiStore()
  const { setProject } = useSlideStore()
  const [editingCard, setEditingCard] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedCard, setSelectedCard] = useState<string | null>(null)
  const [editText, setEditText] = useState('')
  const { prompts, addPrompt } = usePromptStore()

  function resetCards() {
    setEditingCard(null)
    setSelectedCard(null)
    setEditText('')

    setCurrentAiPrompt('')
    resetOutlines()
  }

  async function generateOutline() {
    if (currentAiPrompt.length === 0) {
      toast.error("Error", {
        description: 'Please enter a prompt'
      })
      return
    }
    setIsGenerating(true)
    const res = await generateCreativePrompt(currentAiPrompt);
    if (res.status === 200 && res?.data?.outlines) {
      const cardsData: OutlineCard[] = []
      res.data.outlines.map((outline: string, index: number) => {
        const newCard = {
          id: uuidv4(),
          title: outline,
          order: index + 1,
        }
        cardsData.push(newCard)
      })
      addMultipleOutlines(cardsData)
      toast.success("Success", {
        description: `Outline generated successfully`
      })
      setIsGenerating(false)

    } else {
      toast.error("Error", {
        description: "Failed to generate outline, please try again"
      })
    }
    setIsGenerating(false)
  }

  // TODO: Add generate cards function
  async function handleGenerate() {
    setIsGenerating(true)
    if (outlines.length === 0) {
      toast.error("Error", {
        description: "Please generate an outline first"
      })
      setIsGenerating(false)
      return
    }
    try {
      const res = await createProject(currentAiPrompt, outlines)
      if (res.status !== 200 || !res?.data) {
        throw new Error("Unable to create project")
      }

      setProject(res.data)
      addPrompt({
        id: uuidv4(),
        title: currentAiPrompt || outlines?.[0]?.title,
        outlines: outlines,
        createdAt: new Date().toISOString(),
      })
      toast.success("Success", {
        description: "Project created successfully"
      })

      router.push(`/presentation/${res.data.id}/select-theme`)
      setCurrentAiPrompt('')
      resetOutlines()

    } catch (error) {
      console.error(error)
      toast.error("Error", {
        description: "Unable to create project"
      })
    } finally {
      setIsGenerating(false)
    }
    
  }


  return (
    <motion.div
      className='space-y-6 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Button
        onClick={onBack}
        variant="outline"
        className='mb-4'
      >
        <ChevronLeft className='h-4 w-4' />
        Back
      </Button>
      <motion.div
        variants={itemVariants}
        className='text-center space-y-2'
      >
        <h1 className='text-4xl font-bold text-primary'>
          Generate with {" "}
          <span className='text-presentive'>Creative AI</span>
        </h1>

        <p className='text-secondary'>
          What would you like to create today?
        </p>
      </motion.div>
      <motion.div
        variants={itemVariants}
        className='bg-primary/10 p-4 rounded-xl'
      >
        <div className='flex flex-col gap-3 sm:flex-row justify-between items-center rounded-xl'>
          <Input placeholder='Enter a prompt and add to the cards...'
            className='text-base sm:text-xl border-0 focus-visible:ring-0 shadow-none p-0 bg-transparent flex-grow'
            required
            value={currentAiPrompt}
            onChange={(e) => setCurrentAiPrompt(e.target.value)}
          />
          <div className='flex items-center gap-3'>
            <Button
              variant='destructive'
              aria-label='Reset Cards'
              onClick={resetCards}
              size='icon'
            >
              <RotateCcw className='h-4 w-4' />
            </Button>
          </div>
        </div>
      </motion.div>
      <div
        className='w-full flex justify-center items-center'>
        <Button
          className='font-medium text-lg flex gap-2 items-center'
          onClick={generateOutline}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <Loader2 className='mr-2  animate-spin' />
              Generating...
            </>
          ) : (
            <>Generate Outline</>
          )}
        </Button>
      </div>
      <CardList
        outlines={outlines}
        addOutline={addOutline}
        addMultipleOutlines={addMultipleOutlines}
        editingCard={editingCard}
        selectedCard={selectedCard}
        editText={editText}
        onEditChange={setEditText}
        onCardSelect={setSelectedCard}
        setEditText={setEditText}
        setEditingCard={setEditingCard}
        setSelectedCard={setSelectedCard}
        onCardDoubleClick={(id, title) => {
          setEditingCard(id)
          setEditText(title)
        }}
      />
      {outlines.length > 0 &&
        <Button className='w-full'
          onClick={handleGenerate}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <Loader2 className='mr-2  animate-spin' />
              Generating...
            </>
          ) : (
            <>Generate</>
          )}
        </Button>
      }

      {prompts.length > 0 &&
        <RecentPrompts />}

    </motion.div>
  )
}

export default CreativeAi