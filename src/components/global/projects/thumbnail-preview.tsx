import { MasterRecursiveComponent } from '@/app/(protected)/presentation/[presentationId]/_components/editor/master-recursive-component'
import { themes } from '@/lib/constants'
import { Slide, Theme } from '@/lib/types'
import { cn } from '@/lib/utils'
import { ImageIcon } from 'lucide-react'
import React from 'react'

type Props = {
  slide: Slide
  themeName: string
}

function ThumbnailPreview({ slide, themeName }: Props) {

  const theme = themes.find((theme: Theme) => theme.name === themeName) || themes[0]

  // add a preview of the slide
  return (
    <div className={cn(
      'p-2 w-full relative aspect-[16/9] rounded-lg overflow-hidden transition-all duration-200 ',
    )}
      style={{
        fontFamily: theme.fontFamily,
        color: theme.accentColor,
        backgroundColor: theme.backgroundColor,
        backgroundImage: theme.gradientBackground,
      }}
    >
      {slide ?
        <div className='scale-[0.5] origin-top-left w-[200%] h-[200%] overflow-hidden'>
          <MasterRecursiveComponent
            content={slide.content}
            onContentChange={() => {}}
            isPreview={true}
            isEditable={false}
            slideId={slide.id}
          />
        </div>
        :
        <div className='w-full h-full bg-gray-400 flex justify-center items-center'>
          <ImageIcon className='w-6 h-6 text-gray-500' />
        </div>
      }
    </div>
  )
}

export default ThumbnailPreview