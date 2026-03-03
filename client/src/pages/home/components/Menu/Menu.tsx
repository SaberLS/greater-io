import { useEffect, useRef } from 'react'
import { off, on } from '../../../../Layouts/MainApp/store/navSlice'
import { useAppDispatch } from '../../../root/store/hooks'
import { Buttons } from './Buttons'
import { Hero } from './Hero'

function Menu() {
  const loginButtonRef = useRef<HTMLAnchorElement>(null)

  const dispatch = useAppDispatch()

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
