'use client'
import React, { useEffect, useState } from 'react'
import { useSlideStore } from '@/store/useSlideStore'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Home, Play, Share2 } from 'lucide-react'
import { getProjectById } from '@/actions/project'
import { Project } from '@prisma/client'
import { toast } from 'sonner'

type Props = {
  presentationId: string
}

function Navbar({ presentationId }: Props) {
  const { currentTheme } = useSlideStore()
  const [isPresentationMode, setIsPresentationMode] = useState(false)
  const [projectDetails, setProjectDetails] = useState<Project | null | undefined>(null)

  useEffect(() => {
    const getProject = async () => {
      const projectDetails = await getProjectById(presentationId)
      setProjectDetails(projectDetails?.data)
    }
    getProject()
  }, [])

  function handleCopy() {
    navigator.clipboard.writeText(`${window.location.origin}/share/${presentationId}`)
    toast.success("Success", {
      description: "Link copied to clipboard",
      duration: 5000,
    })
  }

  return (
    <nav className='fixed top-0 left-0 right-0 z-50 w-full h-20 flex justify-between items-center px-7 py-4 border-b border-border'
      style={{
        backgroundColor: currentTheme.navbarColor || currentTheme.backgroundColor,
        color: currentTheme.accentColor,
      }}
    >
      <Link
        href={'/dashboard'}
        passHref>
        <Button
          variant={'outline'}
          className='flex items-center gap-2'
          style={{
            backgroundColor: currentTheme.backgroundColor,
          }}
        >
          <Home className='w-4 h-4' />
          <span className='hidden sm:inline'>Return Home</span>
        </Button>
      </Link>
      <Link
        href={`/presentation/template-market`}
        className='truncate max-w-[150px] hidden sm:block'
        passHref
      >
        {/* {projectDetails?.title} */}
         Presentation Editor
      </Link>

      <div className='flex items-center gap-4'>
        <Button
          variant={'outline'}
          style={{
            backgroundColor: currentTheme.backgroundColor,
          }}
          onClick={handleCopy}
        >
          <Share2 className='w-4 h-4' />
        </Button>
        {/* TODO: Add sell template functionality */}
        {/* <SellTemplate /> */}
        <Button
          variant={'default'}
          onClick={() => setIsPresentationMode(true)}
          className='flex items-center gap-2'
        >
          <Play className='w-4 h-4' />
          <span className='hidden sm:inline'>Present</span>
        </Button>
      </div>
      {/* TODO: add presentation Mode */}
      {/* {isPresentationMode && <PresentationMode />} */}
    </nav>
  )
}

export default Navbar