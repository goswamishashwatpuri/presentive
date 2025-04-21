'use client'

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { containerVariants, itemVariants } from '@/lib/constants';
import useScratchStore from '@/store/useStartScratchStore';
import { motion } from 'framer-motion';
import { ChevronLeft, RotateCcw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import CardList from './card-list';
import { OutlineCard } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { createProject } from '@/actions/project';
import { useSlideStore } from '@/store/useSlideStore';

type Props = {
  onBack: () => void
}


function CreateScratchPage({ onBack }: Props) {
  const router = useRouter()
  const [editText, setEditText] = useState('')
  const [editingCard, setEditingCard] = useState<string | null>(null)
  const [selectedCard, setSelectedCard] = useState<string | null>(null)

  const { resetOutlines, addOutline, addMultipleOutlines, outlines } = useScratchStore()
  const { setProject } = useSlideStore()


  function handleBack() {
    resetOutlines()
    onBack()
  }

  function resetCards() {
    setEditText('')
    resetOutlines()
  }
  function handleAddCard() {
    const newCard: OutlineCard = {
      id: uuidv4(),
      title: editText || "New Section",
      order: outlines.length + 1,
    }

    setEditText('')
    addOutline(newCard)
  }

  async function handleGenerate() {
    if (outlines.length === 0) {
      toast.error('Error', {
        description: 'Please add at least one card',
      })
      return
    }
    const res = await createProject(outlines?.[0]?.title, outlines)
    if (res.status !== 200) {
      toast.error('Error', {
        description: res.error || "Failed to create project"
      })
      return
    }
    if (res.data) {
      setProject(res.data)
      resetOutlines()

      toast.success('Success', {
        description: 'Project created successfully',
      })
      router.push(`/presentation/${res.data.id}/select-theme`)
    } else {
      toast.error('Error', {
        description: "Failed to create project"
      })
    }
  }

  return (
    <motion.div
      className='space-y-6 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'
      variants={containerVariants}
      initial='hidden'
      animate='visible'
    >
      <Button
        variant={'outline'}
        className='mb-4'
        onClick={handleBack}
      >
        <ChevronLeft className='w-4 h-4' />Back
      </Button>
      <h1 className='text-2xl sm:text-3xl font-bold text-primary text-left'>
        Prompt
      </h1>
      <motion.div
        className='bg-primary/10 p-4 rounded-xl'
        variants={itemVariants}
      >
        <div className='flex flex-col sm:flex-row justify-between gap-3 items-center rounded-xl'>
          <Input
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            placeholder="Enter Prompt and add to the cards..."
            className="text-base sm:text-lg border-0 focus-visible:ring-0 shadow-none p-0 bg-transparent flex-grow"
          />
          <div className='flex items-center gap-3'>
            <Select
              value={outlines.length > 0 ? outlines.length.toString() : '0'}>
              <SelectTrigger className='w-fit gap-2 font-semibold shadow-xl'>
                <SelectValue placeholder='Select number of cards' />
              </SelectTrigger>
              <SelectContent
                className='w-fit'
              >
                {outlines.length === 0 ? (
                  <SelectItem value='0'
                    className='font-semibold'>
                    No cards
                  </SelectItem>
                ) : (
                  Array.from({ length: outlines.length },
                    (_, i) => (
                      <SelectItem
                        key={i}
                        value={i.toString()}
                        className='font-semibold'
                      >
                        {i + 1} {i === 1 ? "Card" : "Cards"}
                      </SelectItem>
                    ))
                )}
              </SelectContent>
            </Select>
            <Button
              variant={'destructive'}
              onClick={resetCards}
              size={'icon'}
              aria-label='Reset Cards'
            >
              <RotateCcw className='w-4 h-4' />
            </Button>
          </div>
        </div>
      </motion.div>
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
      <Button
        onClick={handleAddCard}
        variant={'secondary'}
        className='w-full bg-primary-10'
      >
        Add Card
      </Button>

      {outlines?.length > 0 &&
        <Button
          onClick={handleGenerate}
          className='w-full bg-primary'
        >
          Generate Slides
        </Button>
      }
    </motion.div>
  )
}

export default CreateScratchPage;