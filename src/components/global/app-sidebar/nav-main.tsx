import { SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import React from 'react'

type Props = {
  items?: {
    title: string,
    url: string,
    icon: React.FC<React.SVGProps<SVGSVGElement>>,
    isActive?: boolean,
    items?: {
      title: string,
      url: string,
    }[]
  }[]
}

function NavMain({ items }: Props) {
  const pathname = usePathname()

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items?.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              asChild
              tooltip={item.title}
              className={`${pathname.includes(item.url) && 'bg-primary/80 hover:bg-primary/80 hover:text-white dark:bg-background-80'}`}
            >
              <Link href={item.url}
                className={`text-lg ${pathname.includes(item.url) ? "font-semibold text-sidebar-primary-foreground bg-muted" : "text-sidebar-foreground/70"}`}>
                <item.icon className='size-4 text-lg' />
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup >
  )
}

export default NavMain