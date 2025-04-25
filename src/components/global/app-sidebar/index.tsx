'use client'

import { Project, User } from '@prisma/client'
import React from 'react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton
} from '@/components/ui/sidebar'
import { Avatar, AvatarImage } from '@radix-ui/react-avatar'
import NavMain from './nav-main'
import { data } from '@/lib/constants'
import RecentOpen from './recent-open'
import NavFooter from './nav-footer'
import Logo from '../Logo'

type Props = {
  recentProjects?: Project[],
  user: User,
  props?: React.ComponentProps<typeof Sidebar>
}

function AppSidebar({ recentProjects, user, ...props }: Props) {
  return (
    <Sidebar {...props}
      collapsible='icon'
      className='sm:max-w-[212px] bg-background-90'
    >
      <SidebarHeader className='pt-3 pl-3 pb-0'>
        <SidebarMenuButton size={'lg'} className='data-[state=open]:text-sidebar-accent-foreground flex items-center justify-center'>
          <div className='flex aspect-square items-center justify-center rounded-lg text-sidebar-primary-foreground'>
            <Logo />
          </div>
        </SidebarMenuButton>
      </SidebarHeader>

      <SidebarContent className='mt-10 gap-y-6'>
        <NavMain items={data.navMain} />
        {recentProjects?.length && <RecentOpen recentProjects={recentProjects} />}
      </SidebarContent>
      <SidebarFooter>
        <NavFooter prismaUser={user} />
      </SidebarFooter>
    </Sidebar>
  )
}

export default AppSidebar