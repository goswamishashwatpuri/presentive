'use client'
import React, { useEffect, useState } from 'react'
import { useSlideStore } from '@/store/useSlideStore'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { DraggableSlidePreview } from './editor-sidebar/left-sidebar/draggable-slide-preview'

type Props = {}

function LayoutPreview({ }: Props) {
  const [loading, setLoading] = useState(true)
  const { getOrderedSlides, reorderSlides } = useSlideStore()
  const slides = getOrderedSlides()

  const moveSlide = (dragIndex: number, hoverIndex: number) => {
    reorderSlides(dragIndex, hoverIndex);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setLoading(false)
    }
  }, [])

  return (
    <div className='w-72 h-full fixed left-0 top-20 border-r overflow-y-auto'>
      <ScrollArea className='h-full w-full'>
        {loading ? (
          <div className='pt-8 w-full flex flex-col space-y-8'>
            <Skeleton className='w-full h-20' />
            <Skeleton className='w-full h-20' />
            <Skeleton className='w-full h-20' />
          </div>
        ) : (
          <div className='p-2 pb-32 space-y-6'>
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-sm font-medium dark:text-gray-100 text-gray-500'>
                SLIDES
              </h2>
              <span className='text-xs dark:text-gray-200 text=gray-400'
                suppressHydrationWarning
              >
                {slides.length} slides
              </span>
            </div>

            {slides.map((slide, index) => {
              return (
                <DraggableSlidePreview
                  key={slide.id || index}
                  slide={slide}
                  index={index}
                  moveSlide={moveSlide}
                />
              )
            })}
          </div>
        )}
      </ScrollArea>
    </div>
  )
}

export default LayoutPreview