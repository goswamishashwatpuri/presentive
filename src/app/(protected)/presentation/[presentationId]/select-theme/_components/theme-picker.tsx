'use client'

import { generateLayouts, generateImages } from '@/actions/ai'
import { updateSlides } from '@/actions/project'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Slide, Theme } from '@/lib/types'
import { useSlideStore } from '@/store/useSlideStore'
import { motion } from 'framer-motion'
import { Loader2, Wand2 } from 'lucide-react'
import { useRouter, useParams } from 'next/navigation'
import React, { useState } from 'react'
import { toast } from 'sonner'

type Props = {
  selectedTheme: Theme
  themes: Theme[]
  onThemeSelect: (theme: Theme) => void
}

function ThemePicker({ selectedTheme, themes, onThemeSelect }: Props) {
  const router = useRouter()
  const params = useParams()
  const { project, setSlides, currentTheme, setProject } = useSlideStore()
  const [loading, setLoading] = useState(false)

  async function handleGenerateLayouts() {
    setLoading(true)
    if (!selectedTheme) {
      toast.error("Error", {
        description: "Please select a theme first"
      })
      return;
    }
    if (project?.id === '') {
      toast.error("Error", {
        description: "Please create a project first."
      })
      router.push('/create-page')
      return;
    }
    try {
      const res = await generateLayouts(currentTheme.name, project?.id ?? "")

      if (res.status !== 200 || !res.data) {
        toast.error("Error", {
          description: "Failed to generate layouts"
        })
        return;
      }
      toast.success("Success", {
        description: "Layouts generated successfully"
      })
      setSlides(res.data)

      console.log("🟢 Fetching images...");
      await fetchImages(res.data)
      router.push(`/presentation/${project?.id}`)

    } catch (error) {
      console.error(error)
      toast.error("Error", {
        description: "Failed to generate layouts"
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchImages = async (slides:Slide[]) => {
    try {
      console.log("🟢 Fetching images...");

      const updatedSlides = await generateImages(slides);
      if (updatedSlides.status !== 200 || !updatedSlides.data) {
        throw new Error("Failed to generate images");
      }

      console.log("🟢 Images generated successfully, updating slides...", updatedSlides);
      
      // First update the database
      const updateSlide = await updateSlides(
        params.presentationId as string,
        JSON.stringify(updatedSlides.data)
      );

      if (updateSlide.status !== 200 || !updateSlide.data) {
        throw new Error("Failed to update slides in database");
      }

      // Then update the store
      setProject(updateSlide.data);
      setSlides(updatedSlides.data);

      // Wait a small amount of time to ensure state is synchronized
      await new Promise(resolve => setTimeout(resolve, 100));

      // Finally navigate
      router.push(`/presentation/${project?.id}`);
    } catch (error) {
      console.error("🔴 Error generating images:", error);
      toast.error("Error", {
        description: "Failed to generate images",
      });
    }
  };

  return (
    <div
      className="w-[400px] overflow-hidden sticky top-0 h-screen flex flex-col"
      style={{
        backgroundColor: selectedTheme.sidebarColor || selectedTheme.backgroundColor,
        borderLeft: `1px solid ${selectedTheme.accentColor}20`,
      }}
    >
      <div className="p-8 space-y-6 flex-shrink-0">
        <div className="space-y-2">
          <h2
            className="text-2xl font-bold tracking-tight"
            style={{ color: selectedTheme.accentColor }}
          >
            Pick a theme
          </h2>
          <p
            className="text-sm"
            style={{ color: `${selectedTheme.accentColor}80` }}
          >
            Choose from our collection or generate a custom theme
          </p>
        </div>
        <Button
          className='w-full h-12 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300'
          style={{
            backgroundColor: selectedTheme.accentColor,
            color: selectedTheme.backgroundColor,
          }}
          onClick={handleGenerateLayouts}
        >
          {loading ? (
            <Loader2 className='h-5 w-5 animate-spin' />
          ) : (
            <><Wand2 className='h-5 w-5' />Generate Theme</>
          )}
        </Button>
      </div>
      <ScrollArea className='flex-grow px-8 pb-8'>
        <div className='grid grid-cols-1 gap-4'>
          {themes.map((theme) => (
            <motion.div
              key={theme.name}
              whileHover={{
                scale: 1.02
              }}
              whileTap={{
                scale: 0.98
              }}
            >
              <Button
                onClick={() => onThemeSelect(theme)}
                className='flex flex-col items-center justify-start p-6 w-full h-auto'
                style={{
                  color: theme.fontColor,
                  fontFamily: theme.fontFamily,
                  background: theme.gradientBackground || theme.backgroundColor,
                }}
              >
                <div className='w-full flex items-center justify-between'>
                  <span className='text-xl font-bold'>{theme.name}</span>
                  <div className='w-3 h-3 rounded-full'
                    style={{
                      backgroundColor: theme.accentColor,
                    }}
                  ></div>
                </div>
                <div className='w-full space-y-1'>
                  <div className='text-2xl font-bold'
                    style={{
                      color: theme.accentColor,
                    }}
                  >Title</div>
                  <div>Body &{' '}
                    <span
                      style={{
                        color: theme.accentColor,
                      }}
                    >link</span>
                  </div>
                </div>
              </Button>

            </motion.div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

export default ThemePicker