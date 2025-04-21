'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { JsonValue } from '@prisma/client/runtime/library'

import { useSlideStore } from '@/store/useSlideStore'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import ThumbnailPreview from './thumbnail-preview'
import AlertDialogBox from '../alert-dialog'

import { itemVariants } from '@/lib/constants'
import { timeAgo } from '@/lib/utils'
import { deleteProject, recoverProject } from '@/actions/project'

type Props = {
  projectId: string
  title: string
  themeName: string
  isDeleted?: boolean
  createdAt: Date
  slideData: JsonValue
}

export default function ProjectCard({
  projectId,
  title,
  isDeleted,
  createdAt,
  slideData,
  themeName
}: Props) {

  const router = useRouter()
  const { setSlides } = useSlideStore()
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const handleNavigation = () => {
    setSlides(JSON.parse(JSON.stringify(slideData)))
    router.push(`/presentation/${projectId}`)
  }

  const handleRecover = async () => {
    setLoading(true)
    if (!projectId) {
      setLoading(false)
      toast.error('Error recovering project', {
        description: 'Project not found',
      })
      return
    }
    try {
      const res = await recoverProject(projectId)
      if (res.status !== 200) {
        toast.error('Error!', {
          description: res.error || "Something went wrong."
        })
        return
      }
      setOpen(false)
      setLoading(false)
      toast.success('Success', {
        description: 'Project recovered successfully'
      })
    } catch (error) {
      console.log("🔴 ERROR: ", error)
      setLoading(false)
      toast.error('Error!', {
        description: 'Failed to recover project, please contact support.'
      })
    }
  }

  const handleDelete = async () => {
    setLoading(true)
    if (!projectId) {
      setLoading(false)
      toast.error('Error deleting project', {
        description: 'Project not found',
      })
      return
    }
    try {
      const res = await deleteProject(projectId)
      if (res.status !== 200) {
        toast.error('Error!', {
          description: res.error || "Filed to delete project."
        })
        return
      }
      setOpen(false)
      setLoading(false)
      toast.success('Success', {
        description: 'Project deleted successfully'
      })
    } catch (error) {
      console.log("🔴 ERROR: ", error)
      setLoading(false)
      toast.error('Error!', {
        description: 'Failed to delete project, please contact support.'
      })
    }
  }


  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      className={`bg-white rounded-lg shadow-md overflow-hidden ${isDeleted && 'hover:bg-muted/50'}`}
    >
      <div
        className='relative aspect-[16/10] overflow-hidden rounded-lg coursor-pointer'
        onClick={handleNavigation}
      >
        <ThumbnailPreview
          themeName={themeName}
          // TODO: Add slide data
          slide={JSON.parse(JSON.stringify(slideData))?.[0]}
        />
      </div>
      <div className='w-full'>
        <div className='space-y-1'>
          <h3 className='font-semibold text-base text-primary line-clamp-1'>
            {title}
          </h3>
          <div className='flex w-full justify-between items-center gap-2'>
            <p className='text-sm text-muted-foreground'
              suppressHydrationWarning
            >
              {timeAgo(createdAt.toISOString())}
            </p>
            {isDeleted ? (
              <AlertDialogBox
                description='This will recover your project and restore your data.'
                className='bg-green-500 text-white dark:bg-green-600 hover:bg-green-600 dark:hover:bg-green-700'
                loading={loading}
                open={open}
                handleOpen={() => setOpen(!open)}
                onClick={handleRecover}
              >
                <Button
                  size={'sm'}
                  variant="ghost"
                  className='bg-background-80 dark:hover:bg-background-90'
                  disabled={loading}
                >
                  Recover
                </Button>
              </AlertDialogBox>
            ) : (
              <AlertDialogBox
                description='This will delete your project and send it to trash.'
                className='bg-red-500 text-white dark:bg-red-600 hover:bg-red-600 dark:hover:bg-red-700'
                loading={loading}
                open={open}
                handleOpen={() => setOpen(!open)}
                onClick={handleDelete}
              >
                <Button
                  size={'sm'}
                  variant="ghost"
                  className='bg-background-80 dark:hover:bg-background-90'
                  disabled={loading}
                >
                  Delete
                </Button>
              </AlertDialogBox>
            )}

          </div>
        </div>
      </div>
    </motion.div>
  )
}