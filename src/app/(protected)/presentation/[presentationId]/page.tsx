'use client'

import { getProjectById } from '@/actions/project'
import { themes } from '@/lib/constants'
import { useSlideStore } from '@/store/useSlideStore'
import { Loader2 } from 'lucide-react'
import { useTheme } from 'next-themes'
import { redirect, useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import Navbar from './_components/navbar/navbar'
import LayoutPreview from './_components/editor-sidebar/left-sidebar/layout-preview'
import Editor from './_components/editor/editor'
import EditorSidebar from './_components/editor-sidebar/right-sidebar/index'
import { Button } from '@/components/ui/button'

type Props = {}

function Page(props: Props) {
  const { setTheme } = useTheme()
  const params = useParams()
  const { setSlides, setCurrentTheme, currentTheme, setProject, slides } = useSlideStore()

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        // If we already have slides in the store, don't reload them
        if (slides.length > 0) {
          setIsLoading(false);
          return;
        }

        const res = await getProjectById(params.presentationId as string)
        if (res.status !== 200 || !res.data) {
          throw new Error("Unable to fetch project")
        }

        const findTheme = themes.find(theme => theme.name === res.data.themeName)
        setCurrentTheme(findTheme || themes[0])
        setTheme(findTheme?.type === "dark" ? 'dark' : 'light')
        
        // Only update if the store is empty
        if (mounted) {
          setProject(res.data)
          setSlides(JSON.parse(JSON.stringify(res.data.slides)))
        }
      } catch (error) {
        console.log("🔴 ERROR: ", error)
        if (mounted) {
          setError("Unexpected error occurred")
          toast.error("Error", {
            description: "Unexpected error occurred"
          })
        }
      } finally {
        if (mounted) {
          setIsLoading(false)
        }
      }
    })()

    return () => {
      mounted = false;
    }
  }, [params.presentationId, slides.length])

  if (error) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <div className='text-center'>
          <h2 className='text-xl font-bold mb-2'>Error</h2>
          <p className='text-gray-500'>{error}</p>
          <Button 
            className='mt-4'
            onClick={() => window.location.href = '/dashboard'}
          >
            Go to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <Loader2 className='w-8 h-8 animate-spin' />
      </div>
    )
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className='min-h-screen flex flex-col'>
        <Navbar presentationId={params.presentationId as string} />
        <div
          className='flex-1 flex overflow-hidden pt-16'
          style={{
            color: currentTheme.accentColor,
            fontFamily: currentTheme.fontFamily,
            backgroundColor: currentTheme.backgroundColor,
          }}
        >
          <LayoutPreview />
          <div className='flex-1 ml-64 pr-16'>
            <Editor isEditable={true} />
          </div>
          <EditorSidebar />
        </div>
      </div>
    </DndProvider>
  )
}

export default Page