import React, { useMemo, useRef } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useIntersectionObserver } from '../../common'

import { AnimatePresence, motion } from 'motion/react'
import { useAppSelector } from '../../store/hooks'
import { selectLoginVisible } from '../../store/slices/nav/navSlice'
import { Footer, NavBar } from './components'
import { TopPagePendingLoader } from './components/TopPendingLoader'

function MainApp() {
  const loginVisible = useAppSelector(selectLoginVisible)
  const sentinelRef = useRef<HTMLDivElement>(
    null
  ) as React.RefObject<HTMLDivElement>

  const location = useLocation()

  const scrolled = useIntersectionObserver(sentinelRef, {
    options: { threshold: 0 },
  })

  const navClass =
    'w-full px-2 h-20 fixed top-0 bg-[var(--surface-section)] z-50 transition-shadow duration-200'

  const navClassWithShadow = useMemo(
    () => `${navClass} ${scrolled ? 'shadow-none' : 'shadow-sm'}`,
    [scrolled]
  )

  return (
    <>
      <TopPagePendingLoader />
      <section className="main-app-layout">
        <div
          ref={sentinelRef}
          className="h-0 w-full"
        />
        <nav
          aria-label="Main navigation"
          className={navClassWithShadow}
        >
          <NavBar showLoginButton={!loginVisible} />
        </nav>
        <AnimatePresence>
          <motion.main key={location.key}>
            <Outlet />
          </motion.main>
        </AnimatePresence>
        <footer>
          <Footer></Footer>
        </footer>
      </section>
    </>
  )
}

export { MainApp }
