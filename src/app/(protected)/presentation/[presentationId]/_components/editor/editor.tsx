'use client'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { LayoutSlides, Slide } from '@/lib/types'
import { cn } from '@/lib/utils'
import { useSlideStore } from '@/store/useSlideStore'
import React, { useEffect, useRef, useState } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import { v4 as uuidv4 } from 'uuid'
import { MasterRecursiveComponent } from './master-recursive-component'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { EllipsisVertical, Trash } from 'lucide-react'

type Props = {
  isEditable: boolean
}

function Editor({ isEditable }: Props) {
  const [loading, setLoading] = useState(true)
  const slideRefs = useRef<(HTMLDivElement | null)[]>([])
  const {
    getOrderedSlides,
    currentSlide,
    removeSlide,
    addSlideAtIndex,
    reorderSlides,
    slides,
    project
  } = useSlideStore()
  const orderedSlides = getOrderedSlides()



  function moveSlide(dragIndex: number, hoverIndex: number) {
    if (isEditable) {
      reorderSlides(dragIndex, hoverIndex)
    }
  }

  function handleDrop(item: {
    type: string
    layoutType: string
    component: LayoutSlides
    index?: number
  }, dropIndex: number) {
    if (!isEditable) return
    if (item.type === 'layout') {
      addSlideAtIndex({
        ...item.component,
        id: uuidv4(),
        slideOrder: dropIndex
      },
        dropIndex)
    } else if (item.type === 'SLIDE' && item.index !== undefined) {
      moveSlide(item.index, dropIndex)
    }
  }

  const handleDelete = (id: string) => {
    if (isEditable) {
      console.log('Deleting', id)
      removeSlide(id)
    }
  }

  useEffect(() => {
    if (slideRefs.current[currentSlide]) {
      slideRefs.current[currentSlide]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      })
    }
  }, [currentSlide])

  useEffect(() => {
    if (slideRefs.current[currentSlide]) {
      slideRefs.current[currentSlide]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      })
    }
  }, [currentSlide])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setLoading(false)
    }

  }, [])


  return (
    <div className='flex-1 flex flex-col h-full max-w-3xl mx-auto px-4 mb-20'>
      {loading ? (
        <div className='w-full px-4 flex flex-col space-y-6'>
          <Skeleton className='mt-8 h-52 w-full' />
          <Skeleton className='h-52 w-full' />
          <Skeleton className='h-52 w-full' />
        </div>
      ) : (
        <ScrollArea className='flex-1 mt-8'>
          <div className='px-4 pt-2 pb-4 space-y-4 '>
            {isEditable &&
              <DropZone
                index={0}
                onDrop={handleDrop}
                isEditable={isEditable}
              />}
            {orderedSlides.map((slide, index) => (
              <React.Fragment
                key={slide.id || index}

              >
                <DraggableSlide
                  slide={slide}
                  index={index}
                  moveSlide={moveSlide}
                  handleDelete={handleDelete}
                  isEditable={isEditable}
                />
              </React.Fragment>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  )
}

interface DropZoneProps {
  index: number
  isEditable: boolean
  onDrop: (
    item: {
      type: string
      layoutType: string
      component: LayoutSlides
      index?: number
    },
    dropIndex: number
  ) => void;
}

function DropZone({
  index,
  onDrop,
  isEditable
}: DropZoneProps) {


  const [{ isOver, canDrop }, dropRef] = useDrop({
    accept: ["SLIDE", "layout"],
    drop: (item: {
      type: string
      layoutType: string
      component: LayoutSlides
      index?: number
    }) => {
      onDrop(item, index)
    },
    canDrop: () => isEditable,
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop()
    }),
  })

  if (!isEditable) return null;

  return (
    <div
      className={cn(
        'h-4 my-2 rounded-md transition-all duration-200',
        isOver && canDrop ? 'border-green-500 bg-green-100' : 'border-gray-300',
        canDrop ? 'border-blue-300' : ''
      )}
    >
      {isOver && canDrop && (
        <div className='h-full flex items-center justify-center text-green-600'>
          Drop here
        </div>
      )}
    </div>
  )
}

interface DraggableSlideProps {
  slide: Slide
  index: number
  moveSlide: (dragIndex: number, hoverIndex: number) => void
  handleDelete: (id: string) => void
  isEditable: boolean
}

export function DraggableSlide({
  slide,
  index,
  moveSlide,
  handleDelete,
  isEditable }: DraggableSlideProps) {

  const ref = useRef(null)
  const { currentSlide, setCurrentSlide, currentTheme, updateContentItem } = useSlideStore()
  const [{ isDragging }, drag] = useDrag({
    type: "SLIDE",
    item: {
      index,
      type: 'SLIDE'
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    }),
    canDrag: isEditable,
  })

  function handleContentChange(
    contentId: string,
    newContent: string | string[] | string[][]) {
    console.log('Content changed', slide, contentId, newContent)
    if (isEditable) {
      updateContentItem(slide.id, contentId, newContent)
    }
  }


  return (
    <div
      ref={ref}
      className={cn('w-full rounded-lg shadow-lg relative p-0 min-h-[400px] max-h-[800px]',
        'shadow-xl transition-shadow duration-300',
        'flex flex-col',
        index === currentSlide ? 'ring-2 rind-blue-500 ring-offset-2' : '',
        slide.className,
        isDragging ? 'opacity-50' : 'opacity-100'
      )}
      data-slide-index={index} //for scrolling into view
      style={{
        backgroundImage: currentTheme.gradientBackground
      }}
      onClick={() => setCurrentSlide(index)}
    >
      <div className='h-full w-full flex-grow overflow-hidden'>
        <MasterRecursiveComponent
          content={slide.content}
          slideId={slide.id}
          isEditable={isEditable}
          isPreview={false}
          onContentChange={handleContentChange}
        />
      </div>
      {isEditable && (<Popover>
        <PopoverTrigger asChild
          className='absolute top-2 left-2'
        >
          <Button
            size="sm"
            variant="outline"
          >
            <EllipsisVertical className="w-5 h-5" />
            <span className="sr-only">Slide options</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-fit p-0'>
          <div className='flex sapce-x-2'>
            <Button
              variant={'ghost'}
              onClick={() => handleDelete(slide.id)}
            >
              <Trash className='w-4 h-4 text-red-500' />
              <span className="sr-only">Delete</span>
            </Button>
          </div>
        </PopoverContent>
      </Popover>)}
    </div>
  )
}




export default Editor;