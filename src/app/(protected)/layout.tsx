import { onAuthenticateUser } from "@/actions/user"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

type Props = {
  children: React.ReactNode
}

async function layout({ children }: Props) {
  const auth = await onAuthenticateUser()
  if (!auth.user)
    redirect("/signin")

  return (
    <div className="w-full min-h-screen">
      {children}
    </div>
  )
}

export default layout