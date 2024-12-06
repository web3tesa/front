"use client"

import * as React from "react"
import { type DialogProps } from "@radix-ui/react-dialog"
import { Command as CommandPrimitive } from "cmdk"
import { Search } from "lucide-react"

import { cn } from "@/lib/utils"
import { Dialog, DialogContent } from "@/components/ui/dialog"

const Command = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
  <CommandPrimitive
    ref={ref}
    className={cn(
      "mx_flex mx_h-full mx_w-full mx_flex-col mx_overflow-hidden mx_rounded-md mx_bg-popover mx_text-popover-foreground",
      className
    )}
    {...props}
  />
))
Command.displayName = CommandPrimitive.displayName

interface CommandDialogProps extends DialogProps {}

const CommandDialog = ({ children, ...props }: CommandDialogProps) => {
  return (
    <Dialog {...props}>
      <DialogContent className="mx_overflow-hidden mx_p-0 mx_shadow-lg">
        <Command className="[&_[cmdk-group-heading]]:mx_px-2 [&_[cmdk-group-heading]]:mx_font-medium [&_[cmdk-group-heading]]:mx_text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:mx_pt-0 [&_[cmdk-group]]:mx_px-2 [&_[cmdk-input-wrapper]_svg]:mx_h-5 [&_[cmdk-input-wrapper]_svg]:mx_w-5 [&_[cmdk-input]]:mx_h-12 [&_[cmdk-item]]:mx_px-2 [&_[cmdk-item]]:mx_py-3 [&_[cmdk-item]_svg]:mx_h-5 [&_[cmdk-item]_svg]:mx_w-5">
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  )
}

const CommandInput = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
  <div className="mx_flex mx_items-center mx_border-b mx_px-3" cmdk-input-wrapper="">
    <Search className="mx_mr-2 mx_h-4 mx_w-4 mx_shrink-0 mx_opacity-50" />
    <CommandPrimitive.Input
      ref={ref}
      className={cn(
        "mx_flex mx_h-11 mx_w-full mx_rounded-md mx_bg-transparent mx_py-3 mx_text-sm mx_outline-none placeholder:mx_text-muted-foreground disabled:mx_cursor-not-allowed disabled:mx_opacity-50",
        className
      )}
      {...props}
    />
  </div>
))

CommandInput.displayName = CommandPrimitive.Input.displayName

const CommandList = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.List
    ref={ref}
    className={cn("mx_max-h-[300px] mx_overflow-y-auto mx_overflow-x-hidden", className)}
    {...props}
  />
))

CommandList.displayName = CommandPrimitive.List.displayName

const CommandEmpty = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Empty>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>((props, ref) => (
  <CommandPrimitive.Empty
    ref={ref}
    className="mx_py-6 mx_text-center mx_text-sm"
    {...props}
  />
))

CommandEmpty.displayName = CommandPrimitive.Empty.displayName

const CommandGroup = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    className={cn(
      "mx_overflow-hidden mx_p-1 mx_text-foreground [&_[cmdk-group-heading]]:mx_px-2 [&_[cmdk-group-heading]]:mx_py-1.5 [&_[cmdk-group-heading]]:mx_text-xs [&_[cmdk-group-heading]]:mx_font-medium [&_[cmdk-group-heading]]:mx_text-muted-foreground",
      className
    )}
    {...props}
  />
))

CommandGroup.displayName = CommandPrimitive.Group.displayName

const CommandSeparator = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Separator
    ref={ref}
    className={cn("mx_-mx-1 mx_h-px mx_bg-border", className)}
    {...props}
  />
))
CommandSeparator.displayName = CommandPrimitive.Separator.displayName

const CommandItem = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    className={cn(
      "mx_relative mx_flex mx_cursor-default mx_select-none mx_items-center mx_rounded-sm mx_px-2 mx_py-1.5 mx_text-sm mx_outline-none data-[disabled=true]:mx_pointer-events-none data-[selected=true]:mx_bg-accent data-[selected=true]:mx_text-accent-foreground data-[disabled=true]:mx_opacity-50",
      className
    )}
    {...props}
  />
))

CommandItem.displayName = CommandPrimitive.Item.displayName

const CommandShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn(
        "mx_ml-auto mx_text-xs mx_tracking-widest mx_text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}
CommandShortcut.displayName = "CommandShortcut"

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
}
