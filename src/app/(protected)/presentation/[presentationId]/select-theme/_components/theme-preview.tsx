'use client'
import { Button } from '@/components/ui/button'
import { Theme } from '@/lib/types'
import { useSlideStore } from '@/store/useSlideStore'
import { useAnimation } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import ThemeCard from './theme-card'
import ThemePicker from './theme-picker'
import { themes } from '@/lib/constants'

function ThemePreview() {
  const params = useParams()
  const router = useRouter()
  const controls = useAnimation()
  const { currentTheme, setCurrentTheme, project } = useSlideStore()
  const [selectedTheme, setSelectedTheme] = useState<Theme>(currentTheme)

  useEffect(() => {
    if (project?.slides) {
      router.push(`/presentation/${params.presentationId}/`)
    }
  }, [project])

  useEffect(() => {
    controls.start('visible')
  }, [controls, selectedTheme])


  const leftCardContent = (
    <div className="space-y-4">
      <div
        className="rounded-xl p-6"
        style={{ backgroundColor: selectedTheme.accentColor + '10' }}
      >
        <h3
          className="text-xl font-semibold mb-4"
          style={{ color: selectedTheme.accentColor }}
        >
          Quick Start Guide
        </h3>
        <ol
          className="list-decimal list-inside space-y-2"
          style={{ color: selectedTheme.accentColor }}
        >
          <li>Choose a theme</li>
          <li>Customize colors and fonts</li>
          <li>Add your content</li>
          <li>Preview and publish</li>
        </ol>
      </div>
      <Button
        className='w-full h-12 text-lg font-medium'
        style={{
          backgroundColor: selectedTheme.accentColor,
          color: selectedTheme.accentColor
        }}
      >
        Get Started
      </Button>
    </div>
  )

  const mainCardContent = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          className="rounded-xl p-6"
          style={{ backgroundColor: selectedTheme.accentColor + '10' }}
        >
          <p style={{ color: selectedTheme.accentColor }}>
            This is a smart layout: it acts as a text box.
          </p>
        </div>

        <div
          className="rounded-xl p-6"
          style={{ backgroundColor: selectedTheme.accentColor + '10' }}
        >
          <p style={{ color: selectedTheme.accentColor }}>
            You can get these by typing /smart
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-4">
        <Button
          className="h-12 px-6 text-lg font-medium"
          style={{
            backgroundColor: selectedTheme.accentColor,
            color: selectedTheme.fontColor,
          }}
        >
          Primary button
        </Button>
        <Button
          variant="outline"
          className="h-12 px-6 text-lg font-medium"
          style={{
            borderColor: selectedTheme.accentColor,
            color: selectedTheme.fontColor,
          }}
        >
          Secondary button
        </Button>
      </div>
    </div>
  )

  const rightCardContent = (
    <div className='space-y-4'>
      <div className='rounded-xl p-6'
        style={{ backgroundColor: selectedTheme.accentColor + '10' }}
      >
        <h3 className="text-xl font-semibold mb-4"
          style={{ color: selectedTheme.accentColor }}>
          Theme Features
        </h3>
        <ul className="list-disc list-inside space-y-2"
          style={{ color: selectedTheme.accentColor }}
        >
          <li>Responsive design</li>
          <li>Dark and Light Modes</li>
          <li>Custom color schemes</li>
          <li>Accessibility optimized</li>
        </ul>
      </div>
      <Button
        variant={'outline'}
        className='w-full h-12 text-lg font-medium'
        style={{
          borderColor: selectedTheme.accentColor,
          color: selectedTheme.fontColor,
        }}
      >
        Explore Features
      </Button>
    </div>
  )

  const applyTheme = (theme: Theme) => {
    setSelectedTheme(theme)
    setCurrentTheme(theme)
  }

  return (
    <div className="h-screen w-full flex"
      style={{
        backgroundColor: selectedTheme.backgroundColor,
        color: selectedTheme.accentColor,
        fontFamily: selectedTheme.fontFamily,
      }}
    >
      <div className="flex-grow  h-full">
        <div className="p-12 flex flex-col items-center h-full">
          <Button
            variant="outline"
            className=" self-start"
            style={{
              borderColor: selectedTheme.accentColor + '20',
              color: selectedTheme.accentColor,
            }}
            onClick={() => router.push('/create-page')}
          >
            <ArrowLeft className="h-5 w-5" />
            Back
          </Button>
          <div className='relative w-full flex justify-center items-center flex-grow'>
            {"."}
            <ThemeCard
              title="Theme Preview"
              description="Preview the theme"
              content={leftCardContent}
              variant="left"
              theme={selectedTheme}
              controls={controls}
            />
            <ThemeCard
              title="Main Preview"
              description="This is main theme preview card"
              content={mainCardContent}
              variant="main"
              theme={selectedTheme}
              controls={controls}
            />
            <ThemeCard
              title="Theme Features"
              description="Feel what our themes can do"
              content={rightCardContent}
              variant="right"
              theme={selectedTheme}
              controls={controls}
            />

          </div>
        </div>
      </div>
      <ThemePicker
        selectedTheme={selectedTheme}
        themes={themes}
        onThemeSelect={applyTheme}
      />
    </div>
  )
}

export default ThemePreview