"use client"

import React, {
  useEffect,
  useMemo,
  useState,
  type ComponentPropsWithoutRef,
} from "react"
import { AnimatePresence, motion } from "framer-motion"

import { cn } from "@/lib/utils"

export function AnimatedListItem({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      layout
      className="mx-auto w-full"
      style={{ transformOrigin: "top center" }}
      initial={{ scale: 0.96, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.96, opacity: 0 }}
      transition={{ type: "spring", stiffness: 380, damping: 32 }}
    >
      {children}
    </motion.div>
  )
}

export interface AnimatedListProps extends ComponentPropsWithoutRef<"div"> {
  children: React.ReactNode
  delay?: number
  /** When true (default), newest item appears on top like notifications. Set false for chronological lists (e.g. steps 01→03). */
  reverseStack?: boolean
}

export const AnimatedList = React.memo(
  ({
    children,
    className,
    delay = 1000,
    reverseStack = true,
    ...props
  }: AnimatedListProps) => {
    const [index, setIndex] = useState(0)
    const childrenArray = useMemo(
      () => React.Children.toArray(children),
      [children]
    )

    useEffect(() => {
      let timeout: ReturnType<typeof setTimeout> | null = null

      if (index < childrenArray.length - 1) {
        timeout = setTimeout(() => {
          setIndex((prevIndex) => (prevIndex + 1) % childrenArray.length)
        }, delay)
      }

      return () => {
        if (timeout !== null) {
          clearTimeout(timeout)
        }
      }
    }, [index, delay, childrenArray.length])

    const itemsToShow = useMemo(() => {
      const slice = childrenArray.slice(0, index + 1)
      return reverseStack ? slice.reverse() : slice
    }, [index, childrenArray, reverseStack])

    return (
      <div
        className={cn(`flex flex-col items-center gap-4`, className)}
        {...props}
      >
        <AnimatePresence>
          {itemsToShow.map((item, i) => (
            <AnimatedListItem
              key={
                (item as React.ReactElement).key != null
                  ? String((item as React.ReactElement).key)
                  : `animated-list-${i}`
              }
            >
              {item}
            </AnimatedListItem>
          ))}
        </AnimatePresence>
      </div>
    )
  }
)

AnimatedList.displayName = "AnimatedList"
