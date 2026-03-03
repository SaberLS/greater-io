import React, { useEffect, useMemo, useState } from 'react'

interface Options {
  once?: boolean
  options?: IntersectionObserverInit
}

function useIntersectionObserver<T extends HTMLElement>(
  ref: React.RefObject<T | null>,
  userOptions?: Options
) {
  const once = useMemo(() => userOptions?.once ?? false, [userOptions?.once])
  const ioOptions = useMemo(
    () => userOptions?.options ?? {},
    [userOptions?.options]
  )

  const [inViewport, setInViewport] = useState(false)

  useEffect(() => {
    const target = ref.current
    if (!target) return

    const observer = new IntersectionObserver(([entry]) => {
      if (once && entry.isIntersecting) {
        observer.unobserve(entry.target)
      }
      setInViewport(entry.isIntersecting)
    }, ioOptions)

    observer.observe(target)

    return () => observer.disconnect()
  }, [ref, userOptions, ioOptions, once])

  return inViewport
}

export { useIntersectionObserver }
