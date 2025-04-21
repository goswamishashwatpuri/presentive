import { onAuthenticateUser } from "@/actions/user"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { redirect } from "next/navigation"
import AppSidebar from "@/components/global/app-sidebar/index"
import { getRecentProjects } from "@/actions/project"
import UpperInfoBar from "@/components/global/upper-info-bar/index"

type Props = {
  children: React.ReactNode
}

async function Layout({ children }: Props) {
  const auth = await onAuthenticateUser()

  if (!auth.user) {
    redirect("/signin")
    return;
  }

  const recentProjects = await getRecentProjects()

  return (
    <div>
      <SidebarProvider >
        <AppSidebar
          user={auth.user}
          recentProjects={recentProjects.data}
        />
        <SidebarInset>
          <UpperInfoBar user={auth.user} />
          <div className="p-4">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}

export default Layout