import React from 'react'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogCancel,
  AlertDialogFooter
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

type Props = {
  children: React.ReactNode
  className?: string
  description?: string
  loading?: boolean
  onClick?: () => void
  open?: boolean
  handleOpen: (value: boolean) => void
}

function AlertDialogBox({
  children,
  className,
  description,
  loading = false,
  onClick,
  open,
  handleOpen }: Props) {
  return (
    <AlertDialog
      open={open}
      onOpenChange={handleOpen}
    >
      <AlertDialogTrigger asChild>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            variant='destructive'
            onClick={onClick}
            className={`${className}`}
          >
            {loading ?
              <>
                <Loader2 className='w-4 h-4 animate-spin' /> Loading...
              </>
              : 'Continue'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default AlertDialogBox