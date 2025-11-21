"use client"

import { useState, useEffect } from "react"
import { motion } from "motion/react"
import { ArrowUp } from "lucide-react"

interface ScrollToTopProps {
  scrollContainerRef?: React.RefObject<HTMLElement | null>
  showWhenScrolled?: number
  alwaysShow?: boolean
}

export function ScrollToTop({ 
  scrollContainerRef, 
  showWhenScrolled = 200,
  alwaysShow = false 
}: ScrollToTopProps) {
  const [showButton, setShowButton] = useState(alwaysShow)

  // Find the scrollable parent element by walking up the DOM tree
  const findScrollableParent = (element: HTMLElement | null): HTMLElement | null => {
    if (!element) return null
    
    let parent = element.parentElement
    while (parent && parent !== document.body) {
      const style = window.getComputedStyle(parent)
      const overflowY = style.overflowY || style.overflow
      const overflowX = style.overflowX || style.overflow
      
      // Check if element is scrollable
      if ((overflowY === 'scroll' || overflowY === 'auto' || overflowX === 'scroll' || overflowX === 'auto')) {
        if (parent.scrollHeight > parent.clientHeight || parent.scrollWidth > parent.clientWidth) {
          return parent
        }
      }
      
      parent = parent.parentElement
    }
    
    return null
  }

  // Set up scroll listener
  useEffect(() => {
    if (alwaysShow) {
      setShowButton(true)
      return
    }

    const handleScroll = () => {
      // Find scrollable parent from the container ref
      const scrollElement = scrollContainerRef?.current 
        ? findScrollableParent(scrollContainerRef.current)
        : null
      
      if (scrollElement) {
        const scrollTop = scrollElement.scrollTop
        setShowButton(scrollTop > showWhenScrolled)
      } else {
        // Fallback: check window scroll
        setShowButton(window.scrollY > showWhenScrolled)
      }
    }

    // Try to find scrollable element and set up listener
    const setupListener = () => {
      const scrollElement = scrollContainerRef?.current 
        ? findScrollableParent(scrollContainerRef.current)
        : null
      
      if (scrollElement) {
        scrollElement.addEventListener('scroll', handleScroll, { passive: true })
        handleScroll() // Initial check
        return scrollElement
      } else {
        // Fallback: listen to window scroll
        window.addEventListener('scroll', handleScroll, { passive: true })
        handleScroll()
        return window
      }
    }

    const scrollTarget = setupListener()

    // Retry if not found immediately
    const intervalId = setInterval(() => {
      if (!scrollContainerRef?.current || !findScrollableParent(scrollContainerRef.current)) {
        return
      }
      const newTarget = setupListener()
      if (newTarget && newTarget !== scrollTarget) {
        clearInterval(intervalId)
      }
    }, 100)

    return () => {
      clearInterval(intervalId)
      if (scrollTarget && scrollTarget !== window) {
        (scrollTarget as HTMLElement).removeEventListener('scroll', handleScroll)
      } else {
        window.removeEventListener('scroll', handleScroll)
      }
    }
  }, [alwaysShow, showWhenScrolled, scrollContainerRef])

  const scrollToTop = () => {
    // Find scrollable parent
    const scrollElement = scrollContainerRef?.current 
      ? findScrollableParent(scrollContainerRef.current)
      : null
    
    if (scrollElement) {
      // Scroll the found element
      scrollElement.scrollTo({ top: 0, behavior: 'smooth' })
      
      // Fallback: instant scroll if smooth doesn't work
      setTimeout(() => {
        if (scrollElement.scrollTop > 10) {
          scrollElement.scrollTop = 0
        }
      }, 300)
    } else {
      // Fallback: scroll window
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  if (!showButton) {
    return null
  }

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      onClick={scrollToTop}
      className="fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
      style={{
        background: "linear-gradient(to bottom right, #3b82f6, #2563eb)",
        color: "white",
        boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.4), 0 4px 6px -2px rgba(59, 130, 246, 0.2)",
        cursor: 'pointer',
      }}
      aria-label="Scroll to top"
      title="Scroll to top"
    >
      <ArrowUp className="w-6 h-6" />
    </motion.button>
  )
}


