'use client'
import { Button } from '@/components/ui/button'
import { SidebarMenuButton } from '@/components/ui/sidebar'
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuItem } from '@/components/ui/sidebar'
import { useSlideStore } from '@/store/useSlideStore'
import { Project } from '@prisma/client'
import { JsonValue } from '@prisma/client/runtime/library'
import { useRouter } from 'next/navigation'
import React from 'react'
import { toast } from 'sonner'

type Props = {
  recentProjects?: Project[], 
}

function RecentOpen({ recentProjects }: Props) {
  const router = useRouter()
  const {setSlides} = useSlideStore()

  function handleClick(projectId: string, slides: JsonValue) {
    if (!projectId || !slides) {
      toast("Prject not found", { description: "Please try again" })
      return;
    }

    setSlides(JSON.parse(JSON.stringify(slides)))
    router.push(`/presentation/${projectId}`)
  }


  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        Recently Opened
      </SidebarGroupLabel>
      <SidebarMenu>
        {recentProjects?.map((project) => (
          <SidebarMenuItem key={project.id}>
            <SidebarMenuButton asChild
              tooltip={project.title}
              className='hover:bg-primary-80'
            >
              <Button variant={'link'}
                className='text-xs items-center justify-start'
                onClick={() => { handleClick(project.id, project.slides) }}
              >
                <span className='truncate'>
                  {project.title}
                </span>
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}

export default RecentOpen