import { Loader2Icon } from 'lucide-react'

const AuthLoading = () => {
  return (
    <div className='flex h-screen w-full items-center justify-center'>
      <Loader2Icon className='w-10 h-10 animate-spin' />
    </div>
  )
}

export default AuthLoading