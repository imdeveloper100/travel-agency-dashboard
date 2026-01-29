import React from 'react'
import { Button } from './Button'
import { cn } from '@/lib/utils'

const PrimaryButton = ({ children, onClick, className, ...props }) => {
  return (
    <Button
      variant="default"
      size="sm"
      className={cn("bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground cursor-pointer transition-all ease-in-out duration-300 hover:scale-105", className)}
      onClick={onClick}
      {...props}
    >
      {children}
    </Button>
  )
}

export default PrimaryButton