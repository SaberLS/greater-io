import { useEffect, useRef } from 'react'
import { useAppDispatch } from '../../../../store/hooks'
import { off, on } from '../../../../store/slices/nav/navSlice'
import { Buttons } from './Buttons'
import { Hero } from './Hero'

function Menu() {
  const loginButtonRef = useRef<HTMLAnchorElement>(null)

  const dispatch = useAppDispatch()

  // TODO: Login button should not be visible on /login path
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        dispatch(entry.isIntersecting ? on() : off())
      },
      {
        threshold: 0,
      }
    )

    const current = loginButtonRef.current
    if (current) {
      observer.observe(current)
    }

    return () => {
      if (current) {
        observer.unobserve(current)
      }
      dispatch(off())
    }
  }, [dispatch, loginButtonRef])

  return (
    <div className="flex flex-col gap-y-3 items-center">
      <Hero />
      <Buttons loginButtonRef={loginButtonRef} />
    </div>
  )
}

export { Menu }
