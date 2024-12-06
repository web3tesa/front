"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const Dialog = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = DialogPrimitive.Portal

const DialogClose = DialogPrimitive.Close

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "mx_fixed mx_inset-0 mx_z-50 mx_bg-black/80 mx_ data-[state=open]:mx_animate-in data-[state=closed]:mx_animate-out data-[state=closed]:mx_fade-out-0 data-[state=open]:mx_fade-in-0",
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "mx_fixed mx_left-[50%] mx_top-[50%] mx_z-50 mx_grid mx_w-full mx_max-w-lg mx_translate-x-[-50%] mx_translate-y-[-50%] mx_gap-4 mx_border mx_bg-background mx_p-6 mx_shadow-lg mx_duration-200 data-[state=open]:mx_animate-in data-[state=closed]:mx_animate-out data-[state=closed]:mx_fade-out-0 data-[state=open]:mx_fade-in-0 data-[state=closed]:mx_zoom-out-95 data-[state=open]:mx_zoom-in-95 data-[state=closed]:mx_slide-out-to-left-1/2 data-[state=closed]:mx_slide-out-to-top-[48%] data-[state=open]:mx_slide-in-from-left-1/2 data-[state=open]:mx_slide-in-from-top-[48%] sm:mx_rounded-lg",
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="mx_absolute mx_right-4 mx_top-4 mx_rounded-sm mx_opacity-70 mx_ring-offset-background mx_transition-opacity hover:mx_opacity-100 focus:mx_outline-none focus:mx_ring-2 focus:mx_ring-ring focus:mx_ring-offset-2 disabled:mx_pointer-events-none data-[state=open]:mx_bg-accent data-[state=open]:mx_text-muted-foreground">
        <X className="mx_h-4 mx_w-4" />
        <span className="mx_sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "mx_flex mx_flex-col mx_space-y-1.5 mx_text-center sm:mx_text-left",
      className
    )}
    {...props}
  />
)
DialogHeader.displayName = "DialogHeader"

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "mx_flex mx_flex-col-reverse sm:mx_flex-row sm:mx_justify-end sm:mx_space-x-2",
      className
    )}
    {...props}
  />
)
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "mx_text-lg mx_font-semibold mx_leading-none mx_tracking-tight",
      className
    )}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("mx_text-sm mx_text-muted-foreground", className)}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
