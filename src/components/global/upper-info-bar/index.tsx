import React from 'react'
import { User } from '@prisma/client'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import SearchBar from './upper-info-search-bar'
import ThemeSwitcher from '@/components/global/mode-toggle/index'
import { Button } from '@/components/ui/button'
import { Upload } from 'lucide-react'
import NewProjectButton from './new-project-button'
type Props = {
  user: User
}

function UpperInfoBar({ user }: Props) {
  return (
    <header className='sticky top-0 z-10 flex gap-2 items-center bg-background p-4'>
      <SidebarTrigger className='-ml-1 mr-1' />
      <div className='flex flex-auto flex-wrap justify-between items-center gap-4'>
        <SearchBar />
        <ThemeSwitcher/>
        <div className='flex flex-wrap gap-4 items-center justify-end'>
          <Button className='bg-primary-80 rounded-lg hover:bg-background-80 text-primary font-semibold cursor-not-allowed'>
            <Upload className='w-4 h-4' /> Import
          </Button>
          <NewProjectButton user={user} />
        </div>
      </div>
    </header>
  )
}

export default UpperInfoBar